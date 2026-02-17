using System;
using System.IdentityModel.Tokens.Jwt;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Services
{
    public class MyAuthService(ApplicationDbContext applicationDbContext, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
    {
        public MyAuthInfo GetAuthInfo(HttpContext httpContext)
        {
            var token = httpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                return new MyAuthInfo { IsLoggedIn = false };
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken;
            JwtSecurityToken jwtToken;

            // Define the validation parameters
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidIssuer = configuration["Jwt:Issuer"],

                ValidateAudience = true,
                ValidAudience = configuration["Jwt:Audience"],

                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero, // Optional: Adjust for server clock differences

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:Key"])
                )
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
                jwtToken = validatedToken as JwtSecurityToken;

                // Ensure token has the expected signature and is not tampered
                if (jwtToken == null || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return new MyAuthInfo { IsLoggedIn = false };
                }

                // Retrieve claims
                var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "UserID")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    throw new Exception("Invalid or missing User ID claim.");
                }

                // Check if user exists in the database
                var user = applicationDbContext.MyAppUsers.FirstOrDefault(x => x.ID == userId);
                if (user == null)
                {
                    return new MyAuthInfo { IsLoggedIn = false };
                }

                // Return user info
                return new MyAuthInfo
                {
                    PersonID = user.ID,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    IsAdmin = user.IsAdmin,
                    IsOwner = user.IsOwner,
                    IsWorker = user.IsWorker,
                    IsLoggedIn = true
                };
            }
            catch (SecurityTokenExpiredException)
            {
                return new MyAuthInfo { IsLoggedIn = false };
            }
            catch (SecurityTokenException ex)
            {
                return new MyAuthInfo { IsLoggedIn = false };
            }
            catch (Exception ex)
            {
                return new MyAuthInfo { IsLoggedIn = false };
            }
        }

        public MyAuthInfo GetAuthInfoFromUser(int id)
        {
            // Check if user exists in the database
            var user = applicationDbContext.MyAppUsers.FirstOrDefault(x => x.ID == id);
            if (user == null)
            {
                return new MyAuthInfo { IsLoggedIn = false };
            }

            // Return user info
            return new MyAuthInfo
            {
                PersonID = user.ID,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsAdmin = user.IsAdmin,
                IsOwner = user.IsOwner,
                IsWorker = user.IsWorker,
                IsLoggedIn = true
            };
        }


        public class MyAuthInfo
        {
            public int PersonID { get; set; }
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public bool IsOwner { get; set; }
            public bool IsWorker { get; set; }
            public bool IsAdmin { get; set; }
            public bool IsLoggedIn { get; set; }
        }
    }
}

