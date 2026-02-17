using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Endpoints.TablesEndpoint;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using Stripe.Checkout;
using System.Threading;

namespace RS1_2024_25.API.Endpoints.LocalesEnppoint;

[Route("Locale")]
[MyAuthorization]
public class LocalePostEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<LocaleRequest>.WithActionResult<LocalePostResponse>
{

    
    [HttpPost("CreateCheckoutSession")]
    public override async Task<ActionResult<LocalePostResponse>> HandleAsync(LocaleRequest request, CancellationToken cancellationToken = default)
    {
        var owner = await db.Owners.FindAsync(request.OwnerId, cancellationToken);
        if (owner == null)
            return BadRequest("Wrong Owner Id");

        var existsLocale = await db.Locales
            .FirstOrDefaultAsync(u => u.Name == request.Name, cancellationToken);

        if (existsLocale != null)
        {
            return Conflict(new { Message = "Locale name is already in use!" });
        }

        var sessionOptions = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = 1000 * 100,
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Registration Fee for Locale"
                        }
                    },
                    Quantity = 1
                }
            },
            Mode = "payment",
            SuccessUrl = "http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = "http://localhost:4200/cancel"
        };

        var sessionService = new SessionService();
        var session = await sessionService.CreateAsync(sessionOptions);

        return Ok(new LocalePostResponse
        {
            Id = 0,
            PaymentUrl = session.Url
        });
    }
}

public class LocaleRequest
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public TimeOnly StartOfWorkingHours { get; set; }
    public TimeOnly EndOfWorkingHours { get; set; }
    public int CityId { get; set; }
    public int CategoryId { get; set; }
    public int OwnerId { get; set; }
    public string Address { get; set; }
    public double LengthOfReservation { get; set; }


}

public class LocalePostResponse
{
    public int Id { get; set; }
    public string PaymentUrl { get; set; }
}
