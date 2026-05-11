using BookKaroo.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Produces("application/json")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _admin;

    public AdminController(IAdminService admin) => _admin = admin;

    /// <summary>Aggregated dashboard KPIs, charts, and recent activity.</summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(CancellationToken ct) =>
        Ok(await _admin.GetDashboardAsync(ct));

    /// <summary>Paginated audit log entries.</summary>
    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] string? entityType,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        Ok(await _admin.GetAuditLogsAsync(entityType, page, pageSize, ct));

    // All remaining admin endpoints are deferred to later sprints.
    [HttpPost("sync-tmdb")]
    public async Task<IActionResult> SyncTmdb(CancellationToken ct)
    {
        var updated = await _admin.SyncTmdbPostersAsync(ct);
        return Ok(new { updated, message = $"Synced {updated} movie(s) from TMDB." });
    }
}
