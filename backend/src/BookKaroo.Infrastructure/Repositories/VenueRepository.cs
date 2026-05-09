using BookKaroo.Domain.Entities;
using BookKaroo.Infrastructure.Data;

namespace BookKaroo.Infrastructure.Repositories;

public class VenueRepository : Repository<Venue>
{
    public VenueRepository(BookKarooDbContext db) : base(db) { }
}
