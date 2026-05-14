using BookKaroo.Application.DTOs.Shows;
using BookKaroo.Application.Exceptions;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Application.Services;

public class SeatLockService : ISeatLockService
{
    private readonly ISeatLockRepository  _lockRepo;
    private readonly IBookingRepository   _bookingRepo;
    private readonly ISettingRepository   _settings;
    private readonly ILogger<SeatLockService> _logger;

    public SeatLockService(
        ISeatLockRepository      lockRepo,
        IBookingRepository       bookingRepo,
        ISettingRepository       settings,
        ILogger<SeatLockService> logger)
    {
        _lockRepo    = lockRepo;
        _bookingRepo = bookingRepo;
        _settings    = settings;
        _logger      = logger;
    }

    public async Task<SeatLockResponse> LockSeatsAsync(
        Guid userId, Guid showId, string[] seats, CancellationToken ct = default)
    {
        var minutesStr   = await _settings.GetAsync("seat_lock_minutes", ct);
        var lockMinutes  = double.TryParse(minutesStr, out var min) ? min : 8;
        var lockDuration = TimeSpan.FromMinutes(lockMinutes);

        // Release ALL existing locks for this user+show before creating the new set.
        // If the user has deselected seats (e.g. had A1–A5 locked, now wants A1–A3),
        // the old A4/A5 locks must be removed so other users see them as available.
        await _lockRepo.DeleteByUserAndShowAsync(userId, showId, ct);

        // Single expiry for the whole batch (consistent countdown for all seats)
        var expiresAt = DateTime.UtcNow.Add(lockDuration);
        var newLocks  = new List<SeatLock>();

        foreach (var seat in seats)
        {
            // Reject if already booked by anyone
            var isBooked = await _bookingRepo.IsSeatBookedAsync(showId, seat, ct);
            if (isBooked)
                throw new ConflictException($"Seat {seat} is already booked.");

            // Reject if another user holds this seat
            var existing = await _lockRepo.GetActiveLockForSeatAsync(showId, seat, ct);
            if (existing is not null && existing.UserId != userId)
                throw new ConflictException($"Seat {seat} is currently held by another user.");

            var seatLock = new SeatLock
            {
                Id        = Guid.NewGuid(),
                ShowId    = showId,
                SeatLabel = seat,
                UserId    = userId,
                ExpiresAt = expiresAt,
                CreatedAt = DateTime.UtcNow,
            };

            var added = await _lockRepo.AddAsync(seatLock, ct);
            newLocks.Add(added);
            _logger.LogInformation("Seat locked {Seat}/{ShowId}/{UserId}", seat, showId, userId);
        }

        return new SeatLockResponse(newLocks[0].Id, expiresAt, seats);
    }

    public async Task ReleaseLocksAsync(Guid userId, Guid showId, CancellationToken ct = default)
    {
        await _lockRepo.DeleteByUserAndShowAsync(userId, showId, ct);
        _logger.LogInformation("Released all seat locks for show {ShowId} by user {UserId}", showId, userId);
    }

    public async Task<int> SweepExpiredAsync(CancellationToken ct = default)
    {
        var count = await _lockRepo.DeleteExpiredAsync(ct);
        if (count > 0)
            _logger.LogInformation("Swept {Count} expired seat locks", count);
        return count;
    }
}
