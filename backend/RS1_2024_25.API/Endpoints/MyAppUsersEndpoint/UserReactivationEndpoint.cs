using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.MyAppUsersEndpoint
{
    [MyAuthorization(isAdmin:true)]
    [Route("user")]
    public class UserReactivationEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<UserReactivationRequest>
        .WithoutResult
    {
        [HttpPost("ReactivateUser")]
        [MyAuthorization(isAdmin: true)]
        public override async Task<ActionResult> HandleAsync(UserReactivationRequest request, CancellationToken cancellationToken = default)
        {

            var user = await db.MyAppUsers.FirstOrDefaultAsync(x => x.IsDeleted && x.ID == request.Id);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            user.IsDeleted = false;
            user.DeletedAt = null;
            db.Update(user);
            db.SaveChanges();

            return Ok(new { Message = "User reactivated successfully." });
        }
    }
    public class UserReactivationRequest
    {
        public int Id { get; set; }
    }
}
