using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Services;
using System;
using System.Threading;

namespace RS1_2024_25.API.Endpoints.ReservationsController
{
    [MyAuthorization]
    [Route("[controller]/[action]")]
    [ApiController]
    public class ReservationController(ApplicationDbContext db,IWebHostEnvironment wh) : ControllerBase
    {


        // 1. Create reservation
        [MyAuthorization]
        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationDto dto)
        {
            var overlaps = await db.Reservations.AnyAsync(r =>
                r.TableId == dto.TableId &&
                r.ReservationDate.Date == dto.ReservationDate.Date &&
                r.StartTime < dto.EndTime && dto.StartTime < r.EndTime);

            if (overlaps)
                return BadRequest("Table is already reserved for this time.");

            var reservation = new Reservation
            {
                UserId = dto.UserId,
                TableId = dto.TableId,
                ReservationDate = dto.ReservationDate.Date,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
            };

            db.Reservations.Add(reservation);
            await db.SaveChangesAsync();

            return Ok(reservation);
        }

        // 2. Get available time slots for a table on a given date
        [HttpGet("slots")]
        public async Task<IActionResult> GetAvailableSlots(int tableId, DateTime date)
        {

            var locale=db.Tables.Include(x=>x.Locale).Where(x=>x.Id == tableId).FirstOrDefault().Locale;

            if (locale == null)
            {
                return NotFound("Locale Id not found");
            }

            var open = locale.StartOfWorkingHours.ToTimeSpan();
            var close = locale.EndOfWorkingHours.ToTimeSpan();
            var rl = (locale.LengthOfReservation is null)? 2: (double)locale.LengthOfReservation;
            var slotLength = TimeSpan.FromHours(rl);

            var allSlots = new List<(TimeSpan Start, TimeSpan End)>();
            for (var t = open; t + slotLength <= close; t += slotLength)
                allSlots.Add((t, t + slotLength));

            var reserved = await db.Reservations
                .Where(r => r.TableId == tableId && r.ReservationDate.Date == date.Date)
                .Select(r => new { r.StartTime, r.EndTime })
                .ToListAsync();


            var now=DateTime.Now;

            var available = allSlots
       .Where(slot =>
           !reserved.Any(res => slot.Start < res.EndTime && res.StartTime < slot.End) &&
           date.Date.Add(slot.Start) > now
       )
       .Select(s => new TimeSlotDto
       {
           Start = s.Start.ToString(@"hh\:mm"),
           End = s.End.ToString(@"hh\:mm")
       })
       .ToList();

            return Ok(available);
        }

        // 3. Get reservations for a user
        [HttpGet("by-user/{userId}")]
        [MyAuthorization]
        public async Task<List<ReservationDetailsDTO>> GetUserReservations(int userId,CancellationToken cancellationToken)
        {

            var now = DateTime.Now;



            var reservations = await db.Reservations
            .Where(r => r.UserId == userId)
            .Include(r => r.Table)
                .ThenInclude(t => t.Locale)
            .Where(r =>
                r.ReservationDate > now.Date ||
                (r.ReservationDate == now.Date && r.StartTime > now.TimeOfDay))
            .ToListAsync();


            var result = reservations.Select(r => new ReservationDetailsDTO
            {
                Id = r.Id,
                TableName = r.Table.Name,
                NumberOfGuests = r.Table.NumberOfGuests,
                ReservationDate = r.ReservationDate,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                LocaleId = r.Table.LocaleID,
                LocaleName = r.Table.Locale.Name,
                LocaleAdress = r.Table.Locale.Address,
                LocaleLogo = r.Table.Locale.Logo
            }).ToList();


            foreach (var x in result)
            {
                var imagePath = "";
                string base64Image = "";
                if (!string.IsNullOrEmpty(x.LocaleLogo))
                {
                    string logoPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo", x.LocaleLogo);
                    if (System.IO.File.Exists(logoPath))
                    {
                        byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(logoPath, cancellationToken);
                        base64Image = $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";
                    }
                }


                x.LocaleLogo = base64Image;
            }



            return result;

        }

        // 3. Get reservations for a user
        [HttpGet("by-user/{userId}")]
        public async Task<List<ReservationDetailsDTO>> GetPastUserReservations(int userId, CancellationToken cancellationToken)
        {

            var now = DateTime.Now;



            var reservations = await db.Reservations
            .Where(r => r.UserId == userId)
            .Include(r => r.Table)
                .ThenInclude(t => t.Locale)
            .Where(r =>
                r.ReservationDate < now.Date ||
                (r.ReservationDate == now.Date && r.StartTime < now.TimeOfDay))
            .ToListAsync();


            var result = reservations.Select(r => new ReservationDetailsDTO
            {
                Id = r.Id,
                TableName = r.Table.Name,
                NumberOfGuests = r.Table.NumberOfGuests,
                ReservationDate = r.ReservationDate,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                LocaleId = r.Table.LocaleID,
                LocaleName = r.Table.Locale.Name,
                LocaleAdress = r.Table.Locale.Address,
                LocaleLogo = r.Table.Locale.Logo
            }).ToList();


            foreach (var x in result)
            {
                var imagePath = "";
                string base64Image = "";
                if (!string.IsNullOrEmpty(x.LocaleLogo))
                {
                    string logoPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo", x.LocaleLogo);
                    if (System.IO.File.Exists(logoPath))
                    {
                        byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(logoPath, cancellationToken);
                        base64Image = $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";
                    }
                }


                x.LocaleLogo = base64Image;
            }



            return result;

        }

        // 4. Delete (cancel) reservation
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            var reservation = await db.Reservations.FindAsync(id);
            if (reservation == null)
                return NotFound();

            db.Reservations.Remove(reservation);
            await db.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateReservationDto
    {
        public int UserId { get; set; }
        public int TableId { get; set; }
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }

    public class TimeSlotDto
    {
        public string Start { get; set; }
        public string End { get; set; }
    }

    public class ReservationDetailsDTO
    {
        public int Id { get; set; }
        public string TableName { get; set; }
        public int NumberOfGuests { get; set; }
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int LocaleId {  get; set; }
        public string LocaleName { get; set; }
        public string LocaleAdress { get; set; }
        public string LocaleLogo {  get; set; }

    }


}