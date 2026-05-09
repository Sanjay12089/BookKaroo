using BookKaroo.Application.DTOs.Movies;

namespace BookKaroo.Application.Interfaces.Services;

public interface IMovieService
{
    Task<MovieListPagedResponse> GetListAsync(MovieFilterRequest filter, CancellationToken ct = default);
    Task<MovieListResponse> GetDetailAsync(string slug, CancellationToken ct = default);
    Task<ShowtimesResponse> GetShowtimesAsync(string slug, string? date, CancellationToken ct = default);
}
