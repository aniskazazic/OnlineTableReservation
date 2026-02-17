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
using static RS1_2024_25.API.Endpoints.Auth.AuthRegisterEndpoint;

namespace RS1_2024_25.API.Endpoints.Auth
{
    [Route("auth")]
    public class AuthRegisterEndpoint(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
        .WithRequest<RegisterRequest>
        .WithoutResult
    {
        [HttpPost("register")]
        public override async Task<ActionResult> HandleAsync(RegisterRequest request, CancellationToken cancellationToken = default)
        {
            var loggedInUser = await db.MyAppUsers
         .FirstOrDefaultAsync(u => u.Username == request.Username , cancellationToken);

            if (loggedInUser != null)
            {
                return Unauthorized(new { Message = "Username already in use" });
            }
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest(new { message = "Password and confirm password do not match" });
            }

            var passwordHasher = new PasswordHasher<MyAppUser>();


            MyAppUser newUser;

            if (request.IsOwner)
            {
                // kreiramo Owner instancu (nasljednik MyAppUser)
                newUser = new Owner
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Username = request.Username,
                    IsAdmin = false,
                    IsWorker = false,
                    IsOwner = true,
                    PhoneNumber=request.PhoneNumber,
                    BirthDate=(DateTime)request.BirthDate,

                };
            }
            else
            {

                newUser = new MyAppUser
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Username = request.Username,
                    IsAdmin = false,
                    IsWorker = false,
                    IsOwner = false
                };
            }

            newUser.Password = passwordHasher.HashPassword(newUser, request.Password);

            db.Add(newUser);
            await db.SaveChangesAsync(cancellationToken);

            return Ok(new {userId = newUser.ID});

        }

        public class RegisterRequest
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
            public required string ConfirmPassword { get; set; }
            public required string FirstName { get; set; }
            public required string LastName { get; set; }
            public required string Email { get; set; }
            public bool IsOwner { get; set; }
            public DateTime? BirthDate { get; set; }
            public string? PhoneNumber {  get; set; }

        }

    }
}
