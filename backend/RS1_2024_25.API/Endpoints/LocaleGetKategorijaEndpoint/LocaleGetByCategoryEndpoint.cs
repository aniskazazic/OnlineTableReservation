using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.LocaleGetKategorijaEndpoint
{
    [MyAuthorization]
    [Route("LocaleGetCategory")]
    public class LocaleGetByCategoryEndpoint(ApplicationDbContext db, IWebHostEnvironment wh) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<LocaleGetResponse[]>> GetLocalesByCategory(
            [FromQuery] LocaleGetRequest request,
            CancellationToken cancellationToken = default)
        {
            // 1️⃣ Get locales for this category with their average rating
            var localeList = await db.Locales
                .Include(x => x.City)
                .Where(x => x.CategoryId == request.CategoryId && !x.IsDeleted)
                .Select(x => new
                {
                    Locale = x,
                    AvgRating = db.Reviews
                        .Where(r => r.LocaleId == x.Id && !r.IsDeleted)
                        .Select(r => (double?)r.Rating)
                        .Average() ?? 0 // Default to 0 if no reviews
                })
                .OrderByDescending(x => x.AvgRating)
                .Take(5) // 2️⃣ Take top 5
                .ToListAsync(cancellationToken);

            var response = new List<LocaleGetResponse>();

            foreach (var item in localeList)
            {
                var locale = item.Locale;

                // Default image path
                string imagePath = Path.Combine(wh.WebRootPath, "ImageFolder", "NoImage.png");

                if (!string.IsNullOrEmpty(locale.Logo))
                {
                    string logoPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo", locale.Logo);
                    if (System.IO.File.Exists(logoPath))
                    {
                        imagePath = logoPath;
                    }
                }

                // Convert image to Base64
                byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath, cancellationToken);
                string base64Image = $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";

                // Add to response
                response.Add(new LocaleGetResponse
                {
                    LocaleId = locale.Id,
                    Name = locale.Name,
                    CityName = locale.City.Name,
                    Logo = base64Image,
                    AverageRating = Math.Round(item.AvgRating, 2)
                });
            }

            return Ok(response.ToArray());
        }
    }

    public class LocaleGetRequest
    {
        public int CategoryId { get; set; }
    }

    public class LocaleGetResponse
    {
        public int LocaleId { get; set; }
        public string Name { get; set; }
        public string CityName { get; set; }
        public string Logo { get; set; } // Base64 string
        public double AverageRating { get; set; }
    }
}
