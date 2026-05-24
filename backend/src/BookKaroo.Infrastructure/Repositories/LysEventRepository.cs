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

        var items = await query
            .OrderBy(x =>
                x.ev.Status == "submitted" || x.ev.Status == "under_review" ? 0 : 1)
            .ThenByDescending(x => x.ev.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new LysEventAdminDto
            {
                Id                  = x.ev.Id,
                Title               = x.ev.Title,
                Slug                = x.ev.Slug,
                Type                = x.ev.Type,
                Status              = x.ev.Status,
                OrganizerName       = x.org.Name,
                OrganizerEmail      = x.org.Email,
                OrganizerPan        = x.org.PanNumber,
                IsOrganizerVerified = x.org.IsVerified,
                VenueDisplay        = x.ev.VenueType == "existing"
                    ? (x.ev.CustomVenueName ?? "Registered Venue")
                    : (x.ev.CustomVenueName + (x.ev.CustomVenueCity != null ? ", " + x.ev.CustomVenueCity : "")),
                EventDateLabel      = x.ev.EventDate.ToString("dd MMM yyyy"),
                EventTimeLabel      = x.ev.EventDate.ToString("h:mm tt"),
                PosterUrl           = x.ev.PosterUrl,
                SubmittedAt         = x.ev.SubmittedAt,
                ReviewedAt          = x.ev.ReviewedAt,
                ReviewNotes         = x.ev.ReviewNotes,
            })
            .ToListAsync(ct);

        return (items, total);
    }

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
