using BookKaroo.Application.DTOs.Admin;

namespace BookKaroo.Application.Interfaces.Services;

public interface IAdminService
{
    Task<int> SyncTmdbPostersAsync(CancellationToken ct = default);
    Task<DashboardResponse> GetDashboardAsync(CancellationToken ct = default);
    Task<AuditLogPagedResponse> GetAuditLogsAsync(
        string? entityType, int page, int pageSize, CancellationToken ct = default);

    // Movies
    Task<AdminMoviePagedResponse> GetMoviesAsync(
        string? search, string? status, string? category,
        int page, int pageSize, CancellationToken ct = default);
    Task<AdminMovieDetailResponse> GetMovieByIdAsync(Guid id, CancellationToken ct = default);
    Task<AdminMovieResponse> CreateMovieAsync(CreateMovieRequest req, CancellationToken ct = default);
    Task<AdminMovieResponse> UpdateMovieAsync(Guid id, UpdateMovieRequest req, CancellationToken ct = default);
    Task DeleteMovieAsync(Guid id, CancellationToken ct = default);
    Task<AdminMovieResponse> SyncFromTmdbAsync(int tmdbId, CancellationToken ct = default);
    Task<ImportPopularResult> ImportPopularAsync(CancellationToken ct = default);

    // Events
    Task<AdminEventPagedResponse> GetEventsAsync(
        string? search, string? type, string? status,
        int page, int pageSize, CancellationToken ct = default);
    Task<AdminEventDetailResponse> GetEventByIdAsync(Guid id, CancellationToken ct = default);
    Task<AdminEventResponse> CreateEventAsync(CreateEventRequest req, CancellationToken ct = default);
    Task<AdminEventResponse> UpdateEventAsync(Guid id, UpdateEventRequest req, CancellationToken ct = default);
    Task DeleteEventAsync(Guid id, CancellationToken ct = default);

    // Venues list (for event form)
    Task<IReadOnlyList<AdminVenueItem>> GetVenuesAsync(CancellationToken ct = default);

    // Admin Bookings
    Task<AdminBookingPagedResponse> GetAdminBookingsAsync(
        string? search, string? status, Guid? movieId, Guid? cityId,
        DateOnly? fromDate, DateOnly? toDate,
        int page, int pageSize, CancellationToken ct = default);

    Task<AdminBookingDto> GetAdminBookingDetailAsync(string bookingRef, CancellationToken ct = default);

    Task<AdminCancelBookingResponse> AdminCancelBookingAsync(string bookingRef, CancellationToken ct = default);

    Task<AdminRefundResponse> AdminProcessRefundAsync(string bookingRef, decimal refundAmount, CancellationToken ct = default);

    Task ResendBookingEmailAsync(string bookingRef, CancellationToken ct = default);

    // Admin Users
    Task<AdminUserPagedResponse> GetAdminUsersAsync(
        string? search, string? role, bool? isBlocked, Guid? cityId,
        int page, int pageSize, CancellationToken ct = default);

    Task<AdminUserDetailDto> GetAdminUserDetailAsync(Guid userId, CancellationToken ct = default);

    Task BlockUserAsync(Guid userId, CancellationToken ct = default);
    Task UnblockUserAsync(Guid userId, CancellationToken ct = default);
    Task<string> AdminResetPasswordAsync(Guid userId, CancellationToken ct = default);
}
