using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Repositories;

public interface IShowRepository : IRepository<Show>
{
    Task<IEnumerable<Show>> GetByMovieAndDateAsync(Guid movieId, DateOnly date, CancellationToken ct = default);
    Task<Show?> GetByIdWithVenueAsync(Guid showId, CancellationToken ct = default);
}
