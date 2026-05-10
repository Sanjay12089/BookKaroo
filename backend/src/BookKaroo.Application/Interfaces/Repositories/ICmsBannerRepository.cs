using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Repositories;

public interface ICmsBannerRepository : IRepository<CmsBanner>
{
    Task<IEnumerable<CmsBanner>> GetActiveAsync(CancellationToken ct = default);
}
