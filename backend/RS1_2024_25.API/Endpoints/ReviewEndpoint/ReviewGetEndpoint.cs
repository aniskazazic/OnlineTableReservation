using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using System.Threading;
using static RS1_2024_25.API.Endpoints.ReviewEndpoint.ReviewGetEndpoint;


namespace RS1_2024_25.API.Endpoints.ReviewEndpoint
{
    [Route("ReviewGet")]
    public class ReviewGetEndpoint(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
        .WithRequest<ReviewGetPagedRequest>
        .WithResult<MyPagedList<ReviewGetResponse>>
    {
        [HttpGet]
        public override async Task<MyPagedList<ReviewGetResponse>> HandleAsync([FromQuery] ReviewGetPagedRequest request, CancellationToken cancellationToken = default)
        {
            var query = db.Reviews
            .Where(x => x.LocaleId == request.LocaleId && !x.IsDeleted)
            .Include(x => x.User)
            .Include(x => x.Locale)
            .OrderByDescending(x => x.Id)
            .Select(x => new ReviewGetResponse
            {
                Id = x.Id,
                Description = x.Description,
                Rating = x.Rating,
                User = x.User,
            });

            var result =  await MyPagedList<ReviewGetResponse>.CreateAsync(query, request, cancellationToken);

            return result;
        }


    }

    public class ReviewGetPagedRequest : MyPagedRequest
    {
        public int LocaleId { get; set; }
    }
    public class ReviewGetResponse
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public float Rating { get; set; }
        public MyAppUser User { get; set; }


    }
}




