using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.CityEndpoints.CityGetByIdEndpoint;

namespace RS1_2024_25.API.Endpoints
{
    [MyAuthorization(isAdmin:true)]
    [Route("[controller]/[action]")]
    [ApiController]
    public class AdminControllers(ApplicationDbContext db) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var users = db.MyAppUsers;
            var locales = db.Locales;

            var stats = new DashboardStatsDto
            {
                CountOfUsers = await users.CountAsync(),
                CountOfDeletedUsers = await users.CountAsync(u => u.IsDeleted),
                CountOfActiveUsers = await users.CountAsync(u => !u.IsDeleted),
                CountOfLocales = await locales.CountAsync(l => !l.IsDeleted)
            };

            return Ok(stats);
        }



        [HttpGet]
        public async Task<ActionResult<DashboardStatsDto>> GetAnalytics()
        {
            var users = await db.MyAppUsers.ToListAsync();
            var locales = await db.Locales
                .Include(l => l.Category)
                .Include(l => l.City)
                    .ThenInclude(c => c.Country)
                .ToListAsync();

            // UserStatsData: [activeCount, deletedCount]
            var activeUsers = users.Count(u => !u.IsDeleted);
            var deletedUsers = users.Count(u => u.IsDeleted);

            // UserRoleData: [ownerCount, workerCount, normalUserCount]
            var ownerCount = users.Count(u => u.IsOwner);
            var workerCount = users.Count(u => u.IsWorker);
            var normalUserCount = users.Count(u => !u.IsOwner && !u.IsWorker && !u.IsAdmin);

            // LocaleCategoryData: ['Coffee Place', 'Night Club', 'Restaurant']
            var categoryCounts = new int[3];
            categoryCounts[0] = locales.Count(l => l.Category != null && l.Category.Id==1);
            categoryCounts[1] = locales.Count(l => l.Category != null && l.Category.Id == 2);
            categoryCounts[2] = locales.Count(l => l.Category != null && l.Category.Id == 3);

            // LocaleCountyData + CountyNames (Top 3 countries)
            var topCountries = locales
                .Where(l => l.City?.Country != null)
                .GroupBy(l => l.City.Country)
                .Select(g => new { CountryName = g.Key.Name, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .ToList();

            var countyNames = topCountries.Select(x => x.CountryName).ToArray();
            var countyCounts = topCountries.Select(x => x.Count).ToArray();

            var result = new AnalyticsDto
            {
                UserStatsData = new[] { activeUsers, deletedUsers },
                UserRoleData = new[] { ownerCount, workerCount, normalUserCount },
                LocaleCategoryData = categoryCounts,
                LocaleCountyData = countyCounts,
                CountyNames = countyNames
            };

            return Ok(result);
        }



        [HttpPut]
        public async Task<IActionResult> UpdateLocale([FromBody] UpdateLocaleRequest request,CancellationToken cancellationToken)
        {
            var locale= await db.Locales.FirstOrDefaultAsync(x=>x.Id== request.Id,cancellationToken);


            if (locale == null)
                return NotFound($"Locale with ID {request.Id} not found.");

            // Update fields
            locale.Name = request.LocaleName;
            locale.CityId = request.CityId;
            locale.Address = request.Address;
            locale.CategoryId = request.CategoryId;

            await db.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "Locale updated successfully." });

        }

        [HttpGet]
        public async Task<CityGetByIdResponse> GetById(int id, CancellationToken cancellationToken = default)
        {
            var city = await db.Cities
                                .Where(c => c.ID == id)
                                .Select(c => new CityGetByIdResponse
                                {
                                    ID = c.ID,
                                    Name = c.Name,
                                    CountryId = c.CountryId
                                })
                           .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (city == null)
                throw new KeyNotFoundException("City not found");

            return city;
        }



    }


    public class DashboardStatsDto
    {
        public int CountOfUsers { get; set; }
        public int CountOfDeletedUsers { get; set; }
        public int CountOfActiveUsers { get; set; }
        public int CountOfLocales { get; set; }
    }

    public class AnalyticsDto
    {
        public int[] UserStatsData { get; set; }

        public int[] UserRoleData { get; set; }

        public int[] LocaleCategoryData { get; set; }

        public int[] LocaleCountyData { get; set; }
        public string[] CountyNames { get; set; }
    }

    public class UpdateLocaleRequest
    {
        public int Id { get; set; }
        public string LocaleName { get; set; }
        public int CountryId { get; set; }
        public int CityId { get; set; }
        public string Address { get; set; }
        public int CategoryId { get; set; }
    }


}
