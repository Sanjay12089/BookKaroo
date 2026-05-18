import { useState, useCallback } from 'react';
import { Pencil, Trash2, Search, X } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { cn } from '@/shared/lib/utils';
import { AdminTable, type Column } from '../components/AdminTable';
import { EventFormModal } from '../components/EventFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useAdminEvents, useAdminEvent, useDeleteEvent } from '../api/useAdmin';
import type { AdminEventResponse, AdminEventFilters, AdminEventDetailResponse } from '../types';

const STATUS_STYLE: Record<string, string> = {
  Draft:     'bg-section text-tx-muted',
  Published: 'bg-success-bg/15 text-success',
  Archived:  'bg-section text-tx-muted border border-border-l',
};
const TYPE_STYLE: Record<string, string> = {
  LiveEvent: 'bg-brand/12 text-brand',
  Play:      'bg-brand-dark/12 text-brand-dark',
  Sport:     'bg-blue-500/12 text-blue-400',
  Activity:  'bg-brand/12 text-[#A5B4FC]',
  Comedy:    'bg-amber-400/12 text-amber-400',
  Ipl:       'bg-cyan-500/12 text-cyan-400',
};
const TYPE_LABEL: Record<string, string> = {
  LiveEvent: 'Live Event', Play: 'Play', Sport: 'Sport',
  Activity: 'Activity', Comedy: 'Comedy', Ipl: 'IPL',
};
const TYPE_TABS   = ['All', 'LiveEvent', 'Play', 'Sport', 'Activity', 'Comedy', 'Ipl'];
const STATUS_TABS = ['All', 'Draft', 'Published', 'Archived'];

function useDebouncedUpdate(delay: number) {
  const [debounced, setDebounced] = useState('');
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const update = useCallback((v: string) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => setDebounced(v), delay));
  }, [delay, timer]);
  return [debounced, update] as const;
}

export default function AdminEventsPage() {
  const [search, setSearch]   = useState('');
  const [debouncedSearch, updateSearch] = useDebouncedUpdate(400);
  const [typeTab, setTypeTab]           = useState('All');
  const [statusTab, setStatusTab]       = useState('All');
  const [page, setPage]                 = useState(1);
  const [showCreate, setShowCreate]     = useState(false);
  const [editId, setEditId]             = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEventResponse | null>(null);

  const filters: AdminEventFilters = {
    search: debouncedSearch || undefined,
    type:   typeTab   !== 'All' ? typeTab   : undefined,
    status: statusTab !== 'All' ? statusTab : undefined,
  };

  const { data, isLoading }           = useAdminEvents(filters, page);
  const { data: editEvent, isLoading: editLoading } = useAdminEvent(editId);
  const deleteMutation                = useDeleteEvent();

  const events     = data?.items     ?? [];
  const total      = data?.total     ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const columns: Column<AdminEventResponse>[] = [
    {
      key: 'event', header: 'Event',
      render: (e) => (
        <div>
          <p className="font-medium text-tx-primary leading-tight">{e.title}</p>
          <span className={cn('inline-flex mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold',
            TYPE_STYLE[e.type] ?? 'bg-section text-tx-muted')}>
            {TYPE_LABEL[e.type] ?? e.type}
          </span>
        </div>
      ),
    },
    {
      key: 'date', header: 'Date', width: '160px',
      render: (e) => <span className="text-tx-secondary text-xs">{e.eventDateLabel}</span>,
    },
    {
      key: 'venue', header: 'Venue', width: '160px',
      render: (e) => <span className="text-tx-secondary text-xs line-clamp-1">{e.venueName}</span>,
    },
    {
      key: 'price', header: 'From', width: '90px',
      render: (e) => (
        <span className="text-tx-primary font-semibold text-xs">
          {e.lowestPrice > 0 ? `₹${e.lowestPrice.toLocaleString('en-IN')}` : '—'}
        </span>
      ),
    },
    {
      key: 'status', header: 'Status', width: '100px',
      render: (e) => (
        <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold',
          STATUS_STYLE[e.status] ?? 'bg-section text-tx-muted')}>
          {e.status}
        </span>
      ),
    },
    {
      key: 'actions', header: 'Actions', width: '90px',
      render: (e) => (
        <div className="flex items-center gap-2" onClick={(ev) => ev.stopPropagation()}>
          <button onClick={() => setEditId(e.id)} title="Edit"
            className="text-brand hover:opacity-70 transition-opacity">
            <Pencil size={14} />
          </button>
          <button onClick={() => setDeleteTarget(e)} title="Delete"
            className="text-error hover:opacity-70 transition-opacity">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-tx-primary">Events</h1>
            <p className="text-tx-muted text-sm font-sans">
              {total > 0 ? `${total} events in catalogue` : 'Manage live events, plays, sports and activities'}
            </p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-full bg-brand text-white text-sm font-semibold font-sans hover:opacity-90 transition-opacity">
            + Add Event
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted pointer-events-none" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); updateSearch(e.target.value); setPage(1); }}
              placeholder="Search events…"
              className="pl-8 pr-8 py-2 rounded-lg bg-card border border-border-l text-sm font-sans text-tx-primary focus:outline-none focus:border-brand w-52"
            />
            {search && (
              <button onClick={() => { setSearch(''); updateSearch(''); setPage(1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-tx-muted hover:text-tx-primary">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-tx-muted uppercase tracking-wider whitespace-nowrap font-sans">
              Type
            </label>
            <select
              value={typeTab}
              onChange={(e) => { setTypeTab(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-card border border-border-l text-sm font-sans text-tx-primary focus:outline-none focus:border-brand cursor-pointer [color-scheme:dark]"
            >
              {TYPE_TABS.map((t) => (
                <option key={t} value={t}>{TYPE_LABEL[t] ?? t}</option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-tx-muted uppercase tracking-wider whitespace-nowrap font-sans">
              Status
            </label>
            <select
              value={statusTab}
              onChange={(e) => { setStatusTab(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-card border border-border-l text-sm font-sans text-tx-primary focus:outline-none focus:border-brand cursor-pointer [color-scheme:dark]"
            >
              {STATUS_TABS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {(typeTab !== 'All' || statusTab !== 'All' || search) && (
            <button
              onClick={() => { setTypeTab('All'); setStatusTab('All'); setSearch(''); updateSearch(''); setPage(1); }}
              className="text-xs text-brand font-semibold font-sans hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <AdminTable columns={columns} data={events} isLoading={isLoading} emptyMessage="No events found." />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm font-sans">
            <span className="text-tx-muted">Page {page} of {totalPages} · {total} total</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-border-l text-tx-secondary hover:bg-section disabled:opacity-40 transition-colors">
                Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-border-l text-tx-secondary hover:bg-section disabled:opacity-40 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <EventFormModal mode="create" onClose={() => setShowCreate(false)} onSuccess={() => setPage(1)} />
      )}

      {editId && !editLoading && editEvent && (
        <EventFormModal mode="edit" event={editEvent as AdminEventDetailResponse}
          onClose={() => setEditId(null)} onSuccess={() => setPage(1)} />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          itemName={deleteTarget.title}
          isLoading={deleteMutation.isPending}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </AdminLayout>
  );
}
