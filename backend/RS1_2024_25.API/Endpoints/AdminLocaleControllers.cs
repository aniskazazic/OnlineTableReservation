using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.MyAppUsersEndpoint;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Services;
using System.Threading;

namespace RS1_2024_25.API.Endpoints
{
    [MyAuthorization(isAdmin:true)]
    [Route("[controller]/[action]")]
    [ApiController]
    public class AdminLocaleControllers(ApplicationDbContext db) : ControllerBase
    {

        [HttpGet]
        public async Task<MyPagedList<GetLocaleAdminResponse>> GetAllLocale([FromQuery]GetLocaleAdminRequest request,CancellationToken cancellationToken)
        {
            var query=db.Locales.AsQueryable();
            if (!request.ShowDeleted)
            {
                query = query.Where(x => x.IsDeleted == false);
            }

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                string searchLower = request.Search.ToLower();
                query = query.Where(x =>
                    x.Name.ToLower().Contains(searchLower));
            }

            var resultQuery = query.Select(c => new GetLocaleAdminResponse
            {

                Id = c.Id,
                LocaleName = c.Name,
                City = c.City.Name,
                Country = c.City.Country.Name,
                Category = c.Category.Name,
                Address = c.Address,
                IsDeleted = c.IsDeleted,
                CountryId=c.City.CountryId,
                CityId=c.CityId,
                CategoryId=c.CategoryId,
            });

            var result = await MyPagedList<GetLocaleAdminResponse>.CreateAsync(resultQuery, request, cancellationToken);
            return result;


        }

        [HttpPut]
        public async Task<ActionResult> ReactiveLocale (int id)
        {
            var locale = await db.Locales.FirstOrDefaultAsync(x => x.IsDeleted && x.Id == id);
            if (locale == null)
            {
                return BadRequest("User not found");
            }

            locale.IsDeleted = false;
            locale.DeleteAt = null;
            db.Locales.Update(locale);
            db.SaveChanges();
            

            return Ok(new { Message = "Locale reactivated successfully." });
        }


    }

    public class GetLocaleAdminRequest : MyPagedRequest
    {
        public string? Search { get; set; }
        public bool ShowDeleted {  get; set; }
    }

    public class GetLocaleAdminResponse
    {
        public int Id {  get; set; }    
        public string LocaleName { get; set; }
        public string City {  get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string Category {  get; set; }

        public int CategoryId { get; set; }
        public int CityId { get; set; }
        public int CountryId { get; set; }



        public bool IsDeleted { get; set; }

    }

}
