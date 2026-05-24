using BookKaroo.Application.DTOs.Lys;
using BookKaroo.Application.Exceptions;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Application.Services;

public class LysAdminService : ILysAdminService
{
    private readonly ILysEventRepository     _events;
    private readonly ILysOrganizerRepository _organizers;
    private readonly IEventRepository        _mainEvents;
    private readonly IAuditLogService        _audit;
    private readonly IEmailService           _email;
    private readonly IConfiguration         _config;
    private readonly ILogger<LysAdminService> _logger;

    public LysAdminService(
        ILysEventRepository     events,
        ILysOrganizerRepository organizers,
        IEventRepository        mainEvents,
        IAuditLogService        audit,
        IEmailService           email,
        IConfiguration          config,
        ILogger<LysAdminService> logger)
    {
        _events     = events;
        _organizers = organizers;
        _mainEvents = mainEvents;
        _audit      = audit;
        _email      = email;
        _config     = config;
        _logger     = logger;
    }

    public async Task<(List<LysEventAdminDto> Items, int Total)> GetSubmissionsAsync(
        string? search, string? status, string? type,
        DateOnly? fromDate, DateOnly? toDate,
        int page, int pageSize, CancellationToken ct = default) =>
        await _events.GetAllAdminAsync(search, status, type, fromDate, toDate, page, pageSize, ct);

    public async Task<LysEventAdminDto> GetSubmissionDetailAsync(Guid eventId, CancellationToken ct = default)
    {
        var (items, _) = await _events.GetAllAdminAsync(null, null, null, null, null, 1, 1000, ct);
        return items.FirstOrDefault(e => e.Id == eventId)
            ?? throw new NotFoundException("Submission not found.");
    }

    public async Task<LysEventAdminDto> ApproveEventAsync(Guid eventId, Guid adminId, CancellationToken ct = default)
    {
        var ev = await _events.GetByIdAsync(eventId, ct)
            ?? throw new NotFoundException("Event not found.");

        if (ev.Status != LysEventStatus.Submitted && ev.Status != LysEventStatus.UnderReview)
            throw new AppException("Only submitted or under-review events can be approved.");

        var organizer = await _organizers.GetByIdAsync(ev.OrganizerId, ct)
            ?? throw new NotFoundException("Organizer not found.");

        if (!organizer.IsVerified)
            throw new AppException(
                "Organizer must be verified before their events can be approved. Please verify the organizer first.");

        // Parse event type
        var eventType = ParseEventType(ev.Type);

        // Create entry in main events table
        var mainEvent = new Event
        {
            Title          = ev.Title,
            Slug           = ev.Slug,
            Type           = eventType,
            Description    = ev.Description,
            VenueId        = ev.VenueId,
            EventDate      = ev.EventDate,
            DurationMin    = ev.DurationMin ?? 0,
            Language       = ev.Language,
            AgeRestriction = ev.AgeRestriction,
            Organizer      = System.Text.Json.JsonSerializer.Serialize(new { name = organizer.Name, contact = organizer.Email }),
            Artists        = ev.ArtistsJson,
            PosterUrl      = ev.PosterUrl,
            BackdropUrl    = ev.BackdropUrl,
            PriceTiers     = ev.PriceTiersJson,
            Status         = MovieStatus.Published,
        };

        await _mainEvents.AddAsync(mainEvent, ct);

        ev.Status          = LysEventStatus.Published;
        ev.ReviewedAt      = DateTime.UtcNow;
        ev.ReviewedBy      = adminId;
        ev.PublishedEventId = mainEvent.Id;
        await _events.UpdateAsync(ev, ct);

        var frontendUrl = _config["FRONTEND_URL"] ?? "http://localhost:5173";
        _ = Task.Run(async () =>
        {
            try
            {
                await _email.SendLysApprovedAsync(organizer.Email, organizer.Name, ev.Title, ev.Slug, frontendUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LYS approval email failed for event {Id}", ev.Id);
            }
        }, ct);

        await _audit.LogAsync(adminId, "lys_approve", "lys_event", ev.Id, null, new { ev.Status }, null, ct);

        return await GetSubmissionDetailAsync(eventId, ct);
    }

    public async Task<LysEventAdminDto> RejectEventAsync(
        Guid eventId, Guid adminId, string reason, CancellationToken ct = default)
    {
        var ev = await _events.GetByIdAsync(eventId, ct)
            ?? throw new NotFoundException("Event not found.");

        if (ev.Status != LysEventStatus.Submitted && ev.Status != LysEventStatus.UnderReview)
            throw new AppException("Only submitted or under-review events can be rejected.");

        ev.Status      = LysEventStatus.Rejected;
        ev.ReviewedAt  = DateTime.UtcNow;
        ev.ReviewedBy  = adminId;
        ev.ReviewNotes = reason;
        await _events.UpdateAsync(ev, ct);

        var organizer = await _organizers.GetByIdAsync(ev.OrganizerId, ct);
        _ = Task.Run(async () =>
        {
            try
            {
                if (organizer != null)
                    await _email.SendLysRejectedAsync(organizer.Email, organizer.Name, ev.Title, reason);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LYS rejection email failed for event {Id}", ev.Id);
            }
        }, ct);

        await _audit.LogAsync(adminId, "lys_reject", "lys_event", ev.Id, null, new { ev.Status, reason }, null, ct);

        return await GetSubmissionDetailAsync(eventId, ct);
    }

    public async Task<LysEventAdminDto> RequestChangesAsync(
        Guid eventId, Guid adminId, string notes, CancellationToken ct = default)
    {
        var ev = await _events.GetByIdAsync(eventId, ct)
            ?? throw new NotFoundException("Event not found.");

        if (ev.Status != LysEventStatus.Submitted && ev.Status != LysEventStatus.UnderReview)
            throw new AppException("Only submitted or under-review events can have changes requested.");

        ev.Status      = LysEventStatus.ChangesRequested;
        ev.ReviewedAt  = DateTime.UtcNow;
        ev.ReviewedBy  = adminId;
        ev.ReviewNotes = notes;
        await _events.UpdateAsync(ev, ct);

        var frontendUrl = _config["FRONTEND_URL"] ?? "http://localhost:5173";
        var organizer   = await _organizers.GetByIdAsync(ev.OrganizerId, ct);
        _ = Task.Run(async () =>
        {
            try
            {
                if (organizer != null)
                    await _email.SendLysChangesRequestedAsync(
                        organizer.Email, organizer.Name, ev.Title, ev.Id, notes, frontendUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LYS changes-requested email failed for event {Id}", ev.Id);
            }
        }, ct);

        await _audit.LogAsync(adminId, "lys_changes_requested", "lys_event", ev.Id, null, new { ev.Status, notes }, null, ct);

        return await GetSubmissionDetailAsync(eventId, ct);
    }

    public async Task<(List<LysOrganizerAdminDto> Items, int Total)> GetOrganizersAsync(
        string? search, bool? isVerified, int page, int pageSize, CancellationToken ct = default) =>
        await _organizers.GetAllAdminAsync(search, isVerified, page, pageSize, ct);

    public async Task VerifyOrganizerAsync(Guid organizerId, Guid adminId, CancellationToken ct = default)
    {
        var organizer = await _organizers.GetByIdAsync(organizerId, ct)
            ?? throw new NotFoundException("Organizer not found.");

        organizer.IsVerified  = true;
        organizer.VerifiedAt  = DateTime.UtcNow;
        organizer.VerifiedBy  = adminId;
        await _organizers.UpdateAsync(organizer, ct);
        await _audit.LogAsync(adminId, "lys_verify_organizer", "lys_organizer", organizerId, null, null, null, ct);
    }

    public async Task UnverifyOrganizerAsync(Guid organizerId, CancellationToken ct = default)
    {
        var organizer = await _organizers.GetByIdAsync(organizerId, ct)
            ?? throw new NotFoundException("Organizer not found.");

        organizer.IsVerified = false;
        organizer.VerifiedAt = null;
        organizer.VerifiedBy = null;
        await _organizers.UpdateAsync(organizer, ct);
    }

    public async Task DeactivateOrganizerAsync(Guid organizerId, CancellationToken ct = default)
    {
        var organizer = await _organizers.GetByIdAsync(organizerId, ct)
            ?? throw new NotFoundException("Organizer not found.");

        organizer.IsActive = false;
        await _organizers.UpdateAsync(organizer, ct);
    }

    private static EventType ParseEventType(string type) => type.ToLowerInvariant() switch
    {
        "live_event" or "liveevent" => EventType.LiveEvent,
        "play"                      => EventType.Play,
        "sport"                     => EventType.Sport,
        "activity"                  => EventType.Activity,
        "comedy"                    => EventType.Comedy,
        "ipl"                       => EventType.Ipl,
        _                           => EventType.LiveEvent,
    };
}
