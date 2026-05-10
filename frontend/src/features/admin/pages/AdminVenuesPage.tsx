import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';
import type { Venue, PaginatedResponse } from '@/shared/types';

type ApiError = { response?: { status?: number }; statusCode?: number };

export default function AdminVenuesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'venues'],
    queryFn: () =>
      api.get<PaginatedResponse<Venue>>('/api/venues').then((r) => r.data),
    retry: false,
  });

  const is501 =
    (error as ApiError | null)?.response?.status === 501 ||
    (error as ApiError | null)?.statusCode === 501;

  const venues: Venue[] = Array.isArray(data)
    ? (data as Venue[])
    : ((data as PaginatedResponse<Venue> | undefined)?.items ?? []);

  const showEmpty = is501 || (!isLoading && !error && venues.length === 0);
  const showError = !isLoading && !!error && !is501;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Venues</h1>
            <p className="text-text-muted text-sm font-sans">Manage theatres, stadiums, and event venues.</p>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            + Add Venue
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64 text-text-muted text-sm font-sans">
            Loading venues…
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-4xl">📍</p>
            <p className="text-text-secondary font-sans text-base">No venues found. Add your first venue.</p>
            <button
              disabled
              className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              + Add Venue
            </button>
          </div>
        )}

        {showError && (
          <div className="flex items-center justify-center h-64 text-semantic-error text-sm font-sans">
            Failed to load venues. Please try again.
          </div>
        )}

        {!isLoading && !showEmpty && !showError && venues.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full text-sm font-sans">
              <thead className="bg-bg-surface2 border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">City</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Chain</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Amenities</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue) => (
                  <tr key={venue.id} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-text-primary">{venue.name}</span>
                      <p className="text-xs text-text-muted mt-0.5 truncate max-w-[200px]">{venue.address}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{venue.cityId}</td>
                    <td className="px-4 py-3 text-text-secondary">{venue.chain ?? '—'}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs truncate max-w-[160px]">
                      {venue.amenities ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          venue.isActive
                            ? 'bg-semantic-success/15 text-semantic-success'
                            : 'bg-bg-surface3 text-text-muted'
                        }`}
                      >
                        {venue.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button disabled className="text-xs text-accent-indigo opacity-40 cursor-not-allowed font-semibold">Edit</button>
                        <button disabled className="text-xs text-semantic-error opacity-40 cursor-not-allowed font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
