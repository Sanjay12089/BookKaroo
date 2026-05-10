using BookKaroo.Application.DTOs.Home;
using BookKaroo.Application.DTOs.Movies;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

[ApiController]
[Route("api/home")]
[Produces("application/json")]
public class HomeController : ControllerBase
{
    private readonly IMovieService     _movies;
    private readonly IEventService     _events;
    private readonly ICmsBannerService _banners;

    public HomeController(
        IMovieService     movies,
        IEventService     events,
        ICmsBannerService banners)
    {
        _movies  = movies;
        _events  = events;
        _banners = banners;
    }

    /// <summary>Aggregated home page data — all sections in one request.</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetHome([FromQuery] Guid? cityId, CancellationToken ct)
    {
        var nowShowingFilter = new MovieFilterRequest(
            Category: "NowShowing", CityId: cityId, Page: 1, PageSize: 10);
        var comingSoonFilter = new MovieFilterRequest(
            Category: "ComingSoon", Page: 1, PageSize: 8);

        var t1 = _movies.GetListAsync(nowShowingFilter, ct);
        var t2 = _movies.GetListAsync(comingSoonFilter, ct);
        var t3 = _events.GetByTypeAsync(EventType.LiveEvent, cityId, 6, ct);
        var t4 = _events.GetByTypeAsync(EventType.Play,      cityId, 4, ct);
        var t5 = _events.GetByTypeAsync(EventType.Comedy,    cityId, 4, ct);
        var t6 = _events.GetByTypeAsync(EventType.Ipl,       null,   5, ct);
        var t7 = _banners.GetActiveAsync(ct);

        await Task.WhenAll(t1, t2, t3, t4, t5, t6, t7);

        return Ok(new HomeResponse(
            t1.Result.Items.ToList(),
            t2.Result.Items.ToList(),
            t3.Result,
            t4.Result,
            t5.Result,
            t6.Result,
            t7.Result));
    }
}
