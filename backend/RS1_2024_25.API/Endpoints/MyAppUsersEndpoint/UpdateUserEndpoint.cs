using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.MyAppUsersEndpoint
{
    [MyAuthorization]
    [Route("user")]
    public class UpdateUserEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<UpdateUserRequest>
        .WithoutResult
    {
        [HttpPost("UpdateUser")]
        public override async Task<ActionResult> HandleAsync(UpdateUserRequest request, CancellationToken cancellationToken = default)
        {
            var user=await db.MyAppUsers.FirstOrDefaultAsync(x=>x.ID==request.Id);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            if(request.UserName!=null)
                user.Username = request.UserName;
            if(request.Email!=null)
                user.Email = request.Email;
            if(request.FirstName!=null)
                user.FirstName = request.FirstName;
            if(request.LastName!=null)
                user.LastName = request.LastName;

            db.Update(user);
            db.SaveChanges();

           return Ok(new { Message = "User updated successfully." });
        }
    }

    public class UpdateUserRequest
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
