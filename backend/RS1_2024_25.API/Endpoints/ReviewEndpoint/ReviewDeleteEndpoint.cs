using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;

namespace RS1_2024_25.API.Endpoints.ReviewEndpoint
{
    [MyAuthorization]
    [Route("ReviewDelete")]
    public class ReviewDeleteEndpoint(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
        .WithRequest<ReviewDeleteRequest>
        .WithoutResult
    {
        [HttpDelete]
        public override async Task HandleAsync(ReviewDeleteRequest request, CancellationToken cancellationToken = default)
        {
            var review = await db.Reviews
                .Include(x => x.User)
                .Include(x => x.Locale)
                .SingleOrDefaultAsync(x => x.Id == request.ReviewId, cancellationToken);

            if (review == null)
            {
                throw new KeyNotFoundException("Review not found!");
            }

            if (review.UserId != request.UserId)
            {
                throw new UnauthorizedAccessException("You do not have permission to delete this review!");
            }


            review.IsDeleted = true;
            review.DeletedAt = DateTime.UtcNow;

            db.Reviews.Update(review);
            await db.SaveChangesAsync(cancellationToken);
        }
    }

    public class ReviewDeleteRequest
    {
        public int ReviewId { get; set; }
        public int UserId { get; set; } 
    }
}
