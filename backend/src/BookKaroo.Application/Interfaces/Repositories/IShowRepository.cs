using BookKaroo.Application.DTOs.Shows;
using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Repositories;

public interface IShowRepository : IRepository<Show>
{
    Task<IEnumerable<Show>> GetByMovieAndDateAsync(Guid movieId, DateOnly date, CancellationToken ct = default);
    Task<IEnumerable<Show>> GetByMovieAndDateAsync(Guid movieId, Guid cityId, DateOnly date, CancellationToken ct = default);
    Task<SeatAvailability>  GetSeatAvailabilityAsync(Guid showId, CancellationToken ct = default);
    Task<Show?>             GetByIdAsync(Guid showId, CancellationToken ct = default);
}
