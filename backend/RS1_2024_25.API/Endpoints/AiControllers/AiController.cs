using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.AiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly AiService _aiService;

        public AiController(AiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskAi([FromBody] AiRequest request)
        {
            var result = await _aiService.GetAiResponse(request.Prompt);
            return Ok(new AiResponse { ResponseText = result });
        }
    }
}
