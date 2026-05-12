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

    // ── Venues (for event form) ───────────────────────────────────────────────

    [HttpGet("venues")]
    public async Task<IActionResult> GetVenues(CancellationToken ct) =>
        Ok(await _admin.GetVenuesAsync(ct));

    // ── Admin Bookings ────────────────────────────────────────────────────────

    [HttpGet("bookings")]
    public async Task<IActionResult> GetBookings(
        [FromQuery] string?  search,
        [FromQuery] string?  status,
        [FromQuery] Guid?    movieId,
        [FromQuery] Guid?    cityId,
        [FromQuery] string?  fromDate,
        [FromQuery] string?  toDate,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        DateOnly? from = DateOnly.TryParse(fromDate, out var fd) ? fd : null;
        DateOnly? to   = DateOnly.TryParse(toDate,   out var td) ? td : null;
        return Ok(await _admin.GetAdminBookingsAsync(search, status, movieId, cityId, from, to, page, pageSize, ct));
    }

    [HttpGet("bookings/{bookingRef}")]
    public async Task<IActionResult> GetBookingDetail(string bookingRef, CancellationToken ct)
    {
        try { return Ok(await _admin.GetAdminBookingDetailAsync(bookingRef, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("bookings/{bookingRef}/cancel")]
    public async Task<IActionResult> CancelBooking(string bookingRef, CancellationToken ct)
    {
        try { return Ok(await _admin.AdminCancelBookingAsync(bookingRef, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpPost("bookings/{bookingRef}/refund")]
    public async Task<IActionResult> ProcessRefund(
        string bookingRef,
        [FromBody] AdminRefundRequest req,
        CancellationToken ct)
    {
        if (req.RefundAmount <= 0)
            return BadRequest(new { error = "RefundAmount must be greater than zero." });
        try { return Ok(await _admin.AdminProcessRefundAsync(bookingRef, req.RefundAmount, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpPost("bookings/{bookingRef}/resend-email")]
    public async Task<IActionResult> ResendBookingEmail(string bookingRef, CancellationToken ct)
    {
        try
        {
            await _admin.ResendBookingEmailAsync(bookingRef, ct);
            return Ok(new { message = "Confirmation email resent" });
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    // ── Admin Users ───────────────────────────────────────────────────────────

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] bool?   isBlocked,
        [FromQuery] Guid?   cityId,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        Ok(await _admin.GetAdminUsersAsync(search, role, isBlocked, cityId, page, pageSize, ct));

    [HttpGet("users/{id:guid}")]
    public async Task<IActionResult> GetUserDetail(Guid id, CancellationToken ct)
    {
        try { return Ok(await _admin.GetAdminUserDetailAsync(id, ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("users/{id:guid}/block")]
    public async Task<IActionResult> BlockUser(Guid id, CancellationToken ct)
    {
        try
        {
            await _admin.BlockUserAsync(id, ct);
            return Ok(new { message = "User has been blocked" });
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("users/{id:guid}/unblock")]
    public async Task<IActionResult> UnblockUser(Guid id, CancellationToken ct)
    {
        try
        {
            await _admin.UnblockUserAsync(id, ct);
            return Ok(new { message = "User has been unblocked" });
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("users/{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id, CancellationToken ct)
    {
        try
        {
            var tempPassword = await _admin.AdminResetPasswordAsync(id, ct);
            return Ok(new { tempPassword });
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
