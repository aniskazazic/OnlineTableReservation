using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Collections;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.LocaleImageEndpoints.LocaleImagePostEnpoint;

namespace RS1_2024_25.API.Endpoints.LocaleImageEndpoints;

[Route("LocaleImage")]
public class LocaleImagePostEnpoint(ApplicationDbContext db, IWebHostEnvironment wh) : MyEndpointBaseAsync
    .WithRequest<LocaleImagePostRequest>
    .WithoutResult
{
    [HttpPost()]
    public override async Task<ActionResult> HandleAsync([FromBody]LocaleImagePostRequest request, CancellationToken cancellationToken = default)
    {
        var locale = await db.Locales.FindAsync(request.LocaleId, cancellationToken);
        if (locale == null)
            return BadRequest("Wrong Locale Id");



        string folderPath = Path.Combine(wh.WebRootPath,"ImageFolder","LocaleImage");
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        byte[] byteArray = Convert.FromBase64String(request.ImageBase64.Split(',')[1]);

        string fileName = Guid.NewGuid().ToString() + "." + FileHelper.GetImageTypeFromBase64(request.ImageBase64);
        string envFile = Path.Combine(folderPath, fileName);

        await System.IO.File.WriteAllBytesAsync(envFile, byteArray);



        var LocaleImage = new LocaleImage
        {
            LocaleId = locale.Id,
            ImageUrl = fileName,
        };
        await db.AddAsync(LocaleImage, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return Ok();
    }

    public class LocaleImagePostRequest{
        public int LocaleId {  get; set; }  
        public string ImageBase64 { get; set; }
    }


}

