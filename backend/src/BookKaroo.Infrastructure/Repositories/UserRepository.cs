using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Domain.Entities;
using BookKaroo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookKaroo.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(BookKarooDbContext db) : base(db) { }

    public async Task<User?> FindByEmailAsync(string email, CancellationToken ct = default) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

    public async Task<User?> FindByMobileAsync(string mobile, CancellationToken ct = default) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Mobile == mobile, ct);

    public async Task<User?> FindByRefreshTokenAsync(string refreshToken, CancellationToken ct = default)
    {
        // Refresh tokens are stored as BCrypt hashes; we must verify in memory.
        var candidates = await _db.Users
            .Where(u => u.RefreshToken != null && u.RefreshTokenExpiresAt > DateTime.UtcNow)
            .ToListAsync(ct);

        return candidates.FirstOrDefault(u =>
            u.RefreshToken != null && BCrypt.Net.BCrypt.Verify(refreshToken, u.RefreshToken));
    }
}
