using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Endpoints.FavouritesController;
using RS1_2024_25.API.Migrations;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.FavouritesController
{
    [MyAuthorization]
    [Route("[controller]/[action]")]
    [ApiController]
    public class FavouritesController(ApplicationDbContext db, MyAuthService myAuthService, IWebHostEnvironment wh) : ControllerBase
    {
        
        [HttpPost("add")]
        public async Task<IActionResult> AddToFavourites(int userId, int localeId,CancellationToken cancellationToken)
        {
            var existing = await db.Favourites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.LocaleId == localeId);

            if (existing != null && existing.IsActive)
            {
                return BadRequest("Lokal je već u favoritima.");
            }

            if (existing != null)
            {
                existing.IsActive = true;
                existing.DateAdded = DateTime.Now;
            }
            else
            {
                var fav = new Favourite
                {
                    UserId = myAuthService.GetAuthInfo(HttpContext).PersonID,
                    LocaleId = localeId,
                    DateAdded = DateTime.Now,
                    IsActive = true
                };
                db.Favourites.Add(fav);
            }

            await db.SaveChangesAsync(cancellationToken);
            return Ok("Lokal je dodat u favorite.");
        }

       
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromFavourites(int userId, int localeId,CancellationToken cancellationToken)
        {
            var fav = await db.Favourites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.LocaleId == localeId && f.IsActive);

            if (fav == null)
                return NotFound("Lokal nije u favoritima.");

            db.Favourites.Remove(fav);

            await db.SaveChangesAsync(cancellationToken);
            return Ok("Lokal je uklonjen iz favorita.");
        }

   
        [HttpGet("is-favourited")]
        public async Task<IActionResult> IsFavourited(int userId, int localeId,CancellationToken cancellationToken)
        {
            bool isFav = await db.Favourites
                .AnyAsync(f => f.UserId == userId && f.LocaleId == localeId && f.IsActive);

            return Ok(isFav);
        }

    
        [HttpGet("user/{userId}")]
        public async Task<List<FavouriteDTO>> GetFavouritesByUser(int userId,CancellationToken cancellationToken)
        {
            var favourites = await db.Favourites
            .Include(f => f.Locale).Include(x=>x.User)
            .Where(f => f.UserId == userId && f.IsActive).ToListAsync(cancellationToken);


            var result = favourites.Select(x => new FavouriteDTO
            {
                Id = x.Id,
                LocaleId = x.LocaleId,
                LocaleName = x.Locale.Name,
                LocaleAddress = x.Locale.Address,
                StartOfWorkingHours = x.Locale.StartOfWorkingHours,
                EndOfWorkingHours = x.Locale.EndOfWorkingHours,
                LocaleLogo=x.Locale.Logo
            }).ToList();

            foreach (var x in result)
            {
                string base64Image = "";
                if (!string.IsNullOrEmpty(x.LocaleLogo))
                {
                    // Podesite putanju ka direktorijumu gdje se slike čuvaju (ako je potrebno)
                    string logoPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo", x.LocaleLogo);
                    if (System.IO.File.Exists(logoPath))
                    {
                        byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(logoPath, cancellationToken);
                        base64Image = $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";
                    }
                }

                // Dodavanje base64 slike u odgovor
                x.LocaleLogo = base64Image;
            }

            return result;
        }


    }
    public class FavouriteDTO
    {
        public int Id { get; set; }
        public int LocaleId {  get; set; }
        public string LocaleName {  get; set; }
        public string LocaleAddress {  get; set; }
        public string LocaleLogo {  get; set; }
        public TimeOnly StartOfWorkingHours { get; set; }
        public TimeOnly EndOfWorkingHours { get; set; }
    }
}

