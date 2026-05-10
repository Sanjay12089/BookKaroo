using BookKaroo.Application.DTOs.Shows;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Repositories;

public class ShowRepository : Repository<Show>, IShowRepository
{
    public ShowRepository(BookKarooDbContext db) : base(db) { }

    public async Task<IEnumerable<Show>> GetByMovieAndDateAsync(
        Guid movieId, DateOnly date, CancellationToken ct = default) =>
        await _db.Shows
            .Where(s => s.MovieId == movieId && s.ShowDate == date && s.Status == ShowStatus.Scheduled)
            .OrderBy(s => s.ShowTime)
            .ToListAsync(ct);

    public async Task<IEnumerable<Show>> GetByMovieAndDateAsync(
        Guid movieId, Guid cityId, DateOnly date, CancellationToken ct = default)
    {
        var venueIdsInCity = _db.Venues
            .Where(v => v.CityId == cityId)
            .Select(v => v.Id);

        return await _db.Shows
            .Where(s => s.MovieId == movieId
                     && s.ShowDate == date
                     && s.Status == ShowStatus.Scheduled
                     && venueIdsInCity.Contains(s.VenueId))
            .OrderBy(s => s.VenueId)
            .ThenBy(s => s.ShowTime)
            .ToListAsync(ct);
    }

    public async Task<SeatAvailability> GetSeatAvailabilityAsync(
        Guid showId, CancellationToken ct = default)
    {
        var booked = await (
            from bs in _db.BookingSeats
            join b in _db.Bookings.Where(b => b.ShowId == showId && b.Status == BookingStatus.Confirmed)
                on bs.BookingId equals b.Id
            select bs.SeatLabel
        ).ToArrayAsync(ct);

        var locked = await _db.SeatLocks
            .Where(sl => sl.ShowId == showId && sl.ExpiresAt > DateTime.UtcNow)
            .Select(sl => sl.SeatLabel)
            .ToArrayAsync(ct);

        return new SeatAvailability(booked, locked);
    }

    public async Task<Show?> GetByIdAsync(Guid showId, CancellationToken ct = default) =>
        await _db.Shows.FirstOrDefaultAsync(s => s.Id == showId, ct);
}
