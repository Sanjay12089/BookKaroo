namespace BookKaroo.Application.DTOs.Movies;

public record MovieListResponse(
    Guid Id,
    string Title,
    string Slug,
    string? Description,
    int DurationMin,
    string[] Languages,
    string[] Formats,
    string[] Genres,
    string? Certificate,
    string? ReleaseDate,
    string? PosterUrl,
    string? BackdropUrl,
    string? TrailerUrl,
    decimal? ImdbRating,
    string Status,
    string Category
);

public record MovieListPagedResponse(
    IEnumerable<MovieListResponse> Items,
    int Total,
    int Page,
    int PageSize
);

public record MovieFilterRequest(
    string? Language = null,
    string? Genre = null,
    string? Format = null,
    string? Category = null,
    string? Sort = null,
    int Page = 1,
    int PageSize = 20
);
