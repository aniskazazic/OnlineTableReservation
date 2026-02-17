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
    [Route("userpassword")]
    public class ChangePasswordEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<ChangePasswordRequest>
        .WithoutResult
    {
        [HttpPost("UpdateUserProfile")]
        public override async Task<ActionResult> HandleAsync(ChangePasswordRequest request, CancellationToken cancellationToken = default)
        {
            var user = await db.MyAppUsers
                .FirstOrDefaultAsync(x => x.ID == request.Id && !x.IsDeleted, cancellationToken);

            if (user == null)
                return BadRequest(new { Message = "User not found" });



            {
                if (string.IsNullOrWhiteSpace(request.CurrentPassword))
                    return BadRequest(new { Message = "Current password is required to change your password" });

                var passwordHasher = new PasswordHasher<MyAppUser>();
                var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.CurrentPassword);

                if (result == PasswordVerificationResult.Failed)
                    return BadRequest(new { Message = "Incorrect current password" });

                // Only hash and update if current password was correct
                user.Password = passwordHasher.HashPassword(user, request.NewPassword);
            }






            await db.SaveChangesAsync(cancellationToken);
            return Ok(new { Message = "User password updated successfully" });
        }
    }

    public class ChangePasswordRequest
    {
        public int Id { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}

