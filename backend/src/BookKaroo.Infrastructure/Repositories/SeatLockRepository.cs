using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Domain.Entities;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Repositories;

public class SeatLockRepository : ISeatLockRepository
{
    private readonly BookKarooDbContext _db;
    public SeatLockRepository(BookKarooDbContext db) => _db = db;

    public async Task<IEnumerable<SeatLock>> GetActiveLocksAsync(Guid showId, CancellationToken ct = default) =>
        await _db.SeatLocks.Where(s => s.ShowId == showId && s.ExpiresAt > DateTime.UtcNow).ToListAsync(ct);

    public async Task LockSeatAsync(SeatLock seatLock, CancellationToken ct = default)
    {
        await _db.SeatLocks.AddAsync(seatLock, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteExpiredAsync(CancellationToken ct = default)
    {
        var expired = await _db.SeatLocks.Where(s => s.ExpiresAt <= DateTime.UtcNow).ToListAsync(ct);
        _db.SeatLocks.RemoveRange(expired);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteByShowAndSeatsAsync(Guid showId, IEnumerable<string> seatLabels, CancellationToken ct = default)
    {
        var labels = seatLabels.ToList();
        var locks = await _db.SeatLocks
            .Where(s => s.ShowId == showId && labels.Contains(s.SeatLabel))
            .ToListAsync(ct);
        _db.SeatLocks.RemoveRange(locks);
        await _db.SaveChangesAsync(ct);
    }
}
