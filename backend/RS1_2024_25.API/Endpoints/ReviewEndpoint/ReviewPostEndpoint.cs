using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using System.Threading;
using static RS1_2024_25.API.Endpoints.ReviewEndpoint.ReviewPostEndpoint;

namespace RS1_2024_25.API.Endpoints.ReviewEndpoint
{
    [MyAuthorization]
    [Route("ReviewPost")]
    public class ReviewPostEndpoint(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
        .WithRequest<ReviewPostRequest>
        .WithoutResult
    {
        [HttpPost]
        public override async Task<ActionResult> HandleAsync(ReviewPostRequest request, CancellationToken cancellationToken = default)
        {
            var user = await db.MyAppUsers.FindAsync(request.UserId, cancellationToken);
            if (user == null)
                return BadRequest("Wrong User Id");

            var locale = await db.Locales.FindAsync(request.LocaleId, cancellationToken);
            if (locale == null)
                return BadRequest("Wrong Locale Id");

            if (request.Rating < 1 || request.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5  !");
            }

            if (string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest("You must add description !");
            }

            //PROVJERA
            var existingReview = await db.Reviews
                .FirstOrDefaultAsync(r => r.UserId == request.UserId && r.LocaleId == request.LocaleId && !r.IsDeleted, cancellationToken);

            if (existingReview != null)
                return BadRequest("You have already submitted a review for this locale.");

            var newReview = new Review
            {
                Description = request.Description,
                Rating = request.Rating,
                UserId = request.UserId,
                LocaleId = request.LocaleId,           
            };

            db.Reviews.Add(newReview);
            await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }


    }

    public class ReviewPostRequest
    {
        public string Description { get; set; }
        public float Rating { get; set; }
        public int UserId { get; set; }
        public int LocaleId { get; set; }     
    }
}
