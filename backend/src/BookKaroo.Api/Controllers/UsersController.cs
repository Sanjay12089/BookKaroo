using System.Security.Claims;
using BCrypt.Net;
using BookKaroo.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

[ApiController]
[Route("api/users")]
[Produces("application/json")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _users;

    public UsersController(IUserRepository users) => _users = users;

    /// <summary>Update the authenticated user's profile.</summary>
    [HttpPut("me")]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _users.GetByIdAsync(userId, ct);
        if (user == null) return NotFound();

        if (!string.IsNullOrWhiteSpace(request.Name))   user.Name   = request.Name.Trim();
        if (!string.IsNullOrWhiteSpace(request.Mobile)) user.Mobile = request.Mobile.Trim();
        if (request.Gender  != null) user.Gender  = request.Gender;
        if (request.CityId  != null) user.CityId  = request.CityId == "" ? null : Guid.TryParse(request.CityId, out var cid) ? cid : user.CityId;

        await _users.UpdateAsync(user, ct);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Mobile,
            user.Name,
            user.Gender,
            user.Dob,
            user.CityId,
            user.Role,
            user.EmailVerified,
            user.ProfilePicUrl,
            user.StateCode,
        });
    }

    /// <summary>Change the authenticated user's password.</summary>
    [HttpPatch("me/password")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _users.GetByIdAsync(userId, ct);
        if (user == null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect." });

        if (request.NewPassword.Length < 8)
            return BadRequest(new { message = "New password must be at least 8 characters." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, workFactor: 12);
        await _users.UpdateAsync(user, ct);

        return Ok(new { message = "Password updated successfully." });
    }
}

public record UpdateProfileRequest(string? Name, string? Mobile, string? Gender, string? CityId);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
