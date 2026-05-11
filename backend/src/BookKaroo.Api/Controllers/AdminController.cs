using BookKaroo.Application.DTOs.Admin;
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

    // ── Dashboard ─────────────────────────────────────────────────────────────

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(CancellationToken ct) =>
        Ok(await _admin.GetDashboardAsync(ct));

    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] string? entityType,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        Ok(await _admin.GetAuditLogsAsync(entityType, page, pageSize, ct));

    [HttpPost("sync-tmdb")]
    public async Task<IActionResult> SyncTmdbPosters(CancellationToken ct)
    {
        var updated = await _admin.SyncTmdbPostersAsync(ct);
        return Ok(new { updated, message = $"Synced {updated} movie(s) from TMDB." });
    }

    // ── Movies ────────────────────────────────────────────────────────────────

    [HttpGet("movies")]
    public async Task<IActionResult> GetMovies(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? category,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        Ok(await _admin.GetMoviesAsync(search, status, category, page, pageSize, ct));

    [HttpGet("movies/{id:guid}")]
    public async Task<IActionResult> GetMovie(Guid id, CancellationToken ct)
    {
        try { return Ok(await _admin.GetMovieByIdAsync(id, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("movies")]
    public async Task<IActionResult> CreateMovie([FromBody] CreateMovieRequest req, CancellationToken ct)
    {
        var result = await _admin.CreateMovieAsync(req, ct);
        return Created($"/api/admin/movies/{result.Id}", result);
    }

    [HttpPatch("movies/{id:guid}")]
    public async Task<IActionResult> UpdateMovie(Guid id, [FromBody] UpdateMovieRequest req, CancellationToken ct)
    {
        try { return Ok(await _admin.UpdateMovieAsync(id, req, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("movies/{id:guid}")]
    public async Task<IActionResult> DeleteMovie(Guid id, CancellationToken ct)
    {
        try { await _admin.DeleteMovieAsync(id, ct); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("movies/sync-tmdb")]
    public async Task<IActionResult> SyncFromTmdb([FromBody] SyncTmdbRequest req, CancellationToken ct)
    {
        try { return Ok(await _admin.SyncFromTmdbAsync(req.TmdbId, ct)); }
        catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpPost("movies/import-popular")]
    public async Task<IActionResult> ImportPopular(CancellationToken ct) =>
        Ok(await _admin.ImportPopularAsync(ct));

    // ── Events ────────────────────────────────────────────────────────────────

    [HttpGet("events")]
    public async Task<IActionResult> GetEvents(
        [FromQuery] string? search,
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        Ok(await _admin.GetEventsAsync(search, type, status, page, pageSize, ct));

    [HttpGet("events/{id:guid}")]
    public async Task<IActionResult> GetEvent(Guid id, CancellationToken ct)
    {
        try { return Ok(await _admin.GetEventByIdAsync(id, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("events")]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest req, CancellationToken ct)
    {
        var result = await _admin.CreateEventAsync(req, ct);
        return Created($"/api/admin/events/{result.Id}", result);
    }

    [HttpPatch("events/{id:guid}")]
    public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateEventRequest req, CancellationToken ct)
    {
        try { return Ok(await _admin.UpdateEventAsync(id, req, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("events/{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id, CancellationToken ct)
    {
        try { await _admin.DeleteEventAsync(id, ct); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    // ── Venues (for event form dropdown — simple list) ────────────────────────

    [HttpGet("venues/list")]
    public async Task<IActionResult> GetVenuesList(CancellationToken ct) =>
        Ok(await _admin.GetVenuesAsync(ct));

    // ── Venues CRUD ───────────────────────────────────────────────────────────

    [HttpGet("venues")]
    public async Task<IActionResult> GetVenues(
        [FromQuery] string? search,
        [FromQuery] Guid?   cityId,
        [FromQuery] string? chain,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        Ok(await _admin.GetVenuesPaginatedAsync(search, cityId, chain, page, pageSize, ct));

    [HttpGet("venues/{id:guid}")]
    public async Task<IActionResult> GetVenue(Guid id, CancellationToken ct)
    {
        try { return Ok(await _admin.GetVenueWithScreensAsync(id, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("venues")]
    public async Task<IActionResult> CreateVenue([FromBody] CreateVenueRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _admin.CreateVenueAsync(req, ct);
            return Created($"/api/admin/venues/{result.Id}", result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPatch("venues/{id:guid}")]
    public async Task<IActionResult> UpdateVenue(Guid id, [FromBody] UpdateVenueRequest req, CancellationToken ct)
    {
        try { return Ok(await _admin.UpdateVenueAsync(id, req, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("venues/{id:guid}")]
    public async Task<IActionResult> DeleteVenue(Guid id, CancellationToken ct)
    {
        try
        {
            await _admin.DeleteVenueAsync(id, ct);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
    }

    // ── Screens ───────────────────────────────────────────────────────────────

    [HttpGet("venues/{venueId:guid}/screens")]
    public async Task<IActionResult> GetScreens(Guid venueId, CancellationToken ct)
    {
        try
        {
            var detail = await _admin.GetVenueWithScreensAsync(venueId, ct);
            return Ok(detail.Screens);
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("venues/{venueId:guid}/screens")]
    public async Task<IActionResult> CreateScreen(Guid venueId, [FromBody] CreateScreenRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _admin.CreateScreenAsync(venueId, req, ct);
            return Created($"/api/admin/screens/{result.Id}", result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (ArgumentException ex)   { return BadRequest(new { error = ex.Message }); }
    }

    [HttpPatch("screens/{screenId:guid}")]
    public async Task<IActionResult> UpdateScreen(Guid screenId, [FromBody] UpdateScreenRequest req, CancellationToken ct)
    {
        try { return Ok(await _admin.UpdateScreenAsync(screenId, req, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpDelete("screens/{screenId:guid}")]
    public async Task<IActionResult> DeleteScreen(Guid screenId, CancellationToken ct)
    {
        try
        {
            await _admin.DeleteScreenAsync(screenId, ct);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
    }

    // ── Shows ─────────────────────────────────────────────────────────────────

    [HttpGet("shows")]
    public async Task<IActionResult> GetShows(
        [FromQuery] Guid?    movieId,
        [FromQuery] Guid?    venueId,
        [FromQuery] Guid?    screenId,
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate,
        [FromQuery] string?  status,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        Ok(await _admin.GetShowsAsync(movieId, venueId, screenId, fromDate, toDate, status, page, pageSize, ct));

    [HttpPost("shows")]
    public async Task<IActionResult> CreateShow([FromBody] CreateShowRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _admin.CreateShowAsync(req, ct);
            return Created($"/api/admin/shows/{result.ShowId}", result);
        }
        catch (KeyNotFoundException ex)    { return NotFound(new { error = ex.Message }); }
        catch (ArgumentException ex)       { return BadRequest(new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { error = ex.Message }); }
    }

    [HttpPost("shows/{id:guid}/cancel")]
    public async Task<IActionResult> CancelShow(Guid id, CancellationToken ct)
    {
        try { return Ok(await _admin.CancelShowAsync(id, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpDelete("shows/{id:guid}")]
    public async Task<IActionResult> DeleteShow(Guid id, CancellationToken ct)
    {
        try
        {
            await _admin.DeleteShowAsync(id, ct);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
