using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Domain.Entities;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Repositories;

public class BookingRepository : Repository<Booking>, IBookingRepository
{
    public BookingRepository(BookKarooDbContext db) : base(db) { }

    public async Task<IEnumerable<Booking>> GetByUserAsync(Guid userId, CancellationToken ct = default) =>
        await _db.Bookings.Where(b => b.UserId == userId).OrderByDescending(b => b.CreatedAt).ToListAsync(ct);

    public async Task<Booking?> GetByRefAsync(string bookingRef, CancellationToken ct = default) =>
        await _db.Bookings.FirstOrDefaultAsync(b => b.BookingRef == bookingRef, ct);

    public async Task<IEnumerable<Booking>> GetByShowAsync(Guid showId, CancellationToken ct = default) =>
        await _db.Bookings.Where(b => b.ShowId == showId).ToListAsync(ct);
}
