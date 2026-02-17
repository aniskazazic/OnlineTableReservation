using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using System.Threading;
using static RS1_2024_25.API.Endpoints.ReviewEndpoint.ReviewUpdateEndpoint;

namespace RS1_2024_25.API.Endpoints.ReviewEndpoint
{
    [MyAuthorization]
    [Route("ReviewUpdate")]
    public class ReviewUpdateEndpoint(ApplicationDbContext db, MyAuthService authService) :MyEndpointBaseAsync
        .WithRequest<ReviewUpdateRequest>
        .WithoutResult
    {
        [HttpPut]
        public override async Task<ActionResult> HandleAsync(ReviewUpdateRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                var review = await db.Reviews.FindAsync(request.Id, cancellationToken);

                if (review == null)
                {
                    return NotFound("Review not found!");
                }

                if (review.UserId != request.UserId)
                {
                    return Forbid("You can only update your own reviews!");
                }


                if (string.IsNullOrWhiteSpace(request.Description))
                {
                    return BadRequest("Description cannot be empty.");
                }

                if (request.Rating < 1 || request.Rating > 5)
                {
                    return BadRequest("Rating must be between 1 and 5.");
                }

                review.Description = request.Description;
                review.Rating = request.Rating;

                db.Reviews.Update(review);
                await db.SaveChangesAsync(cancellationToken);

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred. Please try again later.");
            }
        }

    }


    public class ReviewUpdateRequest
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public float Rating { get; set; }
        public int UserId { get; set; }
    }

}
