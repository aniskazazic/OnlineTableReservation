using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Services;

using Microsoft.Extensions.Options;
using Twilio.Clients;
using Twilio.Rest.Verify.V2.Service;
using Twilio.Exceptions;

namespace RS1_2024_25.API.Endpoints.OwnerController
{
    //[MyAuthorization]
    [Route("[controller]/[action]")]
    [ApiController]
    public class OwnerController(
        ApplicationDbContext db,
        MyAuthService myAuthService,
        IOptions<TwilioOptions> twilioOptions
    ) : ControllerBase
    {
        

        [HttpGet("getOwnerId/{userId}")]
        public async Task<IActionResult> GetOwnerId(int userId)
        {
            var owner = await db.Owners.FirstOrDefaultAsync(o => o.ID == userId);
            if (owner == null) return NotFound("Owner not found");
            return Ok(owner.ID);
        }

        [HttpGet]
        public async Task<IActionResult> GetTodaysReservations(int localeId, CancellationToken cancellationToken = default)
        {
            var today = DateTime.Today;
            var count = await db.Reservations
                .Where(x => x.ReservationDate == today && x.Table.LocaleID == localeId)
                .CountAsync(cancellationToken);
            return Ok(count);
        }

        [HttpGet]
        public async Task<IActionResult> GetTodaysGuests(int localeId, CancellationToken cancellationToken = default)
        {
            var today = DateTime.Today;
            var sum = await db.Reservations
                .Where(r => r.ReservationDate.Date == today && r.Table.LocaleID == localeId)
                .SumAsync(r => r.Table.NumberOfGuests, cancellationToken);
            return Ok(sum);
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveTables(int localeId, CancellationToken cancellationToken = default)
        {
            var today = DateTime.Today;
            var active = await db.Reservations
                .Where(r => r.ReservationDate.Date == today && r.Table.LocaleID == localeId)
                .Select(r => r.TableId)
                .Distinct()
                .CountAsync(cancellationToken);
            return Ok(active);
        }

        [HttpGet]
        public async Task<IActionResult> GetTotalTables(int localeId, CancellationToken cancellationToken = default)
        {
            var total = await db.Tables.Where(t => t.LocaleID == localeId).CountAsync(cancellationToken);
            return Ok(total);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyLocale(int localeId, CancellationToken cancellationToken = default)
        {
            var locale = await db.Locales.FirstOrDefaultAsync(l => l.Id == localeId, cancellationToken);
            if (locale == null) return NotFound("No locale with provided ID.");
            return Ok(locale);
        }

        [HttpGet]
        public async Task<IActionResult> GetTableDistribution(int localeId, CancellationToken cancellationToken = default)
        {
            var total = await db.Tables.Where(t => t.LocaleID == localeId).CountAsync(cancellationToken);
            if (total == 0) return Ok(new List<object>());

            var distribution = await db.Tables
                .Where(t => t.LocaleID == localeId)
                .GroupBy(t => t.NumberOfGuests)
                .Select(g => new { Seats = g.Key, Count = g.Count(), Percentage = (double)g.Count() * 100 / total })
                .ToListAsync(cancellationToken);

            return Ok(distribution);
        }

        [HttpGet]
        public async Task<MyPagedList<ReservationGetResponse>> GetAllReservations([FromQuery] ReservationGetRequest request, CancellationToken cancellationToken = default)
        {
            var user = myAuthService.GetAuthInfo(HttpContext);
            var query = db.Reservations.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Q))
            {
                query = query.Where(s =>
                    s.User.FirstName.Contains(request.Q) ||
                    s.User.LastName.Contains(request.Q) ||
                    s.Table.Name.Contains(request.Q));
            }

            var selectedDate = request.Date?.Date ?? DateTime.Today;

            if (user.IsOwner)
            {
                query = query.Where(x => x.ReservationDate == selectedDate &&
                                         x.Table.Locale.OwnerId == user.PersonID);
            }
            else if (user.IsWorker)
            {
                var worker = await db.Workers.FirstOrDefaultAsync(w => w.ID == user.PersonID);
                query = query.Where(x => x.ReservationDate == selectedDate &&
                                         x.Table.LocaleID == worker!.LocaleId);
            }

            var projected = query.Select(s => new ReservationGetResponse
            {
                Id = s.Id,
                FirstName = s.User.FirstName,
                LastName = s.User.LastName,
                ReservationDate = s.ReservationDate,
                StartTime = s.StartTime,
                Guests = s.Table.NumberOfGuests,
                TableName = s.Table.Name,
            });

            return await MyPagedList<ReservationGetResponse>.CreateAsync(projected, request, cancellationToken);
        }

        [HttpGet]
        public async Task<IActionResult> CheckIfOwner(int localeId)
        {
            var userId = myAuthService.GetAuthInfo(HttpContext).PersonID;
            var locale = await db.Locales.FirstOrDefaultAsync(x => x.Id == localeId);
            if (locale == null) return NotFound();
            return Ok(userId == locale.OwnerId);
        }

        [HttpGet]
        public async Task<IActionResult> CheckIfOwnerOrWorker(int localeId)
        {
            var userId = myAuthService.GetAuthInfo(HttpContext).PersonID;
            var locale = await db.Locales.FirstOrDefaultAsync(x => x.Id == localeId);
            if (locale == null) return NotFound();
            if (userId == locale.OwnerId) return Ok();
            bool isWorker = await db.Workers.AnyAsync(w => w.LocaleId == localeId && w.ID == userId);
            if (isWorker) return Ok();
            return Forbid();
        }

        public sealed class Confirm2FADto { public string Code { get; set; } = ""; }

        [HttpGet]
        public async Task<IActionResult> Me()
        {
            var auth = myAuthService.GetAuthInfo(HttpContext);
            if (!auth.IsOwner) return Forbid();

            var owner = await db.Owners.FirstOrDefaultAsync(o => o.ID == auth.PersonID);
            if (owner is null) return NotFound("Owner not found.");

            return Ok(new
            {
                id = owner.ID,
                phoneNumber = owner.PhoneNumber,
                isVerified = owner.IsVerified == true
            });
        }

        [HttpPost]
        public async Task<IActionResult> StartPhoneVerification()
        {
            var auth = myAuthService.GetAuthInfo(HttpContext);
            if (!auth.IsOwner) return Forbid();

            var owner = await db.Owners.FirstOrDefaultAsync(o => o.ID == auth.PersonID);
            if (owner is null) return NotFound("Owner not found.");
            if (owner.IsVerified == true) return BadRequest("Already verified.");
            if (string.IsNullOrWhiteSpace(owner.PhoneNumber)) return BadRequest("Phone number missing.");

            var to = NormalizePhoneBA(owner.PhoneNumber);

            try
            {
                var opt = twilioOptions.Value;
                var client = MakeTwilioClient(opt);

                var v = await VerificationResource.CreateAsync(
                    to: to,
                    channel: "sms",
                    pathServiceSid: opt.VerifyServiceSid,
                    client: client
                );

                return Ok(new { status = v.Status });
            }
            catch (ApiException ex)
            {
                return BadRequest(new { error = ex.Message, code = ex.Code });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmPhoneVerification([FromBody] Confirm2FADto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Code)) return BadRequest("Code required.");

            var auth = myAuthService.GetAuthInfo(HttpContext);
            if (!auth.IsOwner) return Forbid();

            var owner = await db.Owners.FirstOrDefaultAsync(o => o.ID == auth.PersonID);
            if (owner is null) return NotFound("Owner not found.");
            if (owner.IsVerified == true) return BadRequest("Already verified.");
            if (string.IsNullOrWhiteSpace(owner.PhoneNumber)) return BadRequest("Phone number missing.");

            var to = NormalizePhoneBA(owner.PhoneNumber);

            try
            {
                var opt = twilioOptions.Value;
                var client = MakeTwilioClient(opt);

                var c = await VerificationCheckResource.CreateAsync(
                    to: to,
                    code: dto.Code,
                    pathServiceSid: opt.VerifyServiceSid,
                    client: client
                );

                if (c.Status == "approved")
                {
                    owner.IsVerified = true;
                    await db.SaveChangesAsync();
                    return Ok(new { verified = true });
                }

                return BadRequest(new { verified = false, reason = c.Status });
            }
            catch (ApiException ex)
            {
                return BadRequest(new { error = ex.Message, code = ex.Code });
            }
        }


        private static string NormalizePhoneBA(string raw)
        {
            raw = (raw ?? "").Trim();
            if (raw.StartsWith("+")) return raw;
            if (raw.StartsWith("00")) return "+" + raw[2..];
            if (raw.StartsWith("0")) return "+387" + raw[1..];
            if (raw.StartsWith("387")) return "+" + raw;
            return "+" + raw;
        }

        private static TwilioRestClient MakeTwilioClient(TwilioOptions opt)
        {
            if (!string.IsNullOrWhiteSpace(opt.ApiKeySid) && !string.IsNullOrWhiteSpace(opt.ApiKeySecret))
                return new TwilioRestClient(opt.ApiKeySid, opt.ApiKeySecret, opt.AccountSid);

            if (string.IsNullOrWhiteSpace(opt.AccountSid) ||
                string.IsNullOrWhiteSpace(opt.VerifyServiceSid) ||
                string.IsNullOrWhiteSpace(opt.AuthToken))
                throw new InvalidOperationException("Twilio config missing (AccountSid/AuthToken/VerifyServiceSid).");

            return new TwilioRestClient(opt.AccountSid, opt.AuthToken);
        }
    }

    public class ReservationGetRequest : MyPagedRequest
    {
        public string? Q { get; set; } = string.Empty;
        public bool ShowDeleted { get; set; } = true;
        public DateTime? Date { get; set; }
    }

    public class ReservationGetResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public int Guests { get; set; }
        public string TableName { get; set; }
    }
}
