import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { PartnerLayout } from '../components/PartnerLayout';
import { usePartnerShows, useCancelPartnerShow, usePartnerVenues } from '../api/usePartner';
import { AdminTable, type Column } from '@/features/admin/components/AdminTable';
import type { PartnerShowResponse } from '../types';

const STATUS_CLASSES: Record<string, string> = {
  Scheduled:  'bg-semantic-success/15 text-semantic-success',
  Cancelled:  'bg-accent-crimson/15 text-accent-crimson',
  Completed:  'bg-bg-surface3 text-text-muted',
};

const today = () => new Date().toISOString().split('T')[0];
const sevenDaysAhead = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

export default function PartnerShowsPage() {
  const [venueId,  setVenueId]  = useState('');
  const [status,   setStatus]   = useState('');
  const [fromDate, setFromDate] = useState(today());
  const [toDate,   setToDate]   = useState(sevenDaysAhead());
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [debouncedSearch, setDebounced] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const { data: venues } = usePartnerVenues();
  const { data, isLoading } = usePartnerShows({
    venueId:  venueId  || undefined,
    status:   status   || undefined,
    fromDate: fromDate || undefined,
    toDate:   toDate   || undefined,
    page,
    pageSize: 15,
  });
  const cancelShow = useCancelPartnerShow();

  const shows = data?.items ?? [];
  const filteredShows = debouncedSearch
    ? shows.filter((s) =>
        s.movieTitle?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.eventTitle?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.venueName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.screenName.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : shows;

  const columns: Column<PartnerShowResponse>[] = [
    {
      key: 'show', header: 'Title',
      render: (s) => (
        <div>
          <p className="text-[13px] font-semibold text-text-primary line-clamp-1">
            {s.movieTitle ?? s.eventTitle ?? '—'}
          </p>
          <p className="text-[11px] text-text-muted">{s.format}{s.language ? ` · ${s.language}` : ''}</p>
        </div>
      ),
    },
    {
      key: 'venue', header: 'Venue / Screen',
      render: (s) => (
        <div>
          <p className="text-[13px] text-text-primary">{s.venueName}</p>
          <p className="text-[11px] text-text-muted">{s.screenName}</p>
        </div>
      ),
    },
    {
      key: 'datetime', header: 'Date & Time',
      render: (s) => (
        <div>
          <p className="text-[13px] text-text-primary">{s.showDate}</p>
          <p className="text-[11px] text-text-muted">{s.showTime}</p>
        </div>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (s) => (
        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${STATUS_CLASSES[s.status] ?? 'bg-bg-surface2 text-text-muted'}`}>
          {s.status}
        </span>
      ),
    },
    {
      key: 'actions', header: 'Actions',
      render: (s) => (
        s.status === 'Scheduled' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Cancel this show? This cannot be undone.')) {
                cancelShow.mutate(s.id);
              }
            }}
            disabled={cancelShow.isPending}
            className="px-2 py-1 rounded-lg border border-semantic-error/40 text-semantic-error text-[11px] hover:bg-semantic-error/08 transition-colors disabled:opacity-50"
          >
            Cancel Show
          </button>
        ) : (
          <span className="text-[11px] text-text-muted">—</span>
        )
      ),
    },
  ];

  return (
    <PartnerLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-5">
        <header>
          <h1 className="text-2xl font-display font-bold text-text-primary">Shows</h1>
          <p className="text-sm text-text-secondary mt-1">View and manage shows for your venues.</p>
        </header>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, venue, screen…"
                className="w-full pl-8 pr-8 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  <X size={12} />
                </button>
              )}
            </div>

            <select
              value={venueId}
              onChange={(e) => { setVenueId(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo [color-scheme:dark]"
            >
              <option value="">All Venues</option>
              {venues?.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>

            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo [color-scheme:dark]"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-muted whitespace-nowrap">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                className="px-2 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo [color-scheme:dark]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-muted whitespace-nowrap">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                className="px-2 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={filteredShows}
          isLoading={isLoading}
          emptyMessage="No shows found for the selected filters."
        />

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-text-muted">{data.total} shows</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded-lg border border-border-default text-sm text-text-secondary disabled:opacity-40">← Prev</button>
              <span className="px-3 py-1 text-sm text-text-primary">Page {page} / {data.totalPages}</span>
              <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-lg border border-border-default text-sm text-text-secondary disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}
