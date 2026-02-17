using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ReactionsController
{
    [MyAuthorization]
    [Route("[controller]/[action]")]
    [ApiController]
    public class ReactionsController(ApplicationDbContext db, MyAuthService myAuthService) : ControllerBase
    {

        [HttpPost("react")]
        public async Task<IActionResult> ReactToReview(int reviewId, int userId, bool isLike,CancellationToken cancellationToken)
        {
            var existing = await db.Reactions
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId && r.UserId == userId);

            if (existing != null)
            {
                // Update if same reaction is not already set
                if (existing.IsLike != isLike)
                {
                    existing.IsLike = isLike;
                    existing.CreatedAt = DateTime.Now;
                    await db.SaveChangesAsync(cancellationToken);
                }
                return Ok(existing);
            }

            var newReaction = new ReviewReaction
            {
                ReviewId = reviewId,
                UserId = myAuthService.GetAuthInfo(HttpContext).PersonID,
                IsLike = isLike,
                CreatedAt = DateTime.Now
            };

            db.Reactions.Add(newReaction);
            await db.SaveChangesAsync(cancellationToken);

            return Ok(newReaction);
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveReaction(int reviewId, int userId,CancellationToken cancellationToken)
        {
            var reaction = await db.Reactions
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId && r.UserId == userId);

            if (reaction == null)
                return NotFound("Reaction not found.");

            db.Reactions.Remove(reaction);
            await db.SaveChangesAsync(cancellationToken);

            return Ok("Reaction removed.");
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetReactionCounts(int reviewId,CancellationToken cancellationToken)
        {
            var likes = await db.Reactions
                .CountAsync(r => r.ReviewId == reviewId && r.IsLike,cancellationToken);

            var dislikes = await db.Reactions
                .CountAsync(r => r.ReviewId == reviewId && !r.IsLike,cancellationToken);

            return Ok(new { Likes = likes, Dislikes = dislikes });
        }


    }

}

