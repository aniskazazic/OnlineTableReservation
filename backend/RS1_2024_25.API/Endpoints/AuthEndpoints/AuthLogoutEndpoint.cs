using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.AuthEndpoints.AuthLogoutEndpoint;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints;

[Route("auth")]
public class AuthLogoutEndpoint(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
    .WithRequest<LogoutRequest>
    .WithResult<LogoutResponse>
{
    [HttpPost("logout")]
    public override async Task<LogoutResponse> HandleAsync(LogoutRequest request,CancellationToken cancellationToken = default)
    {
        // Dohvatanje tokena iz headera
        var refreshToken = await db.RefreshTokens
        .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

        if (refreshToken == null)
        {
            return new LogoutResponse() {IsSuccess=false,Message="No Refersh token" };
        }

        // Revoke the token
        refreshToken.IsRevoked = true;
        await db.SaveChangesAsync();

        return new LogoutResponse { IsSuccess = true ,Message="Logout"};
    }
    public class LogoutRequest
    {
        public string RefreshToken { get; set; }
    }
    public class LogoutResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
