using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.Auth.AuthLoginEndpoint;
using static RS1_2024_25.API.Endpoints.AuthEndpoints.RefreshTokenEndpoint;


namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{

    public class RefreshTokenEndpoint(ApplicationDbContext db, TokenService ts) : MyEndpointBaseAsync
        .WithRequest<RefreshRequest>
        .WithActionResult<RefreshResponse>
    {
        [HttpPost("Refresh")]
        public override async Task<ActionResult<RefreshResponse>> HandleAsync(RefreshRequest request, CancellationToken cancellationToken = default)
        {
            var refreshToken = await db.RefreshTokens
        .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow);

            if (refreshToken == null)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token." });
            }

            // Revoke the old refresh token
            refreshToken.IsRevoked = true;

            // Generate a new access token and refresh token
            var newAccessToken = ts.GenerateAccessToken(refreshToken.MyAppUserId.ToString());
            var newRefreshToken = ts.GenerateRefreshToken(refreshToken.MyAppUserId);

            // Replace the old token with the new one
            refreshToken.ReplacedByToken = newRefreshToken.Token;

            // Save new refresh token to database
            await db.RefreshTokens.AddAsync(newRefreshToken);
            await db.SaveChangesAsync();

            return new RefreshResponse() { AccessToken = newAccessToken, RefreshToken = newRefreshToken.Token };
        }


        public class RefreshRequest
        {
            public string RefreshToken { get; set; }
        }
        public class RefreshResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
        }
    }
}

