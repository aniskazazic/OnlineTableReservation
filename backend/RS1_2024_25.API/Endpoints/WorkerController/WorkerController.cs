using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.WorkerController
{
    [MyAuthorization]
    [Route("[controller]/[action]")]
    [ApiController]
    public class WorkerController(ApplicationDbContext db, MyAuthService myAuthService) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkerById(int id, CancellationToken cancellationToken = default)
        {
            var worker = await db.Workers
                .Include(x => x.Locale)
                .FirstOrDefaultAsync(x => x.ID == id && !x.IsDeleted && x.IsWorker, cancellationToken);

            if (worker == null)
                return NotFound();

            var response = new WorkerGetByIdResponse
            {
                Id = worker.ID,
                FirstName = worker.FirstName,
                LastName = worker.LastName,
                Email = worker.Email,
                Username = worker.Username,
                PhoneNumber = worker.PhoneNumber,
                BirthDate = worker.BirthDate,
                HireDate = worker.HireDate,
                Password = worker.Password,
                LocaleId = worker.LocaleId,
            };

            return Ok(response);
        }


        [HttpGet]
        public async Task<IActionResult> LocaleGetByWorkerId(CancellationToken cancellationToken = default)
        {
            var workerId = myAuthService.GetAuthInfo(HttpContext).PersonID;

            var worker = await db.Workers
                .Include(w => w.Locale)
                .FirstOrDefaultAsync(w => w.ID == workerId && !w.IsDeleted && w.IsWorker, cancellationToken);

            if (worker == null)
                return NotFound("Worker not found or does not have an assigned locale.");

            return Ok(worker.Locale);
        }



        [HttpPost]
        public async Task<ActionResult> AddWorker([FromBody] WorkerRequest request, CancellationToken cancellationToken = default)
        {
            var ownerId = myAuthService.GetAuthInfo(HttpContext).PersonID;

            var locale = await db.Locales
                .FirstOrDefaultAsync(x => x.Id == request.LocaleId && x.OwnerId == ownerId, cancellationToken);

            if (locale == null)
                return BadRequest("Invalid locale or you do not own this locale.");

            var passwordHasher = new PasswordHasher<MyAppUser>();

            var worker = new Worker
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Username = request.Username,
                PhoneNumber = request.PhoneNumber,
                BirthDate = request.BirthDate,
                HireDate = DateTime.Now,
                LocaleId = request.LocaleId,
                IsWorker = true
            };

            worker.Password = passwordHasher.HashPassword(worker, request.Password);

            await db.Workers.AddAsync(worker,cancellationToken);
            await db.SaveChangesAsync(cancellationToken);

            return Ok(worker);
        }

        [HttpGet]
        public async Task<MyPagedList<WorkerGetResponse>> GetAllWorkers([FromQuery] WorkerGetRequest request, CancellationToken cancellationToken = default)
        {
            var ownerId = myAuthService.GetAuthInfo(HttpContext).PersonID;

            var localeIds = await db.Locales.Where(x => x.OwnerId == ownerId).Select(x => x.Id)
                .ToListAsync(cancellationToken);

            var query = db.Workers
                .Include(x => x.Locale)
                .Where(x => !x.IsDeleted && x.IsWorker && localeIds.Contains(x.LocaleId))
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Q))
            {
                query = query.Where(x =>
                    x.FirstName.Contains(request.Q) ||
                    x.LastName.Contains(request.Q) ||
                    x.Username.Contains(request.Q));
            }

            var projected = query.Select(x => new WorkerGetResponse
            {
                ID = x.ID,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                Username = x.Username,
                PhoneNumber = x.PhoneNumber,
                HireDate = x.HireDate,
            });

            return await MyPagedList<WorkerGetResponse>.CreateAsync(projected, request, cancellationToken);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateWorker(int id, [FromBody] WorkerUpdateRequest request, CancellationToken cancellationToken = default)
        {
            var ownerId = myAuthService.GetAuthInfo(HttpContext).PersonID;

            var worker = await db.Workers
                .Include(x => x.Locale)
                .FirstOrDefaultAsync(x => x.ID == id && !x.IsDeleted && x.IsWorker, cancellationToken);

            if (worker == null)
                return NotFound();

            var locale = await db.Locales
                .FirstOrDefaultAsync(x => x.Id == worker.LocaleId && x.OwnerId == ownerId, cancellationToken);

            if (locale == null)
                return Forbid("You do not have permission to update this worker.");

            worker.ID = request.ID;
            worker.FirstName = request.FirstName;
            worker.LastName = request.LastName;
            worker.Email = request.Email;
            worker.Username = request.Username;
            worker.PhoneNumber = request.PhoneNumber;
            worker.HireDate = request.HireDate;

            db.Update(worker);
            await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> WorkerUpdateOrInsert([FromBody] WorkerUpdateOrInsertRequest request, CancellationToken cancellationToken = default)
        {
            var ownerId = myAuthService.GetAuthInfo(HttpContext).PersonID;

            bool isInsert = request.Id == null || request.Id == 0;
            Worker? worker;

            if (isInsert)
            {       
            // Validacija lokala
            var locale = await db.Locales
                .FirstOrDefaultAsync(x => x.Id == request.LocaleId && x.OwnerId == ownerId, cancellationToken);

            if (locale == null)
                return BadRequest("Invalid locale or you do not own this locale.");

            if (request.LocaleId == null || request.BirthDate == null)
                return BadRequest("LocaleId and BirthDate are required for new workers.");
                
            worker = new Worker
            {
                LocaleId = (int)request.LocaleId,
                BirthDate = (DateTime)request.BirthDate,
                HireDate = DateTime.Now,
                IsWorker = true
            };

            db.Workers.Add(worker);
            }
            else
            {
                worker = await db.Workers
                    .Include(x => x.Locale)
                    .FirstOrDefaultAsync(x => x.ID == request.Id && !x.IsDeleted && x.IsWorker, cancellationToken);

                if (worker == null)
                    return NotFound("Worker not found.");

                if (worker.Locale.OwnerId != ownerId)
                    return Forbid("You do not have permission to update this worker.");

                // Update hire date only if passed
                worker.HireDate = request.HireDate ?? worker.HireDate;

                // Update birth date only if passed
                if (request.BirthDate.HasValue)
                {
                    worker.BirthDate = request.BirthDate.Value;
                }
            }


            var passwordHasher = new PasswordHasher<MyAppUser>();

                worker.FirstName = request.FirstName;
                worker.LastName = request.LastName;
                worker.Email = request.Email;
                worker.Username = request.Username;
                worker.PhoneNumber = request.PhoneNumber;
                

            // Lozinka samo ako je prosleđena
            if (!string.IsNullOrWhiteSpace(request.Password))
                {
                    worker.Password = passwordHasher.HashPassword(worker, request.Password);
                }

                await db.SaveChangesAsync(cancellationToken);

                return Ok(worker);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWorker(int id,CancellationToken cancellationToken = default)
        {
            var ownerId = myAuthService.GetAuthInfo(HttpContext).PersonID;

            var worker = await db.Workers
                .Include(x => x.Locale)
                .FirstOrDefaultAsync(x => x.ID == id && !x.IsDeleted && x.IsWorker, cancellationToken);

            if (worker == null)
                return NotFound();

            if (worker.Locale == null || worker.Locale.OwnerId != ownerId)
                return Forbid("You do not have permission to delete this worker.");


            worker.IsDeleted = true;
            worker.EndDate=DateTime.Now;
            worker.DeletedAt = DateTime.Now;

            db.Update(worker);
            await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }

    }

    public class WorkerUpdateOrInsertRequest
    {
        public int? Id { get; set; } 

        // Zajedničko
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? Password { get; set; } // optional for update
        public DateTime? HireDate { get; set; } // optional for update

        // Samo za insert
        public int? LocaleId { get; set; }
        public DateTime? BirthDate { get; set; }
    }

    public class WorkerGetByIdResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Password { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public int LocaleId { get; set; }
    }

    public class WorkerRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public int LocaleId {  get; set; }
    }

    public class WorkerGetRequest : MyPagedRequest
    {
        public string? Q { get; set; }
    }

    public class WorkerGetResponse
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime HireDate { get; set; }
    }

    public class WorkerUpdateRequest
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime HireDate { get; set; }
    }


}
