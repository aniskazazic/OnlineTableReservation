using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.MyAppUsersEndpoint
{
    [MyAuthorization]
    [Route("user")]
    public class UpdateUserProfileEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<UpdateUserProfileRequest>
        .WithoutResult
    {
        [HttpPost("UpdateUserProfile")]
        public override async Task<ActionResult> HandleAsync(UpdateUserProfileRequest request, CancellationToken cancellationToken = default)
        {
            var user = await db.MyAppUsers
                .FirstOrDefaultAsync(x => x.ID == request.Id && !x.IsDeleted, cancellationToken);

            if (user == null)
                return BadRequest(new { Message = "User not found" });




            // Basic profile updates
            if (!string.IsNullOrWhiteSpace(request.UserName))
                user.Username = request.UserName;
            if (!string.IsNullOrWhiteSpace(request.Email))
                user.Email = request.Email;
            if (!string.IsNullOrWhiteSpace(request.FirstName))
                user.FirstName = request.FirstName;
            if (!string.IsNullOrWhiteSpace(request.LastName))
                user.LastName = request.LastName;
          



            await db.SaveChangesAsync(cancellationToken);
            return Ok(new { Message = "User profile updated successfully" });
        }
    }

    public class UpdateUserProfileRequest
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

    }
}
