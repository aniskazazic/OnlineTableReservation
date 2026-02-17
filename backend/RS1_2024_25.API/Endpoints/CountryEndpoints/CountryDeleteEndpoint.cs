using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.CountryEndpoints
{

    [Route("countries")]

    public class CountryDeleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithoutResult
    {

        [HttpDelete("{id}")]
        public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            var country = await db.Countries.SingleOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (country == null)
                throw new KeyNotFoundException("Country not found");

            db.Countries.Remove(country);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
