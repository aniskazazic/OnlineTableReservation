using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.CityEndpoints.CityGetByIdEndpoint;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

[Route("cities")]
[MyAuthorization]
public class CityGetByIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithResult<CityGetByIdResponse[]>
{
    [HttpGet("{id}")]
    public override async Task<CityGetByIdResponse[]> HandleAsync(int id, CancellationToken cancellationToken = default)
    {
        var city = await db.Cities
                            .Where(c => c.CountryId == id)
                            .Select(c => new CityGetByIdResponse
                            {
                                ID = c.ID,
                                Name = c.Name,
                                CountryId = c.CountryId
                            })
                       .ToArrayAsync(cancellationToken);

        if (city == null)
            throw new KeyNotFoundException("City not found");

        return city;
    }


    


    public class CityGetByIdResponse
    {
        public required int ID { get; set; }
        public required string Name { get; set; }
        public required int CountryId { get; set; }
    }
}
