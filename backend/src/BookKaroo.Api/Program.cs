using System.Text;
using AspNetCoreRateLimit;
using BookKaroo.Api.Middleware;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Application.Services;
using BookKaroo.Application.Validators;
using BookKaroo.Infrastructure.Data;
using BookKaroo.Infrastructure.Email;
using BookKaroo.Infrastructure.Payment;
using BookKaroo.Infrastructure.Pdf;
using BookKaroo.Infrastructure.Repositories;
using BookKaroo.Infrastructure.Storage;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QuestPDF.Infrastructure;
using Serilog;

// ── Serilog bootstrap logger ──────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // 1. Serilog
    builder.Host.UseSerilog((ctx, services, cfg) =>
        cfg.ReadFrom.Configuration(ctx.Configuration)
           .ReadFrom.Services(services));

    // 2. DbContext
    var connectionString = builder.Configuration["DATABASE_URL"];

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        if (builder.Environment.IsProduction())
            throw new InvalidOperationException("DATABASE_URL is required in Production.");

        Log.Warning("DATABASE_URL not set — using in-memory SQLite for local dev. " +
                    "Set DATABASE_URL in launchSettings.json or your .env to connect to Postgres.");

        // Fallback: in-memory SQLite so the API can start without a Postgres DB
        builder.Services.AddDbContext<BookKarooDbContext>(opt =>
            opt.UseInMemoryDatabase("BookKaroo_Dev"));
    }
    else
    {
        builder.Services.AddDbContext<BookKarooDbContext>(opt =>
            opt.UseNpgsql(connectionString,
                npgsql => npgsql.EnableRetryOnFailure(3)));
    }

    // 3. JWT Authentication
    var jwtSecret = builder.Configuration["JWT_SECRET"]
        ?? throw new InvalidOperationException("JWT_SECRET is required.");

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(opt =>
        {
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["JWT_ISSUER"] ?? "bookkaroo",
                ValidAudience = builder.Configuration["JWT_AUDIENCE"] ?? "bookkaroo-api",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ClockSkew = TimeSpan.FromSeconds(30)
            };
        });

    builder.Services.AddAuthorization();

    // 4. FluentValidation
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<SignupRequestValidator>();

    // 5. AutoMapper
    builder.Services.AddAutoMapper(typeof(BookKaroo.Application.Services.AuthService).Assembly);

    // 6. Rate limiting (AspNetCoreRateLimit)
    builder.Services.AddMemoryCache();
    builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
    builder.Services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
    builder.Services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
    builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
    builder.Services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();
    builder.Services.AddInMemoryRateLimiting();

    // 7. CORS
    var allowedOrigins = (builder.Configuration["CORS_ALLOWED_ORIGINS"] ?? "http://localhost:5173")
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    builder.Services.AddCors(opt =>
        opt.AddDefaultPolicy(policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()));

    // 8. Swagger with JWT
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(opt =>
    {
        opt.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "BookKaroo API",
            Version = "v1",
            Description = "BookKaroo entertainment ticket booking platform — Phase 1 MVP"
        });

        opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Enter your JWT token"
        });

        opt.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                []
            }
        });
    });

    // 9. Health checks
    var hcBuilder = builder.Services.AddHealthChecks();
    if (!string.IsNullOrWhiteSpace(connectionString))
        hcBuilder.AddNpgSql(connectionString, name: "database");

    // 10. QuestPDF license
    QuestPDF.Settings.License = LicenseType.Community;

    // 11. IPaymentProvider — select based on PAYMENT_PROVIDER env var
    var paymentProvider = builder.Configuration["PAYMENT_PROVIDER"] ?? "mock";
    if (paymentProvider == "mock")
        builder.Services.AddScoped<IPaymentProvider, MockPaymentProvider>();
    // Phase 1.5: add Razorpay/PayPal providers here

    // 12. HttpClient
    builder.Services.AddHttpClient();

    // 13. Repositories (Scoped)
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<ICityRepository, CityRepository>();
    builder.Services.AddScoped<IMovieRepository, MovieRepository>();
    builder.Services.AddScoped<IBookingRepository, BookingRepository>();
    builder.Services.AddScoped<ISeatLockRepository, SeatLockRepository>();
    builder.Services.AddScoped<ICouponRepository, CouponRepository>();
    builder.Services.AddScoped<ISettingRepository, SettingRepository>();
    builder.Services.AddScoped<IRemindMeRepository, RemindMeRepository>();
    builder.Services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();

    // 14. Services (Scoped)
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<ICityService, CityService>();
    builder.Services.AddScoped<IPricingService, PricingService>();
    builder.Services.AddScoped<IEmailService, ResendEmailService>();
    builder.Services.AddScoped<IInvoicePdfGenerator, QuestPdfInvoiceGenerator>();
    builder.Services.AddScoped<SupabaseStorageService>();

    // 15. Controllers
    builder.Services.AddControllers();

    // ── Build app ─────────────────────────────────────────────────────────────
    var app = builder.Build();

    // 16. Correlation ID (before everything else for full tracing)
    app.UseCorrelationId();

    // 17. Global exception handler (before routing)
    app.UseGlobalExceptionHandler();

    // 18. Rate limiting
    app.UseIpRateLimiting();

    // 19. CORS
    app.UseCors();

    // 20. Auth
    app.UseAuthentication();
    app.UseAuthorization();

    // 21. Serilog request logging
    app.UseSerilogRequestLogging();

    // 22. Controllers
    app.MapControllers();

    // 23. Health checks
    app.MapHealthChecks("/health");

    // 24. Swagger (always available in non-production; can be gated by env)
    if (!app.Environment.IsProduction())
    {
        app.UseSwagger();
        app.UseSwaggerUI(opt =>
        {
            opt.SwaggerEndpoint("/swagger/v1/swagger.json", "BookKaroo API v1");
            opt.RoutePrefix = "swagger";
        });
    }

    Log.Information("BookKaroo API starting in {Environment} mode", app.Environment.EnvironmentName);
    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "BookKaroo API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
