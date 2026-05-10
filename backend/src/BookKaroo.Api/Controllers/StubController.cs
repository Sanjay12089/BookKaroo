using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

// Placeholder controllers for endpoints implemented in later sprints.
// Each returns 501 so the frontend can show graceful empty states.

[ApiController]
[Route("api/venues")]
[Produces("application/json")]
public class VenuesController : ControllerBase
{
    [HttpGet] public IActionResult GetAll() => Stub();
    [HttpGet("{id:guid}")] public IActionResult GetById(Guid id) => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}


[ApiController]
[Route("api/admin")]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    private readonly BookKaroo.Application.Interfaces.Services.IAdminService _admin;
    public AdminController(BookKaroo.Application.Interfaces.Services.IAdminService admin) => _admin = admin;

    [HttpGet("dashboard")] public IActionResult Dashboard() => Stub();
    [HttpGet("reports")]   public IActionResult Reports()   => Stub();

    /// <summary>Sync movie poster/backdrop/trailer URLs from TMDB API for all movies with a TmdbId.</summary>
    [HttpPost("sync-tmdb")]
    public async Task<IActionResult> SyncTmdb(CancellationToken ct)
    {
        var updated = await _admin.SyncTmdbPostersAsync(ct);
        return Ok(new { updated, message = $"Synced {updated} movies from TMDB." });
    }

    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}
