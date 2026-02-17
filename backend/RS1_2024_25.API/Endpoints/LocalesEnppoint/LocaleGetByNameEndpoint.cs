using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.LocalesEnppoint.LocaleGetByNameEndpoint;

namespace RS1_2024_25.API.Endpoints.LocalesEnppoint;

//sa paging i sa filterom
[MyAuthorization]

[Route("locales")]
public class LocaleGetByNameEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<LocaleGetByNameRequest>
    .WithResult<MyPagedList<LocaleGetByNameResponse>>
{

    [HttpGet("filter")]
    public override async Task<MyPagedList<LocaleGetByNameResponse>> HandleAsync(
        [FromQuery] LocaleGetByNameRequest request,
        CancellationToken cancellationToken = default)
    {
        var query1 = db.Locales
            .Where(x => !x.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.FilterCityName))
            query1 = query1.Where(c => c.City.Name.Contains(request.FilterCityName));

        if (!string.IsNullOrWhiteSpace(request.FilterCountryName))
            query1 = query1.Where(c => c.City.Country != null && c.City.Country.Name.Contains(request.FilterCountryName));

        if (!string.IsNullOrWhiteSpace(request.FilterLocaleName))
            query1 = query1.Where(c => c.Name.Contains(request.FilterLocaleName));

        if (request.FilterCategoryId.HasValue)
            query1 = query1.Where(c => c.CategoryId == request.FilterCategoryId.Value);

        var projectedQuery = query1.Select(c => new LocaleGetByNameResponse
        {
            ID = c.Id,
            CityName = c.City.Name,
            CountryName = c.City.Country.Name != null ? c.City.Country.Name : "",
            LocaleName = c.Name,
            StartOfWorkingHours = c.StartOfWorkingHours,
            EndOfWorkingHours = c.EndOfWorkingHours,
            OwnerName = $"{c.Owner.FirstName} {c.Owner.LastName}",
            Address = c.Address
        });

        var result = await MyPagedList<LocaleGetByNameResponse>.CreateAsync(projectedQuery, request, cancellationToken);
        return result;
    }

    public class LocaleGetByNameRequest : MyPagedRequest
    {
        public string? FilterCityName { get; set; } = string.Empty;
        public string? FilterCountryName { get; set; } = string.Empty;
        public string? FilterLocaleName { get; set; } = string.Empty;

        // ⬇⬇ NOVO:
        public int? FilterCategoryId { get; set; }
    }


    public class LocaleGetByNameResponse
    {
        public required int ID { get; set; }
        public required string CityName { get; set; }
        public required string CountryName { get; set; }
        public required string LocaleName { get; set; }
        public TimeOnly StartOfWorkingHours { get; set; }
        public TimeOnly EndOfWorkingHours { get; set; }
        public string OwnerName { get; set; }
        public string Address { get; set; }
    }
}