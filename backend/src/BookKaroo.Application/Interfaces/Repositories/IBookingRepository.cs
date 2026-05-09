using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Repositories;

public interface IBookingRepository : IRepository<Booking>
{
    Task<IEnumerable<Booking>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<Booking?> GetByRefAsync(string bookingRef, CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetByShowAsync(Guid showId, CancellationToken ct = default);
}
