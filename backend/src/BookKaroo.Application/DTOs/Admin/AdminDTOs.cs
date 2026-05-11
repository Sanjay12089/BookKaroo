namespace BookKaroo.Application.DTOs.Admin;

public record TopMovieDto(
    Guid   Id,
    string Title,
    string Slug,
    string? PosterUrl,
    int    BookingCount);

public record DayCount(
    string Date,
    int    Count);

public record CityRevenue(
    string  CityName,
    decimal Revenue);

public record RecentBookingDto(
    string   BookingRef,
    string   Status,
    decimal  AmountPaid,
    DateTime CreatedAt,
    string   UserName,
    string   UserEmail,
    string?  MovieTitle,
    string?  PosterUrl,
    string?  ShowDate,
    string?  ShowTime,
    string   VenueName);

public record ActivityDto(
    string   Action,
    string   EntityType,
    Guid?    EntityId,
    DateTime CreatedAt,
    string?  Ip);

public record DashboardResponse(
    int                      TodayBookings,
    decimal                  TodayRevenue,
    decimal                  WeekRevenue,
    decimal                  MonthRevenue,
    int                      TotalUsers,
    int                      NewUsersToday,
    TopMovieDto?             TopMovie,
    IReadOnlyList<DayCount>  BookingsPerDay,
    IReadOnlyList<CityRevenue> RevenuePerCity,
    IReadOnlyList<RecentBookingDto> RecentBookings,
    IReadOnlyList<ActivityDto> RecentActivity);

public record AuditLogResponse(
    Guid     Id,
    Guid?    UserId,
    string   Action,
    string   EntityType,
    Guid?    EntityId,
    string?  Before,
    string?  After,
    string?  Ip,
    DateTime CreatedAt);

public record AuditLogPagedResponse(
    IReadOnlyList<AuditLogResponse> Items,
    int Total,
    int Page,
    int PageSize,
    int TotalPages);
