using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.LocalesEnppoint
{

    [Route("Locale")]
    public class LocaleUpdateEndpoint(ApplicationDbContext db,MyAuthService authservice, IWebHostEnvironment wh) : MyEndpointBaseAsync
        .WithRequest<LocaleUpdateRequest>
        .WithoutResult
    {

        [HttpPost("localeupdate")]
        [MyAuthorization]
        public override async Task<ActionResult> HandleAsync(LocaleUpdateRequest request, CancellationToken cancellationToken = default)
        {
            var locale = await db.Locales.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (locale == null)
                return BadRequest(new { Message = "Locale not found ! " });

            if (request.Name != null)
                locale.Name = request.Name;

            if (request.StartOfWorkingHours != default)
                locale.StartOfWorkingHours = request.StartOfWorkingHours;

            if (request.EndOfWorkingHours != default)
                locale.EndOfWorkingHours = request.EndOfWorkingHours;

            if (request.CityId != 0)
                locale.CityId = request.CityId;

            if (request.CategoryId != 0)
                locale.CategoryId = request.CategoryId;

            if (request.Address != null)
                locale.Address = request.Address;

            if (request.LengthOfReservation > 0)
                locale.LengthOfReservation = request.LengthOfReservation;

            // ⬇️ NOVO: logo kao u SaveLocale
            if (!string.IsNullOrWhiteSpace(request.Logo))
            {
                if (request.Logo.Contains("base64"))
                {
                    string folderPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo");
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    // data:image/png;base64,XXXXX
                    var base64 = request.Logo.Split(',')[1];

                    var ext = FileHelper.GetImageTypeFromBase64(request.Logo); // isti helper kao u SaveLocale
                    var fileName = $"{Guid.NewGuid()}.{ext}";
                    var savePath = Path.Combine(folderPath, fileName);

                    var bytes = Convert.FromBase64String(base64);
                    await System.IO.File.WriteAllBytesAsync(savePath, bytes, cancellationToken);

                    locale.Logo = fileName; // u bazu ide samo "xxxxx.png"
                }
                else
                {
                    // već dobio filename — samo zadrži
                    locale.Logo = request.Logo;
                }
            }

            db.Update(locale);
            await db.SaveChangesAsync(cancellationToken);
            return Ok(new { Message = "Locale updated ! " });
        }

    }


    public class LocaleUpdateRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public TimeOnly StartOfWorkingHours { get; set; }
        public TimeOnly EndOfWorkingHours { get; set; }
        public int CityId { get; set; }
        public int CategoryId { get; set; }
        public string Address { get; set; }
        public double LengthOfReservation { get; set; }

        public string? Logo { get; set; }

    }


}
