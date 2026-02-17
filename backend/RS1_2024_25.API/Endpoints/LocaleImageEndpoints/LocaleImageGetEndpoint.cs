using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.LocaleImageEndpoints.LocaleImageGetEndpoint;

namespace RS1_2024_25.API.Endpoints.LocaleImageEndpoints
{
    public class LocaleImageGetEndpoint(ApplicationDbContext db, IWebHostEnvironment we) : MyEndpointBaseAsync
        .WithRequest<LocaleImageGetRequest>
        .WithActionResult<LocaleImageGetResponse>
    {
        [HttpGet("ImageGet")]
        public override async Task<ActionResult<LocaleImageGetResponse>> HandleAsync([FromQuery] LocaleImageGetRequest request, CancellationToken cancellationToken = default)
        {
            var images = await db.LocaleImages.Where(x => x.LocaleId == request.LocaleId).ToListAsync(cancellationToken);
            //Console.WriteLine(images.Count);

            var response = new LocaleImageGetResponse();
            foreach (var ImageName in images)
            {
                var imagePath = Path.Combine(we.WebRootPath, "ImageFolder", "LocaleImage", ImageName.ImageUrl);
                var byteImage = System.IO.File.ReadAllBytes(imagePath);
                if (byteImage is null)
                {
                    throw new Exception($"Nema slike{ImageName.Id}{ImageName.ImageUrl}");
                }
                response.Images.Add(byteImage);
                response.ContentType.Add(ImageHelper.GetContentType(imagePath));
                response.ImageIds.Add(ImageName.Id);
            }

            return response;
        }

    }


    public class LocaleImageGetRequest
    {
        public int LocaleId { get; set; }
    }

    public class LocaleImageGetResponse
    {
        public List<byte[]> Images { get; set; }
        public List<string> ContentType { get; set; }
        public List<int> ImageIds { get; set; }

        public LocaleImageGetResponse()
        {
            Images = new List<byte[]>();
            ContentType = new List<string>();
            ImageIds = new List<int>();
        }
    }

}
