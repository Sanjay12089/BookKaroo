import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';
import type { Show, PaginatedResponse, ShowStatus } from '@/shared/types';

type ApiError = { response?: { status?: number }; statusCode?: number };

const STATUS_BADGE: Record<ShowStatus, string> = {
  Scheduled: 'bg-semantic-success/15 text-semantic-success',
  Cancelled: 'bg-bg-surface3 text-text-muted',
  Completed: 'bg-accent-indigo/12 text-[#A5B4FC]',
};

export default function AdminShowsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'shows'],
    queryFn: () =>
      api.get<PaginatedResponse<Show>>('/api/shows').then((r) => r.data),
    retry: false,
  });

  const is501 =
    (error as ApiError | null)?.response?.status === 501 ||
    (error as ApiError | null)?.statusCode === 501;

  const shows: Show[] = Array.isArray(data)
    ? (data as Show[])
    : ((data as PaginatedResponse<Show> | undefined)?.items ?? []);

  const showEmpty = is501 || (!isLoading && !error && shows.length === 0);
  const showError = !isLoading && !!error && !is501;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Shows</h1>
            <p className="text-text-muted text-sm font-sans">Schedule and manage show slots across venues.</p>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            + Add Show
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64 text-text-muted text-sm font-sans">
            Loading shows…
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-4xl">🎬</p>
            <p className="text-text-secondary font-sans text-base">No shows scheduled yet. Add your first show.</p>
            <button
              disabled
              className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              + Add Show
            </button>
          </div>
        )}

        {showError && (
          <div className="flex items-center justify-center h-64 text-semantic-error text-sm font-sans">
            Failed to load shows. Please try again.
          </div>
        )}

        {!isLoading && !showEmpty && !showError && shows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full text-sm font-sans">
              <thead className="bg-bg-surface2 border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Movie / Event</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Venue</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Screen</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Format</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Language</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show.id} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs">
                      {show.movieId ?? show.eventId ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs">{show.venueId}</td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs">{show.screenId}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(show.showDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{show.showTime}</td>
                    <td className="px-4 py-3 text-text-secondary">{show.format ?? '—'}</td>
                    <td className="px-4 py-3 text-text-secondary">{show.language ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_BADGE[show.status]}`}>
                        {show.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button disabled className="text-xs text-accent-indigo opacity-40 cursor-not-allowed font-semibold">Edit</button>
                        <button disabled className="text-xs text-semantic-error opacity-40 cursor-not-allowed font-semibold">Cancel</button>
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
