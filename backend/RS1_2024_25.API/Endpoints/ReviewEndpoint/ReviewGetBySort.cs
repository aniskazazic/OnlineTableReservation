using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ReviewEndpoint
{
    [Route("ReviewGetBySort")]
    public class ReviewGetBySort(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
        .WithRequest<ReviewGetBySortPagedRequest>
        .WithResult<MyPagedList<ReviewGetBySortResponse>>
    {

        [HttpGet]
        public override async Task<MyPagedList<ReviewGetBySortResponse>> HandleAsync([FromQuery] ReviewGetBySortPagedRequest request,CancellationToken cancellationToken = default)
        {
            var reactions = db.Reactions.AsQueryable();

            var query = db.Reviews
                .Where(x => x.LocaleId == request.LocaleId && !x.IsDeleted)
                .Include(x => x.User)
                .Include(x => x.Locale)
                .Select(review => new
                {
                    Review = review,
                    Likes = reactions.Count(r => r.ReviewId == review.Id && r.IsLike),
                    Dislikes = reactions.Count(r => r.ReviewId == review.Id && !r.IsLike)
                });

            // Sortiranje
            query = request.SortBy?.ToLower() switch
            {
                "mostlikes" => query.OrderByDescending(x => x.Likes),
                "mostdislikes" => query.OrderByDescending(x => x.Dislikes),
                "highestrating" => query.OrderByDescending(x => x.Review.Rating),
                "lowestrating" => query.OrderBy(x => x.Review.Rating),
                "latest" => query.OrderByDescending(x => x.Review.DateAdded),
                "earliest" => query.OrderBy(x => x.Review.DateAdded),
                _ => query.OrderByDescending(x => x.Review.Id)
            };

            var resultQuery = query.Select(x => new ReviewGetBySortResponse
            {
                Id = x.Review.Id,
                Description = x.Review.Description,
                Rating = x.Review.Rating,
                User = x.Review.User,
                Likes = x.Likes,
                Dislikes = x.Dislikes
            });

            return await MyPagedList<ReviewGetBySortResponse>.CreateAsync(resultQuery, request, cancellationToken);
        }


    }

    public class ReviewGetBySortPagedRequest : MyPagedRequest
    {
        public int LocaleId { get; set; }
        public string? SortBy { get; set; } 
    }

    public class ReviewGetBySortResponse
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public float Rating { get; set; }
        public MyAppUser User { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
    }


}
