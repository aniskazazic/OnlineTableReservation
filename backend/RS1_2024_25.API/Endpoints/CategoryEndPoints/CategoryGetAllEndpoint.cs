
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.LocaleImageEndpoints.CategoryGetAllEndpoint;

namespace RS1_2024_25.API.Endpoints.LocaleImageEndpoints
{
    
    [Route("categories")]
    public class CategoryGetAllEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithoutRequest
        .WithResult<CategoryGetAllResponse[]>
    {
        [HttpGet("all")]
        public override async Task<CategoryGetAllResponse[]> HandleAsync(CancellationToken cancellationToken = default)
        {
            var result = await db.Categories
                            .Select(c => new CategoryGetAllResponse
                            {
                                ID = c.Id,
                                Name = c.Name,
                                Description = c.Description

                            })
                            .ToArrayAsync(cancellationToken);

            return result;
        }

        public class CategoryGetAllResponse
        {
            public required int ID { get; set; }
            public required string Name { get; set; }
            public required string Description { get; set; }
        }
    }
}