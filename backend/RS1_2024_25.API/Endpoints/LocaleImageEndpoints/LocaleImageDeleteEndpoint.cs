using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.LocaleImageEndpoints;

[Route("LocaleImage/Delete")]
public class LocaleImageDeleteEndpoint(ApplicationDbContext db, IWebHostEnvironment wh) : MyEndpointBaseAsync
    .WithRequest<int> // očekujemo Id slike
    .WithoutResult
{
    [HttpDelete("{id}")]
    public override async Task<ActionResult> HandleAsync([FromRoute] int id, CancellationToken cancellationToken = default)
    {
        var image = await db.LocaleImages.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (image == null)
            return NotFound("Image not found");

        // putanja do fajla
        string folderPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleImage");
        string filePath = Path.Combine(folderPath, image.ImageUrl);

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        db.LocaleImages.Remove(image);
        await db.SaveChangesAsync(cancellationToken);

        return Ok("Image deleted successfully");
    }
}
