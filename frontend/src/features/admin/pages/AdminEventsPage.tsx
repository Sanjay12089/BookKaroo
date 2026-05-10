import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';
import type { Event, PaginatedResponse, MovieStatus, EventType } from '@/shared/types';

const STATUS_BADGE: Record<MovieStatus, string> = {
  Published: 'bg-semantic-success/15 text-semantic-success',
  Draft: 'bg-accent-indigo/12 text-[#A5B4FC]',
  Archived: 'bg-bg-surface3 text-text-muted',
};

const TYPE_LABEL: Record<EventType, string> = {
  LiveEvent: 'Live Event',
  Play: 'Play',
  Sport: 'Sport',
  Activity: 'Activity',
  Comedy: 'Comedy',
  Ipl: 'IPL',
};

type ApiError = { response?: { status?: number }; statusCode?: number };

export default function AdminEventsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: () =>
      api.get<PaginatedResponse<Event>>('/api/events').then((r) => r.data),
    retry: false,
  });

  const is501 =
    (error as ApiError | null)?.response?.status === 501 ||
    (error as ApiError | null)?.statusCode === 501;

  const events: Event[] = Array.isArray(data)
    ? (data as Event[])
    : ((data as PaginatedResponse<Event> | undefined)?.items ?? []);

  const showEmpty = is501 || (!isLoading && !error && events.length === 0);
  const showError = !isLoading && !!error && !is501;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Events</h1>
            <p className="text-text-muted text-sm font-sans">Manage live events, plays, sports, and activities.</p>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            + Add Event
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64 text-text-muted text-sm font-sans">
            Loading events…
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-4xl">🎭</p>
            <p className="text-text-secondary font-sans text-base">No events yet. Add your first event.</p>
            <button
              disabled
              className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              + Add Event
            </button>
          </div>
        )}

        {showError && (
          <div className="flex items-center justify-center h-64 text-semantic-error text-sm font-sans">
            Failed to load events. Please try again.
          </div>
        )}

        {!isLoading && !showEmpty && !showError && events.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full text-sm font-sans">
              <thead className="bg-bg-surface2 border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Language</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{ev.title}</td>
                    <td className="px-4 py-3 text-text-secondary">{TYPE_LABEL[ev.type]}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_BADGE[ev.status]}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{ev.durationMin} min</td>
                    <td className="px-4 py-3 text-text-secondary">{ev.language ?? '—'}</td>
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
