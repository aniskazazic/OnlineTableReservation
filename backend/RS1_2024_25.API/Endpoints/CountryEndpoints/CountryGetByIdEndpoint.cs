using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CountryEndpoints.CountryGetByIdEndpoint;

namespace RS1_2024_25.API.Endpoints.CountryEndpoints
{
    [Route("countries")]
    public class CountryGetByIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<int>
        .WithResult<CountryGetByIdResponse>
    {
        [HttpGet("getbyid/{id}")]
        public override async Task<CountryGetByIdResponse> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            var country = await db.Countries
                .Where(c => c.ID == id)
                .Select(c => new CountryGetByIdResponse
                {
                    ID = c.ID,
                    Name = c.Name
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (country == null)
                throw new KeyNotFoundException("Country not found");

            return country;
        }

        public class CountryGetByIdResponse
        {
            public required int ID { get; set; }
            public required string Name { get; set; }
        }
    }
}
