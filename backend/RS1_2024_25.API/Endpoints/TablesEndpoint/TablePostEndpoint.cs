using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations;
using System.Threading;

namespace RS1_2024_25.API.Endpoints.TableEndpoints
{
    [MyAuthorization]
    [Route("Table")]
    public class TablePostEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<TableRequest>
        .WithoutResult
    {
        [HttpPost("Add")]
        public override async Task<ActionResult> HandleAsync(TableRequest request, CancellationToken cancellationToken)
        {
            // Validate Locale existence
            var locale = await db.Locales.FindAsync(request.LocaleId, cancellationToken);
            if (locale == null)
                return BadRequest(new { Message = "Invalid Locale ID." });

            // Create a new table
            var newTable = new Table
            {
                Name = request.Name,
                LocaleID = request.LocaleId,
                XCoordinate = request.XCoordinate,
                YCoordinate = request.YCoordinate,
                NumberOfGuests = request.NumberOfGuests,
            };

            db.Tables.Add(newTable);
            await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }

    }
    public class TableRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int LocaleId { get; set; }

        [Required]
        public int XCoordinate { get; set; }

        [Required]
        public int YCoordinate { get; set; }

        public int NumberOfGuests { get; set; }
    }
}
