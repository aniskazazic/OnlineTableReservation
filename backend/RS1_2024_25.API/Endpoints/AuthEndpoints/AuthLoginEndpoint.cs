using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.Auth.AuthLoginEndpoint;
using static RS1_2024_25.API.Services.MyAuthService.MyAuthInfo;

namespace RS1_2024_25.API.Endpoints.Auth
{
    [Route("auth")]
    public class AuthLoginEndpoint(ApplicationDbContext db,TokenService ts, MyAuthService myAuthService) : MyEndpointBaseAsync
        .WithRequest<LoginRequest>
        .WithActionResult<LoginResponse>
    {
        [HttpPost("login")]
        public override async Task<ActionResult<LoginResponse>> HandleAsync(LoginRequest request, CancellationToken cancellationToken = default)
        {
            var user = await db.MyAppUsers
             .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsDeleted == false, cancellationToken);

            if (user == null)
                return BadRequest(new { Message = "Incorrect username or password" });

            var passwordHasher = new PasswordHasher<MyAppUser>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return BadRequest(new { Message = "Incorrect username or password" });

            var accessToken = ts.GenerateAccessToken(user.ID.ToString());
            var refreshToken = ts.GenerateRefreshToken(user.ID);

            await db.RefreshTokens.AddAsync(refreshToken);
            await db.SaveChangesAsync();

            return new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                MyAuthInfo = myAuthService.GetAuthInfoFromUser(user.ID)
            };

        }

        public class LoginRequest
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
        }

        public class LoginResponse
        {
            public MyAuthService.MyAuthInfo MyAuthInfo { get; set; }
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
        }
    }
}
