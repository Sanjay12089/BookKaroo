using System.Text.Json;
using BookKaroo.Application.DTOs.Lys;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Domain.Entities;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Repositories;

public class LysEventRepository : ILysEventRepository
{
    private readonly BookKarooDbContext _db;
    public LysEventRepository(BookKarooDbContext db) => _db = db;

    public async Task<LysEvent?> GetByIdAsync(Guid id, CancellationToken ct) =>
        await _db.LysEvents.FirstOrDefaultAsync(e => e.Id == id, ct);

    public async Task<LysEvent?> GetBySlugAsync(string slug, CancellationToken ct) =>
        await _db.LysEvents.FirstOrDefaultAsync(e => e.Slug == slug, ct);

    public async Task<bool> SlugExistsAsync(string slug, CancellationToken ct) =>
        await _db.LysEvents.AnyAsync(e => e.Slug == slug, ct) ||
        await _db.Events.AnyAsync(e => e.Slug == slug, ct);

    public async Task<LysEvent> AddAsync(LysEvent ev, CancellationToken ct)
    {
        await _db.LysEvents.AddAsync(ev, ct);
        await _db.SaveChangesAsync(ct);
        return ev;
    }

    public async Task UpdateAsync(LysEvent ev, CancellationToken ct)
    {
        _db.LysEvents.Update(ev);
        await _db.SaveChangesAsync(ct);
    }

    public async Task SoftDeleteAsync(Guid id, CancellationToken ct)
    {
        var ev = await _db.LysEvents.FindAsync([id], ct);
        if (ev != null)
        {
            ev.DeletedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
        }
    }

    public async Task<(List<LysEvent> Items, int Total)> GetByOrganizerAsync(
        Guid organizerId, string? status, int page, int pageSize, CancellationToken ct)
    {
        var query = _db.LysEvents.Where(e => e.OrganizerId == organizerId);

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
            query = query.Where(e => e.Status == status);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<(List<LysEventAdminDto> Items, int Total)> GetAllAdminAsync(
        string? search, string? status, string? type,
        DateOnly? fromDate, DateOnly? toDate,
        int page, int pageSize, CancellationToken ct)
    {
        var query = _db.LysEvents
            .Join(_db.LysOrganizers,
                ev => ev.OrganizerId,
                org => org.Id,
                (ev, org) => new { ev, org })
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => EF.Functions.ILike(x.ev.Title, $"%{search}%"));

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
            query = query.Where(x => x.ev.Status == status);

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(x => x.ev.Type == type);

        if (fromDate.HasValue)
            query = query.Where(x => DateOnly.FromDateTime(x.ev.EventDate) >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(x => DateOnly.FromDateTime(x.ev.EventDate) <= toDate.Value);

        var total = await query.CountAsync(ct);

        var rawItems = await query
            .OrderBy(x => x.ev.Status == "submitted" ? 0 : 1)
            .ThenByDescending(x => x.ev.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new
            {
                x.ev.Id,
                x.ev.Title,
                x.ev.Slug,
                x.ev.Type,
                x.ev.Status,
                OrganizerName       = x.org.Name,
                OrganizerEmail      = x.org.Email,
                OrganizerPan        = x.org.PanNumber,
                IsOrganizerVerified = x.org.IsVerified,
                x.ev.VenueType,
                x.ev.VenueId,
                x.ev.CustomVenueName,
                x.ev.CustomVenueCity,
                x.ev.CustomVenueAddress,
                x.ev.CustomVenueLatitude,
                x.ev.CustomVenueLongitude,
                x.ev.EventDate,
                x.ev.Description,
                x.ev.Language,
                x.ev.AgeRestriction,
                x.ev.DurationMin,
                x.ev.CommissionRate,
                x.ev.PriceTiersJson,
                x.ev.ArtistsJson,
                x.ev.PosterUrl,
                x.ev.BackdropUrl,
                x.ev.SubmittedAt,
                x.ev.ReviewedAt,
                x.ev.ReviewNotes,
            })
            .ToListAsync(ct);

        // Batch-load venue names for any "existing" venue events
        var venueIds = rawItems
            .Where(x => x.VenueType == "existing" && x.VenueId.HasValue)
            .Select(x => x.VenueId!.Value)
            .Distinct()
            .ToList();
        var venueNames = venueIds.Count > 0
            ? await _db.Venues
                .Where(v => venueIds.Contains(v.Id))
                .Select(v => new { v.Id, v.Name })
                .ToDictionaryAsync(v => v.Id, v => v.Name, ct)
            : new Dictionary<Guid, string>();

        var opts  = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var items = rawItems.Select(x =>
        {
            var ist = ToIst(x.EventDate);
            var venueDisplay = x.VenueType == "existing"
                ? (x.VenueId.HasValue && venueNames.TryGetValue(x.VenueId.Value, out var vn) ? vn : "Registered Venue")
                : x.CustomVenueName + (x.CustomVenueCity != null ? ", " + x.CustomVenueCity : "");

            var priceTiers  = new List<LysPriceTierDto>();
            if (!string.IsNullOrWhiteSpace(x.PriceTiersJson))
            {
                try { priceTiers = JsonSerializer.Deserialize<List<LysPriceTierDto>>(x.PriceTiersJson, opts) ?? []; }
                catch { /* invalid JSON */ }
            }

            var artists = new List<LysArtistDto>();
            if (!string.IsNullOrWhiteSpace(x.ArtistsJson))
            {
                try { artists = JsonSerializer.Deserialize<List<LysArtistDto>>(x.ArtistsJson, opts) ?? []; }
                catch { /* invalid JSON */ }
            }

            return new LysEventAdminDto
            {
                Id                  = x.Id,
                Title               = x.Title,
                Slug                = x.Slug,
                Type                = x.Type,
                Status              = x.Status,
                OrganizerName       = x.OrganizerName,
                OrganizerEmail      = x.OrganizerEmail,
                OrganizerPan        = x.OrganizerPan,
                IsOrganizerVerified = x.IsOrganizerVerified,
                VenueType            = x.VenueType,
                VenueDisplay         = venueDisplay ?? "",
                CustomVenueAddress   = x.CustomVenueAddress,
                CustomVenueLatitude  = x.CustomVenueLatitude,
                CustomVenueLongitude = x.CustomVenueLongitude,
                EventDateLabel      = ist.ToString("dd MMM yyyy"),
                EventTimeLabel      = ist.ToString("h:mm tt"),
                Description         = x.Description,
                Language            = x.Language ?? "",
                AgeRestriction      = x.AgeRestriction,
                DurationMin         = x.DurationMin,
                CommissionRate      = x.CommissionRate,
                TierCount           = priceTiers.Count,
                LowestPrice         = priceTiers.Count > 0 ? priceTiers.Min(t => t.Price) : 0,
                PriceTiers          = priceTiers,
                Artists             = artists,
                PosterUrl           = x.PosterUrl,
                BackdropUrl         = x.BackdropUrl,
                SubmittedAt         = x.SubmittedAt,
                ReviewedAt          = x.ReviewedAt,
                ReviewNotes         = x.ReviewNotes,
            };
        }).ToList();

        return (items, total);
    }

    private static DateTime ToIst(DateTime utcDt) =>
        DateTime.SpecifyKind(utcDt, DateTimeKind.Utc).AddMinutes(330);

    public async Task<List<LysEvent>> CheckDuplicatesAsync(
        Guid organizerId, string title, DateTime eventDate, CancellationToken ct)
    {
        var from = eventDate.AddDays(-7);
        var to   = eventDate.AddDays(7);
        return await _db.LysEvents
            .Where(e => e.OrganizerId == organizerId &&
                        e.EventDate >= from && e.EventDate <= to &&
                        EF.Functions.ILike(e.Title, $"%{title.Substring(0, Math.Min(title.Length, 5))}%"))
            .ToListAsync(ct);
    }
}
