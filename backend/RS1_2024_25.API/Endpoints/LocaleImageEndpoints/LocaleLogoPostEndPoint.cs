
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.LocaleImageEndpoints.LocaleLogoPostEndPoint;
namespace RS1_2024_25.API.Endpoints.LocaleImageEndpoints
{
    [Route("LocaleLogo")]
    public class LocaleLogoPostEndPoint(ApplicationDbContext db, IWebHostEnvironment wh) : MyEndpointBaseAsync
        .WithRequest<LocaleLogoPostRequest>
        .WithoutResult
    {
        [HttpPost()]

        public override async Task<ActionResult> HandleAsync([FromBody] LocaleLogoPostRequest request, CancellationToken cancellationToken = default)
        {
            var locale = await db.Locales.FindAsync(request.LocaleId, cancellationToken);
            if (locale == null)
                return BadRequest("Wrong Locale Id");

            if (string.IsNullOrWhiteSpace(request.Logo) || !request.Logo.Contains("base64"))
                return BadRequest("Invalid or missing logo.");

            string folderPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            byte[] byteArray = Convert.FromBase64String(request.Logo.Split(',')[1]);

            string fileName = Guid.NewGuid().ToString() + "." + FileHelper.GetImageTypeFromBase64(request.Logo);

            string envFile = Path.Combine(folderPath, fileName);

            await System.IO.File.WriteAllBytesAsync(envFile, byteArray);

            locale.Logo = fileName;
            db.Update(locale);
            await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }



    }
    public class LocaleLogoPostRequest
    {
        public int LocaleId { get; set; }
        public string Logo { get; set; }

    }
}