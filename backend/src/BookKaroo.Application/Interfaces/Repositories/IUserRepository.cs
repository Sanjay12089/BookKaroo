using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> FindByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> FindByMobileAsync(string mobile, CancellationToken ct = default);
    Task<User?> FindByRefreshTokenAsync(string refreshToken, CancellationToken ct = default);
}
