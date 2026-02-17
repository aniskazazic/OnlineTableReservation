using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Endpoints.TablesEndpoint;
using RS1_2024_25.API.Services;
using System.Threading;

namespace RS1_2024_25.API.Endpoints.ZonesControllers
{
    [MyAuthorization]
    [Route("[controller]/[action]")]
    [ApiController]
    public class ZonesController(ApplicationDbContext db) : ControllerBase
    {
      
       
        [HttpGet("{id}")]
        public async Task<ActionResult<ZoneDTO[]>> GetZone(int id,CancellationToken cancellationToken)
        {

            var zones = await db.Zones
               .Where(t => t.LocaleId == id)
               .Select(t => new ZoneDTO
               {
                   Id = t.Id,
                   Name = t.Name,
                   XCoordinate = t.XCoordinate,
                   YCoordinate = t.YCoordinate,
                   Height = t.Height,
                   Width = t.Width,
               })
               .ToArrayAsync(cancellationToken);



            if (zones == null)
                return NotFound();

            return zones;
        }

       
        [HttpPost]
        public async Task<ActionResult<Zone>> PostZone(Zone zone)
        {
            db.Zones.Add(zone);
            await db.SaveChangesAsync();

            return Ok();
        }


        [HttpPost]
        public async Task<ActionResult> SaveZoneLayout(ZoneLayoutDTO zones,CancellationToken cancellationToken)
        {
            var existingZones = await db.Zones
                .Where(x => x.LocaleId == zones.LocaleId)
                .ToListAsync();



            var sentZoneIds = zones.Zones.Select(z => z.Id).ToList();

            // Zones that exist in the database but were NOT sent from frontend
            var zonesToDelete = existingZones
                .Where(dbZone => !sentZoneIds.Contains(dbZone.Id))
                .ToList();

            // Example: you could delete them from db
            db.Zones.RemoveRange(zonesToDelete);


            foreach (var zone in zones.Zones)
            {
              
                if (zone.Id == 0)
                {

                    db.Zones.Add(new Zone
                    {
                        LocaleId = zones.LocaleId,
                        Name = zone.Name,
                        XCoordinate = zone.XCoordinate,
                        YCoordinate = zone.YCoordinate,
                        Height = zone.Height,
                        Width = zone.Width,
                    });
                }
                else
                {
                    var existingZone = existingZones.FirstOrDefault(x => x.Id == zone.Id);
                    if (existingZone != null)
                    {
                        existingZone.Name = zone.Name;
                        existingZone.XCoordinate = zone.XCoordinate;
                        existingZone.YCoordinate = zone.YCoordinate;
                        existingZone.Width = zone.Width;
                        existingZone.Height = zone.Height;
                    }
                    db.Update(existingZone);
                }
            }

            // Save changes to the database
            await db.SaveChangesAsync(cancellationToken);

            return Ok(new { Message = "Zones saved" });
        }

    


    [HttpPut("{id}")]
        public async Task<IActionResult> PutZone(Zone zone)
        {
        
            db.Entry(zone).State = EntityState.Modified;

            
                await db.SaveChangesAsync();
         
            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZone(int id)
        {
            var zone = await db.Zones.FindAsync(id);
            if (zone == null)
                return NotFound();

            db.Zones.Remove(zone);
            await db.SaveChangesAsync();

            return NoContent();
        }

    }


    public class ZoneLayoutDTO
    {
        public int LocaleId { get; set; }
        public ZoneDTO[] Zones { get; set; }
    }

    public class ZoneDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public int XCoordinate { get; set; }
        public int YCoordinate { get; set; }
       
    }

}
