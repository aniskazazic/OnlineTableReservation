using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations;
using RS1_2024_25.API.Endpoints.OwnerController;

namespace RS1_2024_25.API.Endpoints.TablesEndpoint
{
    [MyAuthorization]
    [Route("Table")]
    public class TableGetEndpoint(ApplicationDbContext db, MyAuthService myAuthService) : MyEndpointBaseAsync
    .WithRequest<TableGetRequest>
    .WithActionResult<TableGetResponse[]>
    {
        [HttpGet("GetByLocale")]
        
        public override async Task<ActionResult<TableGetResponse[]>> HandleAsync([FromQuery]TableGetRequest request, CancellationToken cancellationToken)
        {

            

            // Retrieve tables for the given locale
            var tables = await db.Tables
                .Where(t => t.LocaleID == request.LocaleId)
                .Select(t => new TableGetResponse
                {
                    Id = t.Id,
                    Name = t.Name,
                    XCoordinate = t.XCoordinate,
                    YCoordinate = t.YCoordinate,
                    NumberOfGuests = t.NumberOfGuests,
                })
                .ToArrayAsync(cancellationToken);

            return tables;
        }
    }
    public class TableGetRequest
    {
        public int LocaleId { get; set; }
    }

    public class TableGetResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int XCoordinate { get; set; }
        public int YCoordinate { get; set; }
        public int NumberOfGuests { get; set; }
    }

}
