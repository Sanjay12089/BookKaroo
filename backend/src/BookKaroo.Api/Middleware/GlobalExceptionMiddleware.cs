using System.Net;
using System.Text.Json;
using BookKaroo.Application.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(ctx, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext ctx, Exception ex)
    {
        var (status, title) = ex switch
        {
            NotFoundException       => (404, "Not Found"),
            ConflictException       => (409, "Conflict"),
            UnauthorizedException   => (401, "Unauthorized"),
            ForbiddenException      => (403, "Forbidden"),
            Application.Exceptions.ValidationException => (400, "Validation Failed"),
            AppException app        => (app.StatusCode, "Bad Request"),
            _                       => (500, "Internal Server Error")
        };

        if (status == 500)
            _logger.LogError(ex, "Unhandled exception at {Path}", ctx.Request.Path);

        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = ex.Message,
            Instance = ctx.Request.Path
        };
        problem.Extensions["traceId"] = ctx.TraceIdentifier;

        if (ex is Application.Exceptions.ValidationException ve)
            problem.Extensions["errors"] = ve.Errors;

        ctx.Response.StatusCode = status;
        ctx.Response.ContentType = "application/problem+json";

        var json = JsonSerializer.Serialize(problem, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await ctx.Response.WriteAsync(json);
    }
}

public static class GlobalExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app) =>
        app.UseMiddleware<GlobalExceptionMiddleware>();
}
