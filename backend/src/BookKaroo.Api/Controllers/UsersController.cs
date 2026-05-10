using System.Security.Claims;
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
}

public record UpdateProfileRequest(string? Name, string? Mobile, string? Gender, string? CityId);
