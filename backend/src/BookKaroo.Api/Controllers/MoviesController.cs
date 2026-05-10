using BookKaroo.Application.DTOs.Movies;
using BookKaroo.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

[ApiController]
[Route("api/movies")]
[Produces("application/json")]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movies;

    public MoviesController(IMovieService movies) => _movies = movies;

    /// <summary>Get a paginated, filtered list of published movies.</summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(MovieListPagedResponse), 200)]
    public async Task<IActionResult> GetList([FromQuery] MovieFilterRequest filter, CancellationToken ct)
    {
        var result = await _movies.GetListAsync(filter, ct);
        return Ok(result);
    }

    /// <summary>Get movie detail by slug.</summary>
    [HttpGet("{slug}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(MovieListResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetDetail(string slug, CancellationToken ct)
    {
        var result = await _movies.GetDetailAsync(slug, ct);
        return Ok(result);
    }

    /// <summary>Get showtimes for a movie on a given date.</summary>
    [HttpGet("{slug}/showtimes")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ShowtimesResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetShowtimes(string slug, [FromQuery] string? date, CancellationToken ct)
    {
        var result = await _movies.GetShowtimesAsync(slug, date, ct);
        return Ok(result);
    }
}
