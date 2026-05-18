import { useState } from 'react';
import { AlertTriangle, X, Search } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { AdminTable, type Column } from '../components/AdminTable';
import { Modal } from '@/shared/components/ui/Modal';
import { useAdminShows, useCancelShow, useDeleteShow, useAdminVenuesList } from '../api/useAdmin';
import { ShowFormModal } from '../components/ShowFormModal';
import type { AdminShow, AdminShowFilters } from '../types';

const STATUS_TABS = ['All', 'Scheduled', 'Cancelled', 'Completed'] as const;
type StatusTab = typeof STATUS_TABS[number];

function formatIndian(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function AdminShowsPage() {
  const today30  = new Date(); today30.setDate(today30.getDate() + 30);
  const todayStr  = new Date().toISOString().split('T')[0];
  const in30Str   = today30.toISOString().split('T')[0];

  const [page, setPage]             = useState(1);
  const [statusTab, setStatusTab]   = useState<StatusTab>('Scheduled');
  const [fromDate, setFromDate]     = useState(todayStr);
  const [toDate, setToDate]         = useState(in30Str);
  const [venueId, setVenueId]       = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [cancellingShow, setCancellingShow] = useState<AdminShow | null>(null);

  const filters: AdminShowFilters = {
    status:   statusTab === 'All' ? undefined : statusTab,
    fromDate: fromDate || undefined,
    toDate:   toDate   || undefined,
    venueId:  venueId  || undefined,
  };

  const [search, setSearch] = useState('');

  const { data, isLoading } = useAdminShows(filters, page);
  const cancelShow  = useCancelShow();
  const deleteShow  = useDeleteShow();
  const { data: venuesList } = useAdminVenuesList();

  const allShows = data?.items ?? [];
  const shows = search.trim()
    ? allShows.filter((s) => {
        const q = search.toLowerCase();
        return (s.movieTitle ?? '').toLowerCase().includes(q)
          || (s.eventTitle ?? '').toLowerCase().includes(q)
          || s.venueName.toLowerCase().includes(q)
          || (s.format ?? '').toLowerCase().includes(q)
          || (s.language ?? '').toLowerCase().includes(q);
      })
    : allShows;

  const isDefaultFilter = statusTab === 'Scheduled' && fromDate === todayStr && toDate === in30Str && !venueId && !search;

  const columns: Column<AdminShow>[] = [
    {
      key: 'title', header: 'Movie / Event', width: '200px',
      render: (s) => (
        <div className="flex items-center gap-2">
          {s.moviePosterUrl && (
            <img src={s.moviePosterUrl.startsWith('http') ? s.moviePosterUrl : `https://image.tmdb.org/t/p/w92${s.moviePosterUrl}`}
              alt="" className="w-8 h-12 object-cover rounded-sm flex-shrink-0" />
          )}
          <span className="font-medium text-tx-primary text-[13px] line-clamp-2">
            {s.movieTitle ?? s.eventTitle ?? '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'venue', header: 'Venue & Screen',
      render: (s) => (
        <div>
          <p className="text-[13px] font-medium text-tx-primary line-clamp-1">{s.venueName}</p>
          <p className="text-[11px] text-tx-muted">{s.screenName}</p>
          <p className="text-[11px] text-tx-muted">{s.cityName}</p>
        </div>
      ),
    },
    {
      key: 'datetime', header: 'Date & Time',
      render: (s) => {
        const isPast   = new Date(s.showDatetime) < new Date();
        const isToday  = s.showDate === todayStr;
        return (
          <div>
            <div className="flex items-center gap-1">
              <p className={`text-[13px] font-medium ${isPast ? 'text-tx-muted' : 'text-tx-primary'}`}>{s.showDateLabel}</p>
              {isToday && <span className="text-[9px] px-1 py-0.5 rounded bg-warning-bg/20 text-warning font-bold uppercase">Today</span>}
            </div>
            <p className="text-[11px] text-tx-muted">{s.showTimeLabel}</p>
          </div>
        );
      },
    },
    {
      key: 'format', header: 'Format / Lang',
      render: (s) => (
        <div>
          <span className="inline-block text-[11px] px-1.5 py-0.5 rounded bg-brand/15 text-brand font-semibold">{s.format}</span>
          <p className="text-[11px] text-tx-muted mt-0.5">{s.language}</p>
        </div>
      ),
    },
    {
      key: 'occupancy', header: 'Occupancy',
      render: (s) => {
        const pct = s.occupancyPercent;
        const barColor = pct >= 80 ? 'bg-brand' : pct >= 50 ? 'bg-warning-bg' : 'bg-success-bg';
        return (
          <div className="w-24">
            <p className="text-[13px] text-tx-primary mb-1">{s.bookedSeats}/{s.totalSeats}</p>
            <div className="h-1.5 rounded-full bg-section overflow-hidden">
              <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            <p className="text-[11px] text-tx-muted mt-0.5">{pct.toFixed(0)}%</p>
          </div>
        );
      },
    },
    {
      key: 'revenue', header: 'Revenue',
      render: (s) => <span className="text-[13px] text-tx-primary">{formatIndian(s.revenueGenerated)}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (s) => {
        const classes: Record<AdminShow['status'], string> = {
          Scheduled: 'bg-success-bg/15 text-success',
          Cancelled: 'bg-brand/15 text-brand',
          Completed: 'bg-brand/15 text-brand',
        };
        return (
          <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${classes[s.status]}`}>
            {s.status}
          </span>
        );
      },
    },
    {
      key: 'actions', header: 'Actions',
      render: (s) => {
        const isUpcoming = s.status === 'Scheduled' && new Date(s.showDatetime) > new Date();
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {isUpcoming && (
              <button
                onClick={() => setCancellingShow(s)}
                className="px-2 py-1 rounded-lg border border-brand text-brand text-[11px] font-semibold hover:bg-brand/10 transition-colors"
              >
                Cancel
              </button>
            )}
            {s.bookedSeats === 0 && (
              <button
                onClick={() => deleteShow.mutate(s.showId)}
                className="px-2 py-1 rounded-lg border border-border-l text-tx-muted text-[11px] hover:border-error hover:text-error transition-colors"
              >
                Del
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // Summary strip
  const summaryItems = [
    { label: 'Total Shows',   value: data?.total ?? 0 },
    { label: 'Scheduled',     value: shows.filter((s) => s.status === 'Scheduled').length },
    { label: 'Avg Occupancy', value: shows.length ? `${(shows.reduce((a, b) => a + b.occupancyPercent, 0) / shows.length).toFixed(0)}%` : '—' },
    { label: 'Total Revenue', value: formatIndian(shows.reduce((a, b) => a + b.revenueGenerated, 0)) },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Shows</h1>
            <p className="text-tx-muted text-sm font-sans">Schedule and manage show slots across venues.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            + Create Show
          </button>
        </div>

        {/* Filter bar */}
        <div className="space-y-3 mb-4">
          {/* Status tabs — underline style */}
          <div className="flex border-b border-border-l">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setStatusTab(tab); setPage(1); }}
                className={`relative px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                  statusTab === tab
                    ? 'text-brand'
                    : 'text-tx-muted hover:text-tx-secondary'
                }`}
              >
                {tab}
                {statusTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Search + Date range + Venue */}
          <div className="flex flex-wrap gap-3">
            {/* General search */}
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movie, event, venue, format…"
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-section border border-border-l text-tx-primary text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-tx-muted whitespace-nowrap">From</label>
              <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="px-2 py-2 rounded-lg bg-section border border-border-l text-tx-primary text-sm focus:outline-none focus:border-brand" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-tx-muted whitespace-nowrap">To</label>
              <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="px-2 py-2 rounded-lg bg-section border border-border-l text-tx-primary text-sm focus:outline-none focus:border-brand" />
            </div>
            {/* Venue filter */}
            <select
              value={venueId}
              onChange={(e) => { setVenueId(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-section border border-border-l text-tx-primary text-sm focus:outline-none focus:border-brand"
            >
              <option value="">All Venues</option>
              {venuesList?.map((v) => (
                <option key={v.id} value={v.id}>{v.name} ({v.cityName})</option>
              ))}
            </select>
            {!isDefaultFilter && (
              <button
                onClick={() => { setStatusTab('Scheduled'); setFromDate(todayStr); setToDate(in30Str); setVenueId(''); setSearch(''); setPage(1); }}
                className="text-sm text-brand hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {summaryItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-border-l bg-card p-3">
              <p className="text-[11px] text-tx-muted uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-lg font-bold text-tx-primary font-display">{isLoading ? '…' : item.value}</p>
            </div>
          ))}
        </div>

        <AdminTable
          columns={columns}
          data={shows}
          isLoading={isLoading}
          emptyMessage="No shows found for the selected filters."
        />

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-tx-muted">{data.total} shows</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded-lg border border-border-l text-sm text-tx-secondary disabled:opacity-40">← Prev</button>
              <span className="px-3 py-1 text-sm text-tx-primary">Page {page} / {data.totalPages}</span>
              <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-lg border border-border-l text-sm text-tx-secondary disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <ShowFormModal onClose={() => setShowCreate(false)} onSuccess={() => setShowCreate(false)} />
      )}

      {cancellingShow && (
        <CancelShowModal
          show={cancellingShow}
          isLoading={cancelShow.isPending}
          onClose={() => setCancellingShow(null)}
          onConfirm={() => cancelShow.mutate(cancellingShow.showId, { onSuccess: () => setCancellingShow(null) })}
        />
      )}
    </AdminLayout>
  );
}

interface CancelModalProps {
  show:      AdminShow;
  isLoading: boolean;
  onClose:   () => void;
  onConfirm: () => void;
}

function CancelShowModal({ show, isLoading, onClose, onConfirm }: CancelModalProps) {
  return (
    <Modal open onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle size={20} />
          <h3 className="font-display font-bold text-lg">Cancel Show?</h3>
        </div>

        <div>
          <p className="font-semibold text-tx-primary text-[15px]">{show.movieTitle ?? show.eventTitle}</p>
          <p className="text-tx-muted text-sm mt-0.5">{show.showDateLabel} · {show.showTimeLabel} · {show.venueName}</p>
        </div>

        {show.bookedSeats > 0 ? (
          <div className="rounded-lg border border-warning/30 bg-warning-bg/10 p-3 space-y-1">
            <p className="text-sm font-medium text-warning">
              ⚠️ This will cancel {show.bookedSeats} confirmed booking(s)
            </p>
            <p className="text-xs text-tx-muted">Customers will be notified by email</p>
            <p className="text-xs text-tx-muted">Refunds will be processed automatically</p>
          </div>
        ) : (
          <p className="text-sm text-tx-muted">No active bookings for this show.</p>
        )}

        <div className="flex flex-col gap-2">
          <button onClick={onClose} className="w-full px-4 py-2 rounded-lg border border-border-l text-tx-secondary hover:bg-section transition-colors text-sm">
            Keep Show
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold disabled:opacity-60 hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Cancelling…' : 'Cancel Show'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
