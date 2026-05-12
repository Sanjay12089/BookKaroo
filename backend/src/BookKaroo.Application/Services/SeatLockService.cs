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

        var newLocks = new List<SeatLock>();

        foreach (var seat in seats)
        {
            // Check confirmed booking
            var isBooked = await _bookingRepo.IsSeatBookedAsync(showId, seat, ct);
            if (isBooked)
                throw new ConflictException($"Seat {seat} is already booked.");

            // Check existing lock
            var existing = await _lockRepo.GetActiveLockForSeatAsync(showId, seat, ct);
            if (existing is not null)
            {
                if (existing.UserId != userId)
                    throw new ConflictException($"Seat {seat} is currently held by another user.");

                // Same user already holds this seat — idempotent, collect the existing lock
                newLocks.Add(existing);
                continue;
            }

            var expiresAt = DateTime.UtcNow.Add(lockDuration);
            var seatLock  = new SeatLock
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
            _logger.LogInformation("Seat locked {Seat} for show {ShowId} by user {UserId}", seat, showId, userId);
        }

        var first     = newLocks[0];
        var expiresAt2 = newLocks.Min(l => l.ExpiresAt);

        return new SeatLockResponse(first.Id, expiresAt2, seats);
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
