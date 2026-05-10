using System.Text.Json;
using BookKaroo.Application.DTOs.Movies;
using BookKaroo.Application.Exceptions;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Enums;

namespace BookKaroo.Application.Services;

public class MovieService : IMovieService
{
    private readonly IMovieRepository _movies;
    private readonly IShowRepository _shows;
    private readonly IRepository<Domain.Entities.Venue> _venues;

    public MovieService(
        IMovieRepository movies,
        IShowRepository shows,
        IRepository<Domain.Entities.Venue> venues)
    {
        _movies = movies;
        _shows  = shows;
        _venues = venues;
    }

    public async Task<MovieListPagedResponse> GetListAsync(MovieFilterRequest filter, CancellationToken ct = default)
    {
        MovieCategory? cat = filter.Category switch
        {
            "NowShowing"  => MovieCategory.NowShowing,
            "ComingSoon"  => MovieCategory.ComingSoon,
            "Exclusive"   => MovieCategory.Exclusive,
            "Premiere"    => MovieCategory.Premiere,
            _             => null
        };

        var (items, total) = await _movies.GetPublishedAsync(
            filter.Languages, filter.Genres, filter.Formats,
            cat, filter.CityId, filter.Sort,
            filter.Page, filter.PageSize, ct);

        var dtos      = items.Select(Map);
        var totalPages = filter.PageSize == 0 ? 0 : (int)Math.Ceiling((double)total / filter.PageSize);
        return new MovieListPagedResponse(dtos, total, filter.Page, filter.PageSize, totalPages);
    }

    public async Task<MovieListResponse> GetDetailAsync(string slug, CancellationToken ct = default)
    {
        var movie = await _movies.FindBySlugAsync(slug, ct)
            ?? throw new NotFoundException($"Movie '{slug}' not found.");
        return Map(movie);
    }

    public async Task<ShowtimesResponse> GetShowtimesAsync(string slug, string? date, CancellationToken ct = default)
    {
        var movie = await _movies.FindBySlugAsync(slug, ct)
            ?? throw new NotFoundException($"Movie '{slug}' not found.");

        var showDate = date is not null
            ? DateOnly.Parse(date)
            : DateOnly.FromDateTime(DateTime.Today);

        var shows     = (await _shows.GetByMovieAndDateAsync(movie.Id, showDate, ct)).ToList();
        var allVenues = (await _venues.GetAllAsync(ct)).ToDictionary(v => v.Id);

        var grouped = shows
            .GroupBy(s => s.VenueId)
            .Select(g =>
            {
                allVenues.TryGetValue(g.Key, out var venue);
                var amenities = venue?.Amenities is not null
                    ? JsonSerializer.Deserialize<string[]>(venue.Amenities) ?? []
                    : [];

                var slots = g.Select(s =>
                {
                    var overrides = s.PriceOverrides is not null
                        ? JsonSerializer.Deserialize<Dictionary<string, decimal>>(s.PriceOverrides)
                        : null;
                    var price = overrides?.GetValueOrDefault("normal", 180m) ?? 180m;

                    return new ShowtimeSlotResponse(
                        s.Id,
                        s.ShowTime.ToString(@"hh\:mm"),
                        s.Format ?? "2D",
                        s.Language ?? "Hindi",
                        SeatsLeft: 100,
                        Price: price);
                }).OrderBy(s => s.ShowTime).ToArray();

                var fromPrice = slots.Any() ? slots.Min(s => s.Price) : 180m;

                return new ShowtimeVenueResponse(
                    g.Key,
                    venue?.Name ?? "Unknown Venue",
                    venue?.Address,
                    null,
                    amenities,
                    fromPrice,
                    slots);
            })
            .ToArray();

        return new ShowtimesResponse(grouped);
    }

    private static MovieListResponse Map(Domain.Entities.Movie m) => new(
        m.Id, m.Title, m.Slug, m.Description, m.DurationMin,
        m.Languages, m.Formats, m.Genres,
        m.Certificate, m.ReleaseDate?.ToString("yyyy-MM-dd"),
        m.PosterUrl, m.BackdropUrl, m.TrailerUrl,
        m.ImdbRating, m.Status.ToString(), m.Category.ToString());
}
