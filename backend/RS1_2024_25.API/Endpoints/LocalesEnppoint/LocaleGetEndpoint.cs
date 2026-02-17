using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.LocalesEnppoint.LocaleGetEndpoint;


namespace RS1_2024_25.API.Endpoints.LocalesEnppoint
{
    [Route("LocaleGet")]
    [MyAuthorization]
    public class LocaleGetEndpoint(ApplicationDbContext db,IWebHostEnvironment wh):MyEndpointBaseAsync
        .WithRequest<int>
        .WithActionResult<LocaleGetResponseId>
    {
        [HttpGet]
        public override async Task<ActionResult<LocaleGetResponseId>> HandleAsync([FromQuery]int request, CancellationToken cancellationToken = default)
        {
            var locale = await db.Locales
        .Include(x => x.Owner)
        .Include(x => x.City)
        .FirstOrDefaultAsync(x => x.Id == request  && !x.IsDeleted, cancellationToken);

            if (locale == null)
                return NotFound(new { Message = "Locale not found" });

            var imagePath = "";
            string base64Image = "";
            if (!string.IsNullOrEmpty(locale.Logo))
            {
                string logoPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo", locale.Logo);
                if (System.IO.File.Exists(logoPath))
                {
                    byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(logoPath, cancellationToken);
                    base64Image = $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";
                }
            }


            LocaleGetResponseId response = new LocaleGetResponseId
            {
                Id = locale.Id,
                Name = locale.Name,
                Logo = base64Image,
                CityId = locale.CityId,
                CityName = locale.City.Name,
                CategoryId = locale.CategoryId,
                StartOfWorkingHours = locale.StartOfWorkingHours,
                EndOfWorkingHours = locale.EndOfWorkingHours,
                OwnerName = $"{locale.Owner.FirstName} {locale.Owner.LastName}",
                Address = locale.Address
            };




            return response;
        }


    }


    public class LocaleGetResponseId
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Logo { get; set; }
        public int CityId { get; set; }
        public string CityName { get; set; }
        public int CategoryId { get; set; } 
        public TimeOnly StartOfWorkingHours { get; set; }
        public TimeOnly EndOfWorkingHours { get; set; }
        public string OwnerName { get; set; }
        public string Address { get; set; }
    }

}
