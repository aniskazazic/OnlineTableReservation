using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Text.Json.Serialization;
using static RS1_2024_25.API.Endpoints.CityEndpoints.CityGetAll1Endpoint;

namespace RS1_2024_25.API.Endpoints.MyAppUsersEndpoint
{
    [MyAuthorization(isAdmin:true)]
    [Route("user")]
    public class GetAllActiveUsersEndpoint(ApplicationDbContext db): MyEndpointBaseAsync
        .WithRequest<GetActiveUsersRequest>
        .WithResult<MyPagedList<GetAllUsersResponse>>
    {
        [HttpGet("GetActiveUsers")]
        [MyAuthorization(isAdmin: true)]
        public override async Task<MyPagedList<GetAllUsersResponse>> HandleAsync([FromQuery]GetActiveUsersRequest request, CancellationToken cancellationToken = default) {

            var query = db.MyAppUsers.AsQueryable();

            if (!request.ShowDeleted)
            {
                query = query.Where(x => x.IsDeleted == false);
            }

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                string searchLower = request.Search.ToLower();
                query = query.Where(x =>
                    x.FirstName.ToLower().Contains(searchLower) ||
                    x.LastName.ToLower().Contains(searchLower));
            }

            var resultQuery = query.Select(c => new GetAllUsersResponse
            {
                ID = c.ID,
                Username = c.Username,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                IsAdmin = c.IsAdmin,
                IsOwner = c.IsOwner,
                IsWorker = c.IsWorker,
                IsDeleted = c.IsDeleted,
            });

            var result = await MyPagedList<GetAllUsersResponse>.CreateAsync(resultQuery, request, cancellationToken);
            return result;
        }

    }


    public class GetActiveUsersRequest : MyPagedRequest
    {
        public string? Search { get; set; }
        public bool ShowDeleted { get; set; }
    }

    public class GetAllUsersResponse
    {
        public int ID { get; set; }
        public string Username { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }

        public bool IsAdmin { get; set; }
        public bool IsOwner { get; set; }
        public bool IsWorker { get; set; }

        public bool IsDeleted {  get; set; }
    }
}
