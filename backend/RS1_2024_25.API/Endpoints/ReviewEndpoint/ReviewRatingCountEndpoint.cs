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

namespace RS1_2024_25.API.Endpoints.ReviewEndpoint
{
    [Route("ReviewRatingCounts")]
    public class ReviewRatingCountsEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
     .WithRequest<ReviewAverageRequest>
     .WithActionResult<ReviewRatingCountResponse>
    {
        [HttpGet]
        public override async Task<ActionResult<ReviewRatingCountResponse>> HandleAsync([FromQuery] ReviewAverageRequest request, CancellationToken cancellationToken = default)
        {
            var locale = await db.Locales.FirstOrDefaultAsync(x => x.Id == request.LocaleId, cancellationToken);
            if (locale == null)
                return BadRequest("Locale not found");

            var reviews = await db.Reviews
                .Where(r => r.LocaleId == request.LocaleId && !r.IsDeleted)
                .ToListAsync(cancellationToken);

            var response = new ReviewRatingCountResponse
            {
                Excellent = reviews.Count(r => r.Rating >= 4.5),
                Good = reviews.Count(r => r.Rating >= 3.5 && r.Rating < 4.5),
                Average = reviews.Count(r => r.Rating >= 2.5 && r.Rating < 3.5),
                Poor = reviews.Count(r => r.Rating >= 1.5 && r.Rating < 2.5),
                Terrible = reviews.Count(r => r.Rating < 1.5)
            };

            return Ok(response);
        }
    }

    public class ReviewRatingCountResponse
    {
        public int Excellent { get; set; }
        public int Good { get; set; }
        public int Average { get; set; }
        public int Poor { get; set; }
        public int Terrible { get; set; }
    }
}
