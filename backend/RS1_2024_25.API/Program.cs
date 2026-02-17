using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Data.Models;
using Stripe;
using System.Text;

// === Twilio usings ===
using Microsoft.Extensions.Options;
using Twilio.Clients;

var builder = WebApplication.CreateBuilder(args);

// 1) DB (koristi builder.Configuration umjesto ruènog config-a)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("db1")));

// 2) Controllers + JSON konverter za TimeOnly
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new TimeOnlyJsonConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient<AiService>();

// 3) Swagger sa Bearer auth
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "OnlineTableReservation API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by your token. Example: Bearer abc123"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// (NAPOMENA: ovo ti trenutno efektivno gasi DataProtection tokene jer je lifespan 0s)
builder.Services.Configure<DataProtectionTokenProviderOptions>(opts => opts.TokenLifespan = TimeSpan.FromSeconds(0));

// 4) JWT auth (ostavljeno kako si imao)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = true; // ako testiraš lokalno bez HTTPS-a, stavi false
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateActor = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        RequireExpirationTime = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ClockSkew = TimeSpan.Zero
    };
});

// 5) Tvoji servisi
builder.Services.AddTransient<MyAuthService>();
builder.Services.AddTransient<TokenService>();

// 6) Stripe config
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

// 7) Twilio options + DI registracija
builder.Services.Configure<TwilioOptions>(builder.Configuration.GetSection("Twilio"));


// (opciono) mali debug endpoint da provjeriš da se config uèitao
builder.Services.AddRouting();

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(options => options
    .SetIsOriginAllowed(_ => true)
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles();

// (opciono) provjera Twilio config-a
app.MapGet("/debug/twilio", (IOptions<TwilioOptions> opt) =>
{
    var o = opt.Value;
    return Results.Ok(new
    {
        accountSid = o.AccountSid,
        verifySid = o.VerifyServiceSid,
        hasAuthToken = !string.IsNullOrWhiteSpace(o.AuthToken),
        hasApiKey = !string.IsNullOrWhiteSpace(o.ApiKeySid) && !string.IsNullOrWhiteSpace(o.ApiKeySecret)
    });
});

app.Run();

// === Twilio options class ===
public class TwilioOptions
{
    public string AccountSid { get; set; } = "";
    public string AuthToken { get; set; } = "";            // koristiš OVO ili ApiKeySid/Secret
    public string VerifyServiceSid { get; set; } = "";
    public string? ApiKeySid { get; set; }                 // preporuèeno za produkciju
    public string? ApiKeySecret { get; set; }
}
