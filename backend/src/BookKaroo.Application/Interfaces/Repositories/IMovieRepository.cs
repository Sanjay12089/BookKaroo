using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;

namespace BookKaroo.Application.Interfaces.Repositories;

public interface IMovieRepository : IRepository<Movie>
{
    Task<Movie?> FindBySlugAsync(string slug, CancellationToken ct = default);

    Task<(IEnumerable<Movie> Items, int Total)> GetPublishedAsync(
        string? language, string? genre, string? format, MovieCategory? category,
        string? sort, int page, int pageSize, CancellationToken ct = default);

    Task<IEnumerable<Movie>> GetRelatedAsync(
        Guid movieId, string[] genres, int count, CancellationToken ct = default);
}
