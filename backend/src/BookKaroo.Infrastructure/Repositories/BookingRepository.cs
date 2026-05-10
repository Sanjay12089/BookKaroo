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

    public async Task<bool> IsSeatBookedAsync(Guid showId, string seatLabel, CancellationToken ct = default) =>
        await (
            from bs in _db.BookingSeats
            join b in _db.Bookings.Where(b => b.ShowId == showId && b.Status == BookKaroo.Domain.Enums.BookingStatus.Confirmed)
                on bs.BookingId equals b.Id
            where bs.SeatLabel == seatLabel
            select bs.Id
        ).AnyAsync(ct);
}
