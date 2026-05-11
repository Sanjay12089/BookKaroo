using System.Text.Json;
using System.Text.RegularExpressions;
using BookKaroo.Application.DTOs.Admin;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Application.Services;

public class AdminService : IAdminService
{
    private readonly IMovieRepository    _movies;
    private readonly IEventRepository    _events;
    private readonly IAdminRepository    _adminRepo;
    private readonly IAuditLogService    _audit;
    private readonly ITmdbService        _tmdb;
    private readonly IHttpClientFactory  _http;
    private readonly ILogger<AdminService> _logger;

    // Injected via IRepository<Venue> — registered in DI as IRepository<Venue>
    private readonly IRepository<Venue>  _venues;
    private readonly ICityRepository     _cities;

    public AdminService(
        IMovieRepository     movies,
        IEventRepository     events,
        IAdminRepository     adminRepo,
        IAuditLogService     audit,
        ITmdbService         tmdb,
        IHttpClientFactory   http,
        ILogger<AdminService> logger,
        IRepository<Venue>   venues,
        ICityRepository      cities)
    {
        _movies    = movies;
        _events    = events;
        _adminRepo = adminRepo;
        _audit     = audit;
        _tmdb      = tmdb;
        _http      = http;
        _logger    = logger;
        _venues    = venues;
        _cities    = cities;
    }

    // ── Legacy TMDB poster sync ───────────────────────────────────────────────

    public async Task<int> SyncTmdbPostersAsync(CancellationToken ct = default)
    {
        var (allMovies, _) = await _movies.GetPublishedAsync(null, null, null, null, null, null, 1, 100, ct);
        var moviesWithTmdb = allMovies.Where(m => m.TmdbId.HasValue).ToList();
        int updated = 0;
        var bearer = Environment.GetEnvironmentVariable("TMDB_BEARER");
        if (string.IsNullOrEmpty(bearer) || bearer.StartsWith("placeholder"))
        {
            _logger.LogWarning("TMDB_BEARER not configured — cannot sync posters.");
            return 0;
        }
        var client = _http.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", bearer);
        foreach (var movie in moviesWithTmdb)
        {
            try
            {
                var url = $"https://api.themoviedb.org/3/movie/{movie.TmdbId}?append_to_response=videos";
                var response = await client.GetStringAsync(url, ct);
                var doc = JsonDocument.Parse(response);
                var root = doc.RootElement;
                bool changed = false;
                if (root.TryGetProperty("poster_path", out var poster) && poster.ValueKind != JsonValueKind.Null)
                { movie.PosterUrl = poster.GetString(); changed = true; }
                if (root.TryGetProperty("backdrop_path", out var backdrop) && backdrop.ValueKind != JsonValueKind.Null)
                { movie.BackdropUrl = backdrop.GetString(); changed = true; }
                if (root.TryGetProperty("vote_average", out var rating))
                { movie.ImdbRating = (decimal)rating.GetDouble(); changed = true; }
                if (root.TryGetProperty("videos", out var videos) && videos.TryGetProperty("results", out var results))
                {
                    var trailer = results.EnumerateArray()
                        .FirstOrDefault(v =>
                            v.TryGetProperty("type", out var t) && t.GetString() == "Trailer" &&
                            v.TryGetProperty("site", out var s) && s.GetString() == "YouTube");
                    if (trailer.ValueKind != JsonValueKind.Undefined && trailer.TryGetProperty("key", out var key))
                    { movie.TrailerUrl = $"https://www.youtube.com/watch?v={key.GetString()}"; changed = true; }
                }
                if (changed) { await _movies.UpdateAsync(movie, ct); updated++; }
                await Task.Delay(300, ct);
            }
            catch (Exception ex) { _logger.LogWarning(ex, "Failed to sync TMDB data for '{Title}'", movie.Title); }
        }
        return updated;
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────

    public async Task<DashboardResponse> GetDashboardAsync(CancellationToken ct = default)
    {
        var now          = DateTime.UtcNow;
        var todayStart   = now.Date;
        var todayEnd     = todayStart.AddDays(1);
        var weekStart    = todayStart.AddDays(-(int)now.DayOfWeek);
        var monthStart   = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var sevenDaysAgo = todayStart.AddDays(-6);

        var todayBookings  = await _adminRepo.CountTodayBookingsAsync(todayStart, todayEnd, ct);
        var todayRevenue   = await _adminRepo.SumTodayRevenueAsync(todayStart, todayEnd, ct);
        var weekRevenue    = await _adminRepo.SumWeekRevenueAsync(weekStart, ct);
        var monthRevenue   = await _adminRepo.SumMonthRevenueAsync(monthStart, ct);
        var totalUsers     = await _adminRepo.CountTotalUsersAsync(ct);
        var newUsersToday  = await _adminRepo.CountNewUsersTodayAsync(todayStart, todayEnd, ct);
        var topMovie       = await _adminRepo.GetTopMovieThisWeekAsync(weekStart, ct);
        var bookingsPerDay = await _adminRepo.GetBookingsPerDayAsync(sevenDaysAgo, ct);
        var revenuePerCity = await _adminRepo.GetRevenuePerCityAsync(5, ct);
        var recentBookings = await _adminRepo.GetRecentBookingsAsync(10, ct);
        var recentActivity = await _adminRepo.GetRecentActivityAsync(10, ct);

        return new DashboardResponse(
            todayBookings, todayRevenue, weekRevenue, monthRevenue,
            totalUsers, newUsersToday, topMovie,
            bookingsPerDay, revenuePerCity, recentBookings, recentActivity);
    }

    public async Task<AuditLogPagedResponse> GetAuditLogsAsync(
        string? entityType, int page, int pageSize, CancellationToken ct = default)
    {
        var (items, total) = await _adminRepo.GetAuditLogsAsync(entityType, page, pageSize, ct);
        return new AuditLogPagedResponse(
            items, total, page, pageSize,
            (int)Math.Ceiling((double)total / pageSize));
    }

    // ── Movie CRUD ────────────────────────────────────────────────────────────

    public async Task<AdminMoviePagedResponse> GetMoviesAsync(
        string? search, string? status, string? category,
        int page, int pageSize, CancellationToken ct = default)
    {
        var statusEnum   = ParseEnum<MovieStatus>(status);
        var categoryEnum = ParseEnum<MovieCategory>(category);
        var (items, total) = await _movies.GetAllAdminAsync(search, statusEnum, categoryEnum, page, pageSize, ct);
        var mapped = items.Select(MapMovieResponse).ToList();
        return new AdminMoviePagedResponse(mapped, total, page, pageSize,
            (int)Math.Ceiling((double)total / pageSize));
    }

    public async Task<AdminMovieDetailResponse> GetMovieByIdAsync(Guid id, CancellationToken ct = default)
    {
        var movie = await _movies.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Movie {id} not found.");
        return MapMovieDetail(movie);
    }

    public async Task<AdminMovieResponse> CreateMovieAsync(CreateMovieRequest req, CancellationToken ct = default)
    {
        var slug = await EnsureUniqueMovieSlug(GenerateSlug(req.Title), null, ct);
        var status   = ParseEnum<MovieStatus>(req.Status)   ?? MovieStatus.Draft;
        var category = ParseEnum<MovieCategory>(req.Category) ?? MovieCategory.NowShowing;

        var movie = new Movie
        {
            Id          = Guid.NewGuid(),
            TmdbId      = req.TmdbId,
            Title       = req.Title,
            Slug        = slug,
            Description = req.Description,
            DurationMin = req.DurationMin,
            Certificate = req.Certificate,
            Languages   = req.Languages ?? [],
            Formats     = req.Formats   ?? [],
            Genres      = req.Genres    ?? [],
            ReleaseDate = ParseDateOnly(req.ReleaseDate),
            PosterUrl   = req.PosterUrl,
            BackdropUrl = req.BackdropUrl,
            TrailerUrl  = req.TrailerUrl,
            ImdbRating  = req.ImdbRating,
            Cast        = req.Cast,
            Crew        = req.Crew,
            Status      = status,
            Category    = category,
        };

        await _movies.AddAsync(movie, ct);
        await _audit.LogAsync(null, "create", "movie", movie.Id, null, new { movie.Title, movie.Status }, null, ct);
        return MapMovieResponse(movie);
    }

    public async Task<AdminMovieResponse> UpdateMovieAsync(Guid id, UpdateMovieRequest req, CancellationToken ct = default)
    {
        var movie = await _movies.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Movie {id} not found.");

        var before = new { movie.Title, movie.Status, movie.Category };

        if (req.Title       != null && req.Title != movie.Title)
        {
            movie.Title = req.Title;
            movie.Slug  = await EnsureUniqueMovieSlug(GenerateSlug(req.Title), id, ct);
        }
        if (req.Description != null) movie.Description = req.Description;
        if (req.DurationMin.HasValue) movie.DurationMin = req.DurationMin.Value;
        if (req.Certificate != null) movie.Certificate = req.Certificate;
        if (req.Languages   != null) movie.Languages   = req.Languages;
        if (req.Formats     != null) movie.Formats     = req.Formats;
        if (req.Genres      != null) movie.Genres      = req.Genres;
        if (req.ReleaseDate != null) movie.ReleaseDate = ParseDateOnly(req.ReleaseDate);
        if (req.PosterUrl   != null) movie.PosterUrl   = req.PosterUrl;
        if (req.BackdropUrl != null) movie.BackdropUrl = req.BackdropUrl;
        if (req.TrailerUrl  != null) movie.TrailerUrl  = req.TrailerUrl;
        if (req.ImdbRating.HasValue) movie.ImdbRating  = req.ImdbRating;
        if (req.Cast        != null) movie.Cast        = req.Cast;
        if (req.Crew        != null) movie.Crew        = req.Crew;
        if (req.Status      != null) movie.Status      = ParseEnum<MovieStatus>(req.Status) ?? movie.Status;
        if (req.Category    != null) movie.Category    = ParseEnum<MovieCategory>(req.Category) ?? movie.Category;

        await _movies.UpdateAsync(movie, ct);
        var after = new { movie.Title, movie.Status, movie.Category };
        await _audit.LogAsync(null, "update", "movie", movie.Id, before, after, null, ct);
        return MapMovieResponse(movie);
    }

    public async Task DeleteMovieAsync(Guid id, CancellationToken ct = default)
    {
        var movie = await _movies.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Movie {id} not found.");
        await _movies.SoftDeleteAsync(id, ct);
        await _audit.LogAsync(null, "delete", "movie", id, new { movie.Title }, null, null, ct);
    }

    public async Task<AdminMovieResponse> SyncFromTmdbAsync(int tmdbId, CancellationToken ct = default)
    {
        var doc = await _tmdb.GetMovieAsync(tmdbId, ct)
            ?? throw new InvalidOperationException($"TMDB returned no data for ID {tmdbId}.");

        var root = doc.RootElement;
        var title = root.GetProperty("title").GetString() ?? "Unknown";

        var existing = await _movies.FindByTmdbIdAsync(tmdbId, ct);
        var isNew = existing is null;
        var movie = existing ?? new Movie { Id = Guid.NewGuid() };

        ApplyTmdbData(movie, root, title);

        if (isNew)
        {
            movie.Slug     = await EnsureUniqueMovieSlug(GenerateSlug(title), null, ct);
            movie.Status   = MovieStatus.Draft;
            movie.Formats  = ["2D"];
            movie.Languages = ["Hindi"];
            await _movies.AddAsync(movie, ct);
            await _audit.LogAsync(null, "create", "movie", movie.Id, null, new { movie.Title, Source = "TMDB" }, null, ct);
        }
        else
        {
            await _movies.UpdateAsync(movie, ct);
            await _audit.LogAsync(null, "update", "movie", movie.Id, null, new { movie.Title, Source = "TMDB" }, null, ct);
        }

        return MapMovieResponse(movie);
    }

    public async Task<ImportPopularResult> ImportPopularAsync(CancellationToken ct = default)
    {
        var doc = await _tmdb.GetPopularAsync(ct);
        if (doc is null) return new ImportPopularResult(0, 0);

        int imported = 0, skipped = 0;

        if (!doc.RootElement.TryGetProperty("results", out var results)) return new ImportPopularResult(0, 0);

        foreach (var item in results.EnumerateArray().Take(20))
        {
            try
            {
                if (!item.TryGetProperty("id", out var idEl)) { skipped++; continue; }
                var tmdbId = idEl.GetInt32();

                var existing = await _movies.FindByTmdbIdAsync(tmdbId, ct);
                if (existing != null) { skipped++; continue; }

                var fullDoc = await _tmdb.GetMovieAsync(tmdbId, ct);
                if (fullDoc is null) { skipped++; continue; }

                var root  = fullDoc.RootElement;
                var title = root.GetProperty("title").GetString() ?? "Unknown";
                var movie = new Movie
                {
                    Id       = Guid.NewGuid(),
                    TmdbId   = tmdbId,
                    Slug     = await EnsureUniqueMovieSlug(GenerateSlug(title), null, ct),
                    Status   = MovieStatus.Draft,
                    Formats  = ["2D"],
                    Languages = ["Hindi"],
                };
                ApplyTmdbData(movie, root, title);
                await _movies.AddAsync(movie, ct);
                imported++;
                await Task.Delay(250, ct);
            }
            catch (Exception ex) { _logger.LogWarning(ex, "ImportPopular: failed for one item"); skipped++; }
        }

        return new ImportPopularResult(imported, skipped);
    }

    // ── Event CRUD ────────────────────────────────────────────────────────────

    public async Task<AdminEventPagedResponse> GetEventsAsync(
        string? search, string? type, string? status,
        int page, int pageSize, CancellationToken ct = default)
    {
        var typeEnum   = ParseEnum<EventType>(type);
        var statusEnum = ParseEnum<MovieStatus>(status);
        var (items, total) = await _events.GetAllAdminAsync(search, typeEnum, statusEnum, page, pageSize, ct);

        var venueIds = items.Where(e => e.VenueId.HasValue).Select(e => e.VenueId!.Value).Distinct().ToList();
        var venueNames = new Dictionary<Guid, string>();
        foreach (var vid in venueIds)
        {
            var v = await _venues.GetByIdAsync(vid, ct);
            if (v != null) venueNames[vid] = v.Name;
        }

        var mapped = items.Select(e => MapEventResponse(e, venueNames)).ToList();
        return new AdminEventPagedResponse(mapped, total, page, pageSize,
            (int)Math.Ceiling((double)total / pageSize));
    }

    public async Task<AdminEventDetailResponse> GetEventByIdAsync(Guid id, CancellationToken ct = default)
    {
        var ev = await _events.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Event {id} not found.");
        var venueName = ev.VenueId.HasValue
            ? (await _venues.GetByIdAsync(ev.VenueId.Value, ct))?.Name ?? "Unknown"
            : "Unknown";
        return MapEventDetail(ev, venueName);
    }

    public async Task<AdminEventResponse> CreateEventAsync(CreateEventRequest req, CancellationToken ct = default)
    {
        var type   = ParseEnum<EventType>(req.Type)       ?? EventType.LiveEvent;
        var status = ParseEnum<MovieStatus>(req.Status)   ?? MovieStatus.Draft;
        var slug   = await EnsureUniqueEventSlug(GenerateSlug(req.Title), null, ct);

        var ev = new Event
        {
            Id             = Guid.NewGuid(),
            Title          = req.Title,
            Slug           = slug,
            Type           = type,
            Description    = req.Description,
            VenueId        = req.VenueId,
            EventDate      = req.EventDate is null ? null : DateTime.Parse(req.EventDate).ToUniversalTime(),
            DurationMin    = req.DurationMin,
            Language       = req.Language,
            AgeRestriction = req.AgeRestriction,
            Organizer      = req.Organizer,
            Artists        = req.Artists,
            PosterUrl      = req.PosterUrl,
            BackdropUrl    = req.BackdropUrl,
            PriceTiers     = req.PriceTiers,
            Status         = status,
        };

        await _events.AddAsync(ev, ct);
        await _audit.LogAsync(null, "create", "event", ev.Id, null, new { ev.Title, ev.Type }, null, ct);

        var venueName = ev.VenueId.HasValue
            ? (await _venues.GetByIdAsync(ev.VenueId.Value, ct))?.Name ?? "Unknown"
            : "Unknown";
        return MapEventResponse(ev, new Dictionary<Guid, string> { [ev.VenueId ?? Guid.Empty] = venueName });
    }

    public async Task<AdminEventResponse> UpdateEventAsync(Guid id, UpdateEventRequest req, CancellationToken ct = default)
    {
        var ev = await _events.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Event {id} not found.");

        var before = new { ev.Title, ev.Status };

        if (req.Title          != null && req.Title != ev.Title)
        { ev.Title = req.Title; ev.Slug = await EnsureUniqueEventSlug(GenerateSlug(req.Title), id, ct); }
        if (req.Type           != null) ev.Type           = ParseEnum<EventType>(req.Type)     ?? ev.Type;
        if (req.Description    != null) ev.Description    = req.Description;
        if (req.VenueId.HasValue)       ev.VenueId        = req.VenueId;
        if (req.EventDate      != null) ev.EventDate      = DateTime.Parse(req.EventDate).ToUniversalTime();
        if (req.DurationMin.HasValue)   ev.DurationMin    = req.DurationMin.Value;
        if (req.Language       != null) ev.Language       = req.Language;
        if (req.AgeRestriction.HasValue) ev.AgeRestriction = req.AgeRestriction.Value;
        if (req.Organizer      != null) ev.Organizer      = req.Organizer;
        if (req.Artists        != null) ev.Artists        = req.Artists;
        if (req.PosterUrl      != null) ev.PosterUrl      = req.PosterUrl;
        if (req.BackdropUrl    != null) ev.BackdropUrl    = req.BackdropUrl;
        if (req.PriceTiers     != null) ev.PriceTiers     = req.PriceTiers;
        if (req.Status         != null) ev.Status         = ParseEnum<MovieStatus>(req.Status) ?? ev.Status;

        await _events.UpdateAsync(ev, ct);
        await _audit.LogAsync(null, "update", "event", ev.Id, before, new { ev.Title, ev.Status }, null, ct);

        var venueName = ev.VenueId.HasValue
            ? (await _venues.GetByIdAsync(ev.VenueId.Value, ct))?.Name ?? "Unknown"
            : "Unknown";
        return MapEventResponse(ev, new Dictionary<Guid, string> { [ev.VenueId ?? Guid.Empty] = venueName });
    }

    public async Task DeleteEventAsync(Guid id, CancellationToken ct = default)
    {
        var ev = await _events.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Event {id} not found.");
        await _events.SoftDeleteAsync(id, ct);
        await _audit.LogAsync(null, "delete", "event", id, new { ev.Title }, null, null, ct);
    }

    public async Task<IReadOnlyList<AdminVenueItem>> GetVenuesAsync(CancellationToken ct = default)
    {
        var venues = await _venues.GetAllAsync(ct);
        var cityIds = venues.Where(v => v.DeletedAt == null)
                            .Select(v => v.CityId).Distinct().ToList();
        var cityNames = new Dictionary<Guid, string>();
        foreach (var cid in cityIds)
        {
            var city = await _cities.GetByIdAsync(cid, ct);
            if (city != null) cityNames[cid] = city.Name;
        }
        return venues
            .Where(v => v.DeletedAt == null)
            .Select(v => new AdminVenueItem(v.Id, v.Name, cityNames.GetValueOrDefault(v.CityId, "")))
            .OrderBy(v => v.CityName).ThenBy(v => v.Name)
            .ToList();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private static string GenerateSlug(string title)
    {
        var slug = title.ToLowerInvariant().Trim();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        return slug.Trim('-');
    }

    private async Task<string> EnsureUniqueMovieSlug(string baseSlug, Guid? excludeId, CancellationToken ct)
    {
        var slug = baseSlug;
        int suffix = 2;
        while (true)
        {
            var existing = await _movies.FindBySlugAsync(slug, ct);
            if (existing is null || existing.Id == excludeId) return slug;
            slug = $"{baseSlug}-{suffix++}";
        }
    }

    private async Task<string> EnsureUniqueEventSlug(string baseSlug, Guid? excludeId, CancellationToken ct)
    {
        var slug = baseSlug;
        int suffix = 2;
        while (true)
        {
            var existing = await _events.FindBySlugAsync(slug, ct);
            if (existing is null || existing.Id == excludeId) return slug;
            slug = $"{baseSlug}-{suffix++}";
        }
    }

    private static void ApplyTmdbData(Movie movie, JsonElement root, string title)
    {
        movie.TmdbId      = root.TryGetProperty("id", out var idEl) ? idEl.GetInt32() : movie.TmdbId;
        movie.Title       = title;
        movie.Description = root.TryGetProperty("overview", out var ov) ? ov.GetString() : movie.Description;
        movie.DurationMin = root.TryGetProperty("runtime", out var rt) && rt.ValueKind != JsonValueKind.Null
            ? rt.GetInt32() : movie.DurationMin;
        movie.ImdbRating  = root.TryGetProperty("vote_average", out var va) && va.ValueKind != JsonValueKind.Null
            ? (decimal)va.GetDouble() : movie.ImdbRating;

        if (root.TryGetProperty("release_date", out var rd) && rd.ValueKind != JsonValueKind.Null)
            movie.ReleaseDate = DateOnly.TryParse(rd.GetString(), out var d) ? d : movie.ReleaseDate;

        if (root.TryGetProperty("poster_path", out var pp) && pp.ValueKind != JsonValueKind.Null)
            movie.PosterUrl = $"https://image.tmdb.org/t/p/w500{pp.GetString()}";
        if (root.TryGetProperty("backdrop_path", out var bp) && bp.ValueKind != JsonValueKind.Null)
            movie.BackdropUrl = $"https://image.tmdb.org/t/p/original{bp.GetString()}";

        if (root.TryGetProperty("genres", out var genres))
            movie.Genres = genres.EnumerateArray()
                .Where(g => g.TryGetProperty("name", out _))
                .Select(g => g.GetProperty("name").GetString()!)
                .ToArray();

        if (root.TryGetProperty("videos", out var videos) && videos.TryGetProperty("results", out var vResults))
        {
            var trailer = vResults.EnumerateArray().FirstOrDefault(v =>
                v.TryGetProperty("type", out var t) && t.GetString() == "Trailer" &&
                v.TryGetProperty("site", out var s) && s.GetString() == "YouTube");
            if (trailer.ValueKind != JsonValueKind.Undefined && trailer.TryGetProperty("key", out var key))
                movie.TrailerUrl = $"https://www.youtube.com/watch?v={key.GetString()}";
        }

        if (root.TryGetProperty("credits", out var credits))
        {
            if (credits.TryGetProperty("cast", out var cast))
            {
                var castList = cast.EnumerateArray().Take(10)
                    .Where(c => c.TryGetProperty("name", out _))
                    .Select(c => new
                    {
                        name      = c.GetProperty("name").GetString(),
                        role      = c.TryGetProperty("character", out var ch) ? ch.GetString() : null,
                        photo     = c.TryGetProperty("profile_path", out var ph) && ph.ValueKind != JsonValueKind.Null
                                    ? $"https://image.tmdb.org/t/p/w185{ph.GetString()}" : null,
                    })
                    .ToList();
                movie.Cast = JsonSerializer.Serialize(castList);
            }
            if (credits.TryGetProperty("crew", out var crew))
            {
                var roles = new[] { "Director", "Producer", "Music Director", "Composer" };
                var crewList = crew.EnumerateArray()
                    .Where(c => c.TryGetProperty("job", out var j) && roles.Contains(j.GetString()))
                    .Select(c => new
                    {
                        name = c.TryGetProperty("name", out var n) ? n.GetString() : null,
                        role = c.TryGetProperty("job",  out var j) ? j.GetString() : null,
                    })
                    .ToList();
                movie.Crew = JsonSerializer.Serialize(crewList);
            }
        }
    }

    private static T? ParseEnum<T>(string? value) where T : struct, Enum =>
        Enum.TryParse<T>(value, ignoreCase: true, out var result) ? result : null;

    private static DateOnly? ParseDateOnly(string? value) =>
        DateOnly.TryParse(value, out var d) ? d : null;

    private static AdminMovieResponse MapMovieResponse(Movie m) => new(
        m.Id, m.TmdbId, m.Title, m.Slug, m.Certificate, m.DurationMin,
        m.Languages, m.Formats, m.Genres,
        m.ReleaseDate?.ToString("yyyy-MM-dd"), m.PosterUrl, m.BackdropUrl, m.TrailerUrl,
        m.ImdbRating, m.Status.ToString(), m.Category.ToString(),
        m.CreatedAt, m.UpdatedAt);

    private static AdminMovieDetailResponse MapMovieDetail(Movie m) => new(
        m.Id, m.TmdbId, m.Title, m.Slug, m.Description, m.Certificate, m.DurationMin,
        m.Languages, m.Formats, m.Genres, m.Cast, m.Crew,
        m.ReleaseDate?.ToString("yyyy-MM-dd"), m.PosterUrl, m.BackdropUrl, m.TrailerUrl,
        m.ImdbRating, m.Status.ToString(), m.Category.ToString(),
        m.CreatedAt, m.UpdatedAt);

    private static AdminEventResponse MapEventResponse(Event e, Dictionary<Guid, string> venueNames)
    {
        var venueName = e.VenueId.HasValue && venueNames.TryGetValue(e.VenueId.Value, out var vn) ? vn : "Unknown";
        var dateLabel = e.EventDate?.ToLocalTime().ToString("ddd, d MMM yyyy") ?? "TBA";
        var lowestPrice = 0m;
        if (!string.IsNullOrEmpty(e.PriceTiers))
        {
            try
            {
                var tiers = JsonSerializer.Deserialize<JsonElement[]>(e.PriceTiers);
                if (tiers?.Length > 0)
                    lowestPrice = tiers
                        .Where(t => t.TryGetProperty("price", out _))
                        .Select(t => t.GetProperty("price").GetDecimal())
                        .DefaultIfEmpty(0m).Min();
            }
            catch { /* malformed JSON — ignore */ }
        }
        return new AdminEventResponse(
            e.Id, e.Title, e.Slug, e.Type.ToString(),
            e.EventDate?.ToString("o"), dateLabel,
            e.Language, e.AgeRestriction ?? 0,
            venueName, e.Status.ToString(), lowestPrice, e.CreatedAt);
    }

    private static AdminEventDetailResponse MapEventDetail(Event e, string venueName)
    {
        return new AdminEventDetailResponse(
            e.Id, e.Title, e.Slug, e.Type.ToString(),
            e.Description, e.VenueId, venueName,
            e.EventDate?.ToString("o"), e.DurationMin,
            e.Language, e.AgeRestriction ?? 0,
            e.Organizer, e.Artists, e.PriceTiers,
            e.PosterUrl, e.BackdropUrl,
            e.Status.ToString(), e.CreatedAt, e.UpdatedAt);
    }
}
