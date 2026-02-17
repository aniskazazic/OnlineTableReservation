using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.MyAppUsersEndpoint
{
    [MyAuthorization]
    [Route("user")]
    public class DeleteUserEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<DeleteUserRequest>
        .WithoutResult
    {
        [HttpPost("DeleteUser")]
        public override async Task<ActionResult> HandleAsync(DeleteUserRequest request, CancellationToken cancellationToken = default)
        {

            var user = await db.MyAppUsers.FirstOrDefaultAsync(x => x.ID == request.Id,cancellationToken);
            if (user == null)
            {
                return BadRequest((new { Message = "User not found" })); 
            }

            user.IsDeleted = true;
            user.DeletedAt = DateTime.UtcNow;

            db.Update(user);
            db.SaveChanges();

            return Ok(new { Message = "User deleted successfully." }); ;
        }
    }


    public class DeleteUserRequest
    {
        public int Id { get; set; }
    }
}
