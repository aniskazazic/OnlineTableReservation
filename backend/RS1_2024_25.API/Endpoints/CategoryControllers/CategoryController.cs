using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.CategoryControllers
{
    [MyAuthorization]
    [Route("[controller]/[action]")]
    [ApiController]
    public class CategoryController(ApplicationDbContext db) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await db.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET: /Category/GetById/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await db.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found" });

            return Ok(category);
        }

        // POST: /Category/Create
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category category)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            db.Categories.Add(category);
            await db.SaveChangesAsync();

            return Ok(new { message = "Category created successfully", category });
        }

        // PUT: /Category/Update/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category category)
        {
            if (id != category.Id)
                return BadRequest(new { message = "ID mismatch" });

            if (!await db.Categories.AnyAsync(c => c.Id == id))
                return NotFound(new { message = "Category not found" });

            db.Entry(category).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return Ok(new { message = "Category updated successfully", category });
        }

        // DELETE: /Category/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await db.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found" });

            db.Categories.Remove(category);
            await db.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully" });
        }
    }
}

