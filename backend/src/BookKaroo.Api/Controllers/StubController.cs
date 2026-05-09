using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

// ─── All endpoints below are stubs ───────────────────────────────────────────
// They return 501 and will be fully implemented in subsequent sprints.
// Each controller is in its own [Route] group to produce correct Swagger tags.

[ApiController]
[Route("api/movies")]
[Produces("application/json")]
public class MoviesController : ControllerBase
{
    [HttpGet] public IActionResult GetAll() => Stub();
    [HttpGet("{slug}")] public IActionResult GetDetail(string slug) => Stub();
    [HttpGet("{slug}/showtimes")] public IActionResult GetShowtimes(string slug) => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/events")]
[Produces("application/json")]
public class EventsController : ControllerBase
{
    [HttpGet] public IActionResult GetAll() => Stub();
    [HttpGet("{slug}")] public IActionResult GetDetail(string slug) => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/venues")]
[Produces("application/json")]
public class VenuesController : ControllerBase
{
    [HttpGet] public IActionResult GetAll() => Stub();
    [HttpGet("{id:guid}")] public IActionResult GetById(Guid id) => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/shows")]
[Produces("application/json")]
public class ShowsController : ControllerBase
{
    [HttpGet("{showId:guid}/seats")] public IActionResult GetSeats(Guid showId) => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/payments")]
[Produces("application/json")]
public class PaymentsController : ControllerBase
{
    [HttpPost("order")] public IActionResult CreateOrder() => Stub();
    [HttpPost("mock-capture")] public IActionResult MockCapture() => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/bookings")]
[Produces("application/json")]
public class BookingsController : ControllerBase
{
    [HttpPost] public IActionResult Create() => Stub();
    [HttpGet] public IActionResult GetByUser() => Stub();
    [HttpGet("{ref}")] public IActionResult GetByRef(string @ref) => Stub();
    [HttpPost("{ref}/cancel")] public IActionResult Cancel(string @ref) => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/coupons")]
[Produces("application/json")]
public class CouponsController : ControllerBase
{
    [HttpPost("validate")] public IActionResult Validate() => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/search")]
[Produces("application/json")]
public class SearchController : ControllerBase
{
    [HttpGet] public IActionResult Search() => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}

[ApiController]
[Route("api/admin")]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    [HttpGet("dashboard")] public IActionResult Dashboard() => Stub();
    [HttpGet("reports")] public IActionResult Reports() => Stub();
    private IActionResult Stub() => StatusCode(501, new { message = "Coming in next sprint", endpoint = Request.Path.Value });
}
