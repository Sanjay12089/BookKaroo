using BookKaroo.Application.DTOs.Chatbot;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Enums;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Services;

public class ChatbotQueryService : IChatbotQueryService
{
    private readonly BookKarooDbContext _db;
    public ChatbotQueryService(BookKarooDbContext db) => _db = db;

    public async Task<List<ChatbotShowCard>> SearchShowsAsync(
        GroqIntentResponse intent, Guid? cityId, CancellationToken ct)
    {
        var targetDate = intent.Date switch
        {
            "today"    => DateOnly.FromDateTime(DateTime.Today),
            "tomorrow" => DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
            not null when DateOnly.TryParse(intent.Date, out var d) => d,
            _          => DateOnly.FromDateTime(DateTime.Today)
        };

        (int fromHour, int toHour) = intent.TimeOfDay switch
        {
            "morning"   => (6,  12),
            "afternoon" => (12, 17),
            "evening"   => (17, 21),
            "night"     => (21, 24),
            _           => (0,  24)
        };

        var query = from s in _db.Shows
                    join m in _db.Movies  on s.MovieId  equals m.Id
                    join sc in _db.Screens on s.ScreenId equals sc.Id
                    join v in _db.Venues   on s.VenueId  equals v.Id
                    join c in _db.Cities   on v.CityId   equals c.Id
                    where s.DeletedAt  == null
                       && s.Status     == ShowStatus.Scheduled
                       && m.DeletedAt  == null
                       && m.Status     == MovieStatus.Published
                       && v.DeletedAt  == null
                       && s.ShowDate   == targetDate
                       && s.ShowTime.Hour >= fromHour
                       && s.ShowTime.Hour < toHour
                    select new { s, m, sc, v, c };

        if (cityId.HasValue)
            query = query.Where(x => x.v.CityId == cityId.Value);

        if (!string.IsNullOrWhiteSpace(intent.MovieTitle))
        {
            var title = intent.MovieTitle.ToLower();
            query = query.Where(x => x.m.Title.ToLower().Contains(title));
        }

        if (!string.IsNullOrWhiteSpace(intent.Language))
        {
            var lang = intent.Language;
            query = query.Where(x => x.s.Language != null && x.s.Language == lang);
        }

        if (!string.IsNullOrWhiteSpace(intent.Format))
        {
            var fmt = intent.Format;
            query = query.Where(x => x.s.Format != null && x.s.Format == fmt);
        }

        var rows = await query
            .OrderBy(x => x.s.ShowTime)
            .Take(6)
            .ToListAsync(ct);

        var showIds = rows.Select(r => r.s.Id).ToList();

        var confirmedSeats = await _db.Bookings
            .Where(b => b.Status == BookingStatus.Confirmed && showIds.Contains(b.ShowId ?? Guid.Empty))
            .GroupBy(b => b.ShowId)
            .Select(g => new { ShowId = g.Key, Qty = g.Sum(b => b.TicketQty) })
            .ToListAsync(ct);

        var confirmedMap = confirmedSeats.ToDictionary(x => x.ShowId ?? Guid.Empty, x => x.Qty);

        return rows.Select(r =>
        {
            var booked    = confirmedMap.GetValueOrDefault(r.s.Id, 0);
            var available = Math.Max(0, r.sc.TotalSeats - booked);
            var pct       = r.sc.TotalSeats > 0 ? (double)available / r.sc.TotalSeats : 0;
            var avail     = pct > 0.5 ? "green" : pct > 0.1 ? "orange" : available > 0 ? "red" : "sold_out";

            return new ChatbotShowCard
            {
                ShowId         = r.s.Id,
                MovieTitle     = r.m.Title,
                MovieSlug      = r.m.Slug,
                PosterUrl      = r.m.PosterUrl ?? string.Empty,
                Certificate    = r.m.Certificate ?? string.Empty,
                Format         = r.s.Format   ?? string.Empty,
                Language       = r.s.Language ?? string.Empty,
                ShowDate       = r.s.ShowDate.ToString("dd MMM yyyy"),
                ShowTime       = r.s.ShowTime.ToString("hh:mm tt"),
                VenueName      = r.v.Name,
                ScreenName     = r.sc.Name,
                CityName       = r.c.Name,
                LowestPrice    = 0,
                AvailableSeats = available,
                Availability   = avail,
            };
        }).ToList();
    }

    public async Task<List<ChatbotEventCard>> SearchEventsAsync(
        GroqIntentResponse intent, Guid? cityId, CancellationToken ct)
    {
        var query = from e in _db.Events
                    join v in _db.Venues on e.VenueId equals v.Id into vg
                    from v in vg.DefaultIfEmpty()
                    join c in _db.Cities on v.CityId  equals c.Id into cg
                    from c in cg.DefaultIfEmpty()
                    where e.DeletedAt == null
                       && e.Status    == MovieStatus.Published
                       && e.EventDate >= DateTime.UtcNow
                    select new { e, v, c };

        if (!string.IsNullOrWhiteSpace(intent.EventType))
        {
            if (Enum.TryParse<EventType>(intent.EventType, true, out var et))
                query = query.Where(x => x.e.Type == et);
        }

        if (cityId.HasValue)
            query = query.Where(x => x.v != null && x.v.CityId == cityId.Value);

        var rows = await query.OrderBy(x => x.e.EventDate).Take(4).ToListAsync(ct);

        return rows.Select(r => new ChatbotEventCard
        {
            EventId        = r.e.Id,
            Title          = r.e.Title,
            Slug           = r.e.Slug,
            PosterUrl      = r.e.PosterUrl ?? string.Empty,
            Type           = r.e.Type.ToString().ToLower(),
            EventDateLabel = r.e.EventDate.HasValue
                ? r.e.EventDate.Value.ToString("dd MMM yyyy")
                : string.Empty,
            EventTimeLabel = r.e.EventDate.HasValue
                ? r.e.EventDate.Value.ToString("hh:mm tt")
                : string.Empty,
            VenueName      = r.v?.Name ?? string.Empty,
            CityName       = r.c?.Name ?? string.Empty,
            LowestPrice    = 0,
        }).ToList();
    }

    public async Task<List<ChatbotBookingCard>> GetUserBookingsAsync(Guid userId, CancellationToken ct)
    {
        var now = DateTime.UtcNow;

        var rows = await (
            from b in _db.Bookings
            join s in _db.Shows   on b.ShowId equals s.Id
            join v in _db.Venues  on s.VenueId equals v.Id
            where b.UserId    == userId
               && b.Status    == BookingStatus.Confirmed
               && b.DeletedAt == null
               && s.ShowDatetime > now
            orderby s.ShowDatetime
            select new { b, s, v }
        ).Take(5).ToListAsync(ct);

        var movieIds = rows.Where(r => r.s.MovieId.HasValue).Select(r => r.s.MovieId!.Value).Distinct().ToList();
        var movies   = await _db.Movies.Where(m => movieIds.Contains(m.Id)).ToListAsync(ct);
        var movieMap = movies.ToDictionary(m => m.Id);

        var eventIds = rows.Where(r => r.s.EventId.HasValue).Select(r => r.s.EventId!.Value).Distinct().ToList();
        var events   = await _db.Events.Where(e => eventIds.Contains(e.Id)).ToListAsync(ct);
        var eventMap = events.ToDictionary(e => e.Id);

        return rows.Select(r =>
        {
            string title  = string.Empty;
            string poster = string.Empty;
            if (r.s.MovieId.HasValue && movieMap.TryGetValue(r.s.MovieId.Value, out var mov))
            {
                title  = mov.Title;
                poster = mov.PosterUrl ?? string.Empty;
            }
            else if (r.s.EventId.HasValue && eventMap.TryGetValue(r.s.EventId.Value, out var ev))
            {
                title  = ev.Title;
                poster = ev.PosterUrl ?? string.Empty;
            }

            return new ChatbotBookingCard
            {
                BookingRef = r.b.BookingRef,
                Title      = title,
                PosterUrl  = poster,
                ShowDate   = r.s.ShowDate.ToString("dd MMM yyyy"),
                ShowTime   = r.s.ShowTime.ToString("hh:mm tt"),
                VenueName  = r.v.Name,
                Status     = r.b.Status.ToString(),
                TicketQty  = r.b.TicketQty,
                AmountPaid = r.b.AmountPaid,
            };
        }).ToList();
    }
}
