using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

// Placeholder controllers for endpoints implemented in later sprints.
// Each returns 501 so the frontend can show graceful empty states.

[ApiController]
[Route("api/venues")]
[Produces("application/json")]
public class VenuesController : ControllerBase
{
    [HttpGet] public IActionResult GetAll() => Stub();
    [HttpGet("{id:guid}")] public IActionResult GetById(Guid id) => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}
