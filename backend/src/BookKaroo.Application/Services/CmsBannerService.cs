using BookKaroo.Application.DTOs.Home;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;

namespace BookKaroo.Application.Services;

public class CmsBannerService : ICmsBannerService
{
    private readonly ICmsBannerRepository _banners;

    public CmsBannerService(ICmsBannerRepository banners)
    {
        _banners = banners;
    }

    public async Task<IReadOnlyList<BannerResponse>> GetActiveAsync(CancellationToken ct = default)
    {
        var banners = await _banners.GetActiveAsync(ct);
        return banners
            .Select(b => new BannerResponse(b.Id, b.Title, b.ImageUrl, b.LinkUrl, b.Position))
            .ToList();
    }
}
