using BookKaroo.Application.DTOs.Admin;

namespace BookKaroo.Application.Interfaces.Services;

public interface IAdminService
{
    /// <summary>
    /// Calls TMDB API for every movie that has a TmdbId and updates
    /// PosterUrl / BackdropUrl / TrailerUrl / ImdbRating in the database.
    /// Returns a count of movies updated.
    /// </summary>
    Task<int> SyncTmdbPostersAsync(CancellationToken ct = default);

    Task<DashboardResponse> GetDashboardAsync(CancellationToken ct = default);

    Task<AuditLogPagedResponse> GetAuditLogsAsync(
        string? entityType, int page, int pageSize, CancellationToken ct = default);
}
