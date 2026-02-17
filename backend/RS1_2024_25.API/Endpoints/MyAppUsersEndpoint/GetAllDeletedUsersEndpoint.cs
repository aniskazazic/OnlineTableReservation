using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Endpoints.MyAppUsersEndpoint;

namespace RS1_2024_25.API.Endpoints.MyAppUsersEndpoint
{
    [MyAuthorization(isAdmin:true)]
    [Route("user")]
    public class GetAllDeletedUsersEndpoint(ApplicationDbContext db):MyEndpointBaseAsync
        .WithRequest<GetActiveUsersRequest>
        .WithResult<MyPagedList<GetAllDeletedUsersResponse>>
    {

        [HttpGet("GetDeletedUsers")]
        [MyAuthorization(isAdmin: true)]
        public override async Task<MyPagedList<GetAllDeletedUsersResponse>> HandleAsync([FromQuery] GetActiveUsersRequest request, CancellationToken cancellationToken = default)
        {

            var query = db.MyAppUsers
                 .Where(x => x.IsDeleted == true);

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                string searchLower = request.Search.ToLower();
                query = query.Where(x =>
                    x.FirstName.ToLower().Contains(searchLower) ||
                    x.LastName.ToLower().Contains(searchLower));
            }

            var resultQuery = query.Select(c => new GetAllDeletedUsersResponse
            {
                ID = c.ID,
                Username = c.Username,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                IsAdmin = c.IsAdmin,
                IsOwner = c.IsOwner,
                IsWorker = c.IsWorker,
            });

            var result = await MyPagedList<GetAllDeletedUsersResponse>.CreateAsync(resultQuery, request, cancellationToken);
            return result;
        }


    }




    public class GetAllDeletedUsersResponse
    {
        public int ID { get; set; }
        public string Username { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }

        public bool IsAdmin { get; set; }
        public bool IsOwner { get; set; }
        public bool IsWorker { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedAt { get; set; }
    }
}
