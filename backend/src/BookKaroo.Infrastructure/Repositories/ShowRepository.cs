using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Domain.Entities;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Repositories;

public class ShowRepository : Repository<Show>, IShowRepository
{
    public ShowRepository(BookKarooDbContext db) : base(db) { }

    public async Task<IEnumerable<Show>> GetByMovieAndDateAsync(
        Guid movieId, DateOnly date, CancellationToken ct = default) =>
        await _db.Shows
            .Where(s => s.MovieId == movieId && s.ShowDate == date && s.Status == Domain.Enums.ShowStatus.Scheduled)
            .OrderBy(s => s.ShowTime)
            .ToListAsync(ct);

    public async Task<Show?> GetByIdWithVenueAsync(Guid showId, CancellationToken ct = default) =>
        await _db.Shows.FirstOrDefaultAsync(s => s.Id == showId, ct);
}
