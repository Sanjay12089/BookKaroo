using BookKaroo.Domain.Enums;

namespace BookKaroo.Application.DTOs.Auth;

public record UserResponse(
    Guid Id,
    string Email,
    string Mobile,
    string Name,
    UserRole Role,
    bool EmailVerified,
    Guid? CityId,
    string? StateCode,
    string? ProfilePicUrl
);
