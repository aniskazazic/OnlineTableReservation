using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.CityEndpoints.CityGetAll1Endpoint;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

//bez paging i bez filtera
[Route("cities")]
public class CityGetAll1Endpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<CityGetAll1Response[]>
{
    [HttpGet("all")]
    //[MyAuthorization(isAdmin: true, IsOwner:true)]
    public override async Task<CityGetAll1Response[]> HandleAsync(CancellationToken cancellationToken = default)
    {
        var result = await db.Cities
                        .Select(c => new CityGetAll1Response
                        {
                            ID = c.ID,
                            Name = c.Name,
                            CountryName = c.Country != null ? c.Country.Name : ""
                        })
                        .ToArrayAsync(cancellationToken);

        return result;
    }

    public class CityGetAll1Response
    {
        public required int ID { get; set; }
        public required string Name { get; set; }
        public required string CountryName { get; set; }
    }
}