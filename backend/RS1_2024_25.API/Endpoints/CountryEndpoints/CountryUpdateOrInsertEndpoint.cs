using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.CountryEndpoints.CountryUpdateOrInsertEndpoint;

namespace RS1_2024_25.API.Endpoints.CountryEndpoints
{
    [Route("countries")]
    public class CountryUpdateOrInsertEndpoint(ApplicationDbContext db, MyAuthService myAuthService) : MyEndpointBaseAsync
         .WithRequest<CountryUpdateOrInsertRequest>
         .WithActionResult<CountryUpdateOrInsertResponse>
    {
        [HttpPost]
        public override async Task<ActionResult<CountryUpdateOrInsertResponse>> HandleAsync([FromBody] CountryUpdateOrInsertRequest request, CancellationToken cancellationToken = default)
        {

            bool isInsert = (request.ID == null || request.ID == 0);
            Country? country;

            if (isInsert)
            {
                country = new Country();
                db.Countries.Add(country); 
            }
            else
            {
                country = await db.Countries.FindAsync(new object[] { request.ID }, cancellationToken);

                if (country == null)
                {
                    throw new KeyNotFoundException("Country not found");
                }
            }

            country.Name = request.Name;

            await db.SaveChangesAsync(cancellationToken);

            return new CountryUpdateOrInsertResponse
            {
                ID = country.ID,
                Name = country.Name,
            };
        }

        public class CountryUpdateOrInsertRequest
        {
            public int? ID { get; set; } 
            public required string Name { get; set; }
        }

        public class CountryUpdateOrInsertResponse
        {
            public required int ID { get; set; }
            public required string Name { get; set; }
        }
    }
}
