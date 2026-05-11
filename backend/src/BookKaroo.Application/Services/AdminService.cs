using System.Text.Json;
using BookKaroo.Application.DTOs.Admin;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Application.Services;

public class AdminService : IAdminService
{
    private readonly IMovieRepository _movies;
    private readonly IHttpClientFactory _http;
    private readonly ILogger<AdminService> _logger;
    private readonly IAdminRepository _adminRepo;

    public AdminService(
        IMovieRepository movies,
        IHttpClientFactory http,
        ILogger<AdminService> logger,
        IAdminRepository adminRepo)
    {
        _movies    = movies;
        _http      = http;
        _logger    = logger;
        _adminRepo = adminRepo;
    }

    public async Task<int> SyncTmdbPostersAsync(CancellationToken ct = default)
    {
        // Get all published movies that have a TmdbId
        var (allMovies, _) = await _movies.GetPublishedAsync(null, null, null, null, null, null, 1, 100, ct);
        var moviesWithTmdb = allMovies.Where(m => m.TmdbId.HasValue).ToList();

        int updated = 0;
        var bearer = Environment.GetEnvironmentVariable("TMDB_BEARER");

        if (string.IsNullOrEmpty(bearer) || bearer.StartsWith("placeholder"))
        {
            _logger.LogWarning("TMDB_BEARER not configured — cannot sync posters. Set a real TMDB bearer token.");
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
                {
                    movie.PosterUrl = poster.GetString();
                    changed = true;
                }
                if (root.TryGetProperty("backdrop_path", out var backdrop) && backdrop.ValueKind != JsonValueKind.Null)
                {
                    movie.BackdropUrl = backdrop.GetString();
                    changed = true;
                }
                if (root.TryGetProperty("vote_average", out var rating))
                {
                    movie.ImdbRating = (decimal)rating.GetDouble();
                    changed = true;
                }

                // Get trailer from videos
                if (root.TryGetProperty("videos", out var videos) &&
                    videos.TryGetProperty("results", out var results))
                {
                    var trailer = results.EnumerateArray()
                        .FirstOrDefault(v =>
                            v.TryGetProperty("type", out var t) && t.GetString() == "Trailer" &&
                            v.TryGetProperty("site", out var s) && s.GetString() == "YouTube");

                    if (trailer.ValueKind != JsonValueKind.Undefined &&
                        trailer.TryGetProperty("key", out var key))
                    {
                        movie.TrailerUrl = $"https://www.youtube.com/watch?v={key.GetString()}";
                        changed = true;
                    }
                }

                if (changed)
                {
                    await _movies.UpdateAsync(movie, ct);
                    updated++;
                    _logger.LogInformation("Synced TMDB data for '{Title}' (TmdbId {Id})", movie.Title, movie.TmdbId);
                }

                // Respect TMDB rate limit (40 req / 10s)
                await Task.Delay(300, ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to sync TMDB data for movie '{Title}'", movie.Title);
            }
        }

        return updated;
    }

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
}
