using System.Text;
using System.Text.Json;
namespace RS1_2024_25.API.Services
{
    public class AiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GetAiResponse(string prompt)
        {
            var baseUrl = _configuration["AiSettings:ApiUrl"];
            var apiKey = _configuration["AiSettings:ApiKey"];
            var apiUrl = $"{baseUrl}?key={apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
            new {
                parts = new[] { new { text = prompt } }
            }
        }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, apiUrl)
            {
                Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
            };

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonDocument.Parse(json);

            return result.RootElement
                         .GetProperty("candidates")[0]
                         .GetProperty("content")
                         .GetProperty("parts")[0]
                         .GetProperty("text")
                         .GetString();
        }
    }
}
