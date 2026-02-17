using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.TablesEndpoint
{
    [MyAuthorization]
    [Route("Table")]
    public class SaveTableLayoutEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<SaveTableLayoutRequest>
        .WithoutResult
    {
        [HttpPost("SaveTaleLayout")]
        public override async Task<ActionResult> HandleAsync(SaveTableLayoutRequest request, CancellationToken cancellationToken = default)
        {
            // Fetch existing tables for the specified LocaleId
            var existingTables = await db.Tables
                .Where(x => x.LocaleID == request.LocaleId)
                .ToListAsync();



            var sentTablesIds = request.tables.Select(z => z.Id).ToList();

            // Zones that exist in the database but were NOT sent from frontend
            var TablesToDelete = existingTables
                .Where(dbZone => !sentTablesIds.Contains(dbZone.Id))
                .ToList();

            // Example: you could delete them from db
            db.Tables.RemoveRange(TablesToDelete);



            // Process each table in the request
            foreach (var table in request.tables)
            {
                if (table.Id == 0)
                {
                    // New table, add it to the database
                    db.Tables.Add(new Table
                    {
                        LocaleID = request.LocaleId,
                        Name = table.Name,
                        XCoordinate = table.XCoordinate,
                        YCoordinate = table.YCoordinate,
                        NumberOfGuests = table.NumberOfGuests,
                    });
                }
                else
                {
                    // Existing table, find it in the database and update
                    var existingTable = existingTables.FirstOrDefault(x => x.Id == table.Id);
                    if (existingTable != null)
                    {
                        existingTable.Name = table.Name;
                        existingTable.XCoordinate = table.XCoordinate;
                        existingTable.YCoordinate = table.YCoordinate;
                        existingTable.NumberOfGuests= table.NumberOfGuests;
                    }
                    db.Update(existingTable);
                }
            }

            // Save changes to the database
            await db.SaveChangesAsync(cancellationToken);

            return Ok(new {Message="Tables saved"});
        }

    }

    public class SaveTableLayoutRequest
    {
        public int LocaleId { get; set; }
        public TableGetResponse[] tables { get; set; }
    }
}
