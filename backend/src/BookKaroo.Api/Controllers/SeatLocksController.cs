using System.Security.Claims;
using BookKaroo.Application.DTOs.Shows;
using BookKaroo.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

[ApiController]
[Route("api/seat-locks")]
[Produces("application/json")]
[Authorize]
public class SeatLocksController : ControllerBase
{
    private readonly ISeatLockService _seatLocks;

    public SeatLocksController(ISeatLockService seatLocks) => _seatLocks = seatLocks;

    /// <summary>Lock one or more seats for the authenticated user (up to 10).</summary>
    [HttpPost]
    [ProducesResponseType(typeof(SeatLockResponse), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> LockSeats([FromBody] LockSeatsRequest request, CancellationToken ct)
    {
        if (request.Seats.Length == 0 || request.Seats.Length > 10)
            return BadRequest("seats must contain 1–10 entries.");

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _seatLocks.LockSeatsAsync(userId, request.ShowId, request.Seats, ct);
        return StatusCode(201, result);
    }

    /// <summary>Release all seat locks held by the authenticated user for a show.</summary>
    [HttpDelete]
    [ProducesResponseType(204)]
    public async Task<IActionResult> ReleaseSeats([FromQuery] Guid showId, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _seatLocks.ReleaseLocksAsync(userId, showId, ct);
        return NoContent();
    }
}
