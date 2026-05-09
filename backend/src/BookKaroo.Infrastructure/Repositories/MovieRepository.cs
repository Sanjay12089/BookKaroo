using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Repositories;

public class MovieRepository : Repository<Movie>, IMovieRepository
{
    public MovieRepository(BookKarooDbContext db) : base(db) { }

    public async Task<Movie?> FindBySlugAsync(string slug, CancellationToken ct = default) =>
        await _db.Movies.FirstOrDefaultAsync(m => m.Slug == slug, ct);

    public async Task<(IEnumerable<Movie> Items, int Total)> GetPublishedAsync(
        string? language, string? genre, string? format, MovieCategory? category,
        string? sort, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _db.Movies.Where(m => m.Status == MovieStatus.Published);

        if (!string.IsNullOrEmpty(language))
            query = query.Where(m => m.Languages.Contains(language));
        if (!string.IsNullOrEmpty(genre))
            query = query.Where(m => m.Genres.Contains(genre));
        if (!string.IsNullOrEmpty(format))
            query = query.Where(m => m.Formats.Contains(format));
        if (category.HasValue)
            query = query.Where(m => m.Category == category.Value);

        query = sort switch
        {
            "rating"  => query.OrderByDescending(m => m.ImdbRating),
            "release" => query.OrderByDescending(m => m.ReleaseDate),
            "az"      => query.OrderBy(m => m.Title),
            _         => query.OrderByDescending(m => m.CreatedAt)
        };

        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }
}
