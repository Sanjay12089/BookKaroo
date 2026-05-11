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
}
