using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using Stripe.Checkout;
using System.Text.Json;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Services.MyAuthService;
using RS1_2024_25.API.Helper;

[Route("Locale/Save")]
public class SaveLocaleEndpoint(ApplicationDbContext db, MyAuthService authservice, IWebHostEnvironment wh)
    : MyEndpointBaseAsync.WithRequest<SaveLocaleRequest>.WithActionResult
{
    [HttpPost]
    public override async Task<ActionResult> HandleAsync(SaveLocaleRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var sessionService = new SessionService();
            var session = await sessionService.GetAsync(request.SessionId);

            Console.WriteLine($"[SaveLocaleEndpoint] Session ID: {request.SessionId}, PaymentStatus: {session.PaymentStatus}");

            if (session.PaymentStatus != "paid")
                return BadRequest("Payment not successful");

            Console.WriteLine($"[SaveLocale] Incoming data: {JsonSerializer.Serialize(request)}");

            string? logoFileName = null;
            if (!string.IsNullOrWhiteSpace(request.Logo))
            {
                if (request.Logo.Contains("base64"))
                {
                    string folderPath = Path.Combine(wh.WebRootPath, "ImageFolder", "LocaleLogo");
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);


                    var base64 = request.Logo.Split(',')[1];


                    var ext = FileHelper.GetImageTypeFromBase64(request.Logo);
                    var fileName = $"{Guid.NewGuid()}.{ext}";
                    var savePath = Path.Combine(folderPath, fileName);

                    var bytes = Convert.FromBase64String(base64);
                    await System.IO.File.WriteAllBytesAsync(savePath, bytes, cancellationToken);

                    logoFileName = fileName;
                }
                else
                {
                    logoFileName = request.Logo;
                }
            }

            var newLocale = new Locale
            {
                Name = request.Name,
                StartOfWorkingHours = new TimeOnly(request.StartHour, request.StartMinute),
                EndOfWorkingHours = new TimeOnly(request.EndHour, request.EndMinute),
                CityId = request.CityId,
                CategoryId = request.CategoryId,
                OwnerId = request.OwnerId,
                Address = request.Address,
                LengthOfReservation = request.LengthOfReservation,
                Logo = logoFileName
            };

            db.Locales.Add(newLocale);
            await db.SaveChangesAsync(cancellationToken);

            return Ok(new { Id = newLocale.Id });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SaveLocale] Error: {ex}");
            return StatusCode(500, "Internal server error");
        }
    }
}

public class SaveLocaleRequest
{
    public string SessionId { get; set; }
    public string Name { get; set; }
    public int StartHour { get; set; }
    public int StartMinute { get; set; }
    public int EndHour { get; set; }
    public int EndMinute { get; set; }
    public string Address { get; set; }
    public double LengthOfReservation { get; set; }
    public string? Logo { get; set; }
    public int CityId { get; set; }
    public int CategoryId { get; set; }
    public int OwnerId { get; set; }
}
