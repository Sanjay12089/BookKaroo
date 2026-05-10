using System.Security.Claims;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

[ApiController]
[Route("api/events")]
[Produces("application/json")]
public class EventsController : ControllerBase
{
    private readonly IEventService      _events;
    private readonly IRemindMeRepository _remindMe;

    public EventsController(IEventService events, IRemindMeRepository remindMe)
    {
        _events   = events;
        _remindMe = remindMe;
    }

    /// <summary>List published upcoming events with optional type and city filters.</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetList(
        [FromQuery] string? type     = null,
        [FromQuery] Guid?   cityId   = null,
        [FromQuery] int     page     = 1,
        [FromQuery] int     pageSize = 20,
        CancellationToken ct = default)
    {
        var parsedType = ParseEventType(type);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, total, totalPages) = await _events.GetListAsync(parsedType, cityId, page, pageSize, ct);
        return Ok(new { items, total, page, pageSize, totalPages });
    }

    /// <summary>Full event detail by slug.</summary>
    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDetail(string slug, CancellationToken ct)
        => Ok(await _events.GetDetailAsync(slug, ct));

    /// <summary>Upcoming events by type (used for home page rails).</summary>
    [HttpGet("upcoming/{type}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUpcoming(
        string type,
        [FromQuery] Guid? cityId = null,
        [FromQuery] int   count  = 6,
        CancellationToken ct = default)
    {
        var parsedType = ParseEventType(type);
        if (!parsedType.HasValue)
            return BadRequest(new { message = $"Unknown event type: {type}" });

        count = Math.Clamp(count, 1, 20);
        var result = await _events.GetByTypeAsync(parsedType.Value, cityId, count, ct);
        return Ok(result);
    }

    /// <summary>Opt in to event availability notification (idempotent).</summary>
    [HttpPost("{id:guid}/remind-me")]
    [Authorize]
    public async Task<IActionResult> RemindMe(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (await _remindMe.HasOptedInForEventAsync(userId, id, ct))
            return Ok(new { message = "You're already on the remind list!" });

        await _remindMe.AddAsync(new RemindMe { UserId = userId, EventId = id, Notified = false }, ct);
        return Ok(new { message = "We'll notify you when tickets are available!" });
    }

    private static EventType? ParseEventType(string? type) => type?.ToLowerInvariant() switch
    {
        "live_event" or "liveevent" => EventType.LiveEvent,
        "play"                      => EventType.Play,
        "sport"                     => EventType.Sport,
        "activity"                  => EventType.Activity,
        "comedy"                    => EventType.Comedy,
        "ipl"                       => EventType.Ipl,
        _                           => null
    };
}
