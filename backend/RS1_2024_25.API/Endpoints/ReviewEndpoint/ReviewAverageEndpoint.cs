using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Endpoints.LocalesEnppoint;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using System.Threading;
using static RS1_2024_25.API.Endpoints.ReviewEndpoint.ReviewUpdateRequest;


namespace RS1_2024_25.API.Endpoints.ReviewEndpoint
{
    [Route("ReviewAverage")]
    public class ReviewAverageEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<ReviewAverageRequest>
        .WithActionResult<ReviewAverageResponse>
    {

        [HttpGet]
        public override async Task<ActionResult<ReviewAverageResponse>> HandleAsync([FromQuery]ReviewAverageRequest request, CancellationToken cancellationToken = default)
        {

            
                var locale = await db.Locales.FirstAsync(x => x.Id == request.LocaleId);
                if (locale == null)
                {
                    return BadRequest("Locale not found");
                }

                var reviews = await db.Reviews.Where(r => r.LocaleId == request.LocaleId && !r.IsDeleted).ToListAsync(cancellationToken);

                if (reviews.Count == 0)
                {
                    var response = new ReviewAverageResponse { AverageRating = 0 };
                    return Ok(response);
                }

                else
                {
                    var averageRating = reviews.Average(x=>x.Rating);

                    var response = new ReviewAverageResponse { AverageRating = averageRating };

                    return Ok(response);
                }              
        }
    }

    public class ReviewAverageRequest
    {
        public int LocaleId { get; set; }
    }
    public class ReviewAverageResponse
    {
        public float AverageRating { get; set; }
    }

}
