using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RS1_2024_25.API.Endpoints.MyAppUsersEndpoint
{
    [MyAuthorization]
    [Route("user")]
    public class GetUserByIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<GetUserByIdRequest>
        .WithActionResult<GetUserByIdResponse>
    {
        [HttpPost("GetUserById")]
        public override async Task<ActionResult<GetUserByIdResponse>> HandleAsync(GetUserByIdRequest request, CancellationToken cancellationToken = default)
        {
            var user=await db.MyAppUsers.FirstOrDefaultAsync(x=>x.ID==request.Id);
            if (user == null)
                return BadRequest("User not found");

            var response = new GetUserByIdResponse
            {
                ID = user.ID,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Password = user.Password,
                IsAdmin = user.IsAdmin,
                IsOwner = user.IsOwner,
                IsWorker = user.IsWorker,
                IsDeleted = user.IsDeleted,
            };


            return response;
        }
    }

    public class GetUserByIdRequest
    {
        public int Id { get; set; }
    }
    public class GetUserByIdResponse
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsOwner { get; set; }
        public bool IsWorker { get; set; }
        public bool IsDeleted { get; set; } = false;
    }

}
