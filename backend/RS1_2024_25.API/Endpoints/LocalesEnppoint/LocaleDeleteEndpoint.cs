namespace RS1_2024_25.API.Endpoints.LocalesEnppoint;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;


[Route("locales")]
[MyAuthorization]
public class LocaleDeleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithoutResult
{

    [HttpDelete("{id}")]
    public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
    {
        
        var locales = await db.Locales.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (locales == null)
            throw new KeyNotFoundException("Locales not found");

        locales.IsDeleted = true;
        locales.DeleteAt = DateTime.Now;
        await db.SaveChangesAsync(cancellationToken);
    }
}

