using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using Stripe;
using Stripe.Checkout;
using System.Threading;
using static RS1_2024_25.API.Endpoints.StripeCheckoutEndpoint.CheckoutPostEndpoint;

namespace RS1_2024_25.API.Endpoints.StripeCheckoutEndpoint
{
    [Route("Checkout")]
    public class CheckoutPostEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<CheckoutRequest>
        .WithActionResult<CheckoutResponse>
    {
        [HttpPost("CreateSession")]
        public override async Task<ActionResult<CheckoutResponse>> HandleAsync(CheckoutRequest request, CancellationToken cancellationToken = default)
        {
            var sessionOptions = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = request.Amount * 100,
                            Currency = "usd",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.ProductName
                            }
                        },
                        Quantity = request.Quantity
                    }
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = request.CancelUrl
            };

            var sessionService = new SessionService();
            var session = await sessionService.CreateAsync(sessionOptions);

            return Ok(new CheckoutResponse
            {
                SessionId = session.Id,
                PaymentUrl = session.Url
            });
        }
    }

    public class CheckoutRequest
    {
        public string ProductName { get; set; }
        public long Amount { get; set; } // Cena u centima
        public int Quantity { get; set; }
        public string SuccessUrl { get; set; }
        public string CancelUrl { get; set; }
    }

    public class CheckoutResponse
    {
        public string SessionId { get; set; }
        public string PaymentUrl { get; set; }
    }
}
