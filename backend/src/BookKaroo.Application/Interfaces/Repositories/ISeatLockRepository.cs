using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Repositories;

public interface ISeatLockRepository
{
    Task<IEnumerable<SeatLock>> GetActiveLocksAsync(Guid showId, CancellationToken ct = default);
    Task LockSeatAsync(SeatLock seatLock, CancellationToken ct = default);
    Task DeleteExpiredAsync(CancellationToken ct = default);
    Task DeleteByShowAndSeatsAsync(Guid showId, IEnumerable<string> seatLabels, CancellationToken ct = default);
}
