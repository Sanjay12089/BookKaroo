using System.Text.Json;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Application.Services;

public class AdminService : IAdminService
{
    private readonly IMovieRepository _movies;
    private readonly IHttpClientFactory _http;
    private readonly ILogger<AdminService> _logger;

    public AdminService(IMovieRepository movies, IHttpClientFactory http, ILogger<AdminService> logger)
    {
        _movies = movies;
        _http = http;
        _logger = logger;
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
}
