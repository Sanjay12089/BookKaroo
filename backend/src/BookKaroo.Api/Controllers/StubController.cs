using BookKaroo.Application.DTOs.Movies;
using BookKaroo.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

// ─── Movies — fully implemented ───────────────────────────────────────────────

[ApiController]
[Route("api/movies")]
[Produces("application/json")]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movies;
    public MoviesController(IMovieService movies) => _movies = movies;

    /// <summary>List movies with optional filters and pagination.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(MovieListPagedResponse), 200)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? language,
        [FromQuery] string? genre,
        [FromQuery] string? format,
        [FromQuery] string? category,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var filter = new MovieFilterRequest(language, genre, format, category, sort,
            Math.Clamp(page, 1, int.MaxValue),
            Math.Clamp(pageSize, 1, 100));
        return Ok(await _movies.GetListAsync(filter, ct));
    }

    /// <summary>Get movie detail by slug.</summary>
    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(MovieListResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetDetail(string slug, CancellationToken ct) =>
        Ok(await _movies.GetDetailAsync(slug, ct));

    /// <summary>Get showtimes for a movie, grouped by venue.</summary>
    [HttpGet("{slug}/showtimes")]
    [ProducesResponseType(typeof(ShowtimesResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetShowtimes(string slug, [FromQuery] string? date, CancellationToken ct) =>
        Ok(await _movies.GetShowtimesAsync(slug, date, ct));
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
