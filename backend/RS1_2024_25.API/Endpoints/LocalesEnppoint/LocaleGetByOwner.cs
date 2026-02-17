using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.LocalesEnppoint
{
    [Route("LocaleGetByOwner")]
    [MyAuthorization]
    public class LocaleGetByOwner(ApplicationDbContext db, MyAuthService myAuthService,IWebHostEnvironment wh) : MyEndpointBaseAsync
        .WithRequest<int>
        .WithActionResult<LocaleGetByOwnerResponse[]>
    {
        [HttpGet]
        public override async Task<ActionResult<LocaleGetByOwnerResponse[]>> HandleAsync([FromQuery] int request, CancellationToken cancellationToken = default)
        {
            var locale = await db.Locales.Where(x => x.OwnerId == request && !x.IsDeleted).ToListAsync();

            if (locale == null)
                return NotFound(new { Message = "Locale not found" });

            var result = locale.Select(x => new LocaleGetByOwnerResponse
            {
                LocaleId = x.Id,
                Name = x.Name,
                Logo=x.Logo
            }).ToArray();


            foreach (var x in result)
            {
                string base64Image = "";
                if (!string.IsNullOrEmpty(x.Logo))
                {
                    // Podesite putanju ka direktorijumu gdje se slike čuvaju (ako je potrebno)
                    string logoPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo", x.Logo);
                    if (System.IO.File.Exists(logoPath))
                    {
                        byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(logoPath, cancellationToken);
                        base64Image = $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";
                    }
                }

                // Dodavanje base64 slike u odgovor
                x.Logo = base64Image;
            }

            return result;
        }
    }

    public class LocaleGetByOwnerResponse
    {
        public int LocaleId { get; set; }

        public string Name { get; set; }
        public string? Logo { get; set; }
    }
}
