namespace BookKaroo.Application.DTOs.Events;

public record PriceTier(
    string  Name,
    decimal Price,
    int     Capacity,
    string  Color);

public record Artist(
    string Name,
    string Type);

public record OrganizerInfo(
    string  Name,
    string? Contact,
    string? Stadium);

public record EventListResponse(
    Guid     Id,
    string   Title,
    string   Slug,
    string   Type,
    string?  PosterUrl,
    string?  BackdropUrl,
    string?  EventDate,
    string   EventDateLabel,
    string   EventTimeLabel,
    string?  Language,
    int      AgeRestriction,
    int?     DurationMin,
    string   VenueName,
    string   CityName,
    IReadOnlyList<PriceTier> PriceTiers,
    decimal  LowestPrice,
    IReadOnlyList<Artist>    Artists,
    string   Status);

public record EventDetailResponse(
    Guid     Id,
    string   Title,
    string   Slug,
    string   Type,
    string?  PosterUrl,
    string?  BackdropUrl,
    string?  EventDate,
    string   EventDateLabel,
    string   EventTimeLabel,
    string?  Language,
    int      AgeRestriction,
    int?     DurationMin,
    string   VenueName,
    string   CityName,
    IReadOnlyList<PriceTier> PriceTiers,
    decimal  LowestPrice,
    IReadOnlyList<Artist>    Artists,
    string   Status,
    // Detail-only fields
    string?        Description,
    OrganizerInfo? Organizer,
    string?        VenueAddress,
    string[]       VenueAmenities,
    double?        VenueLatitude,
    double?        VenueLongitude,
    IReadOnlyList<PriceTier> AllPriceTiers);
