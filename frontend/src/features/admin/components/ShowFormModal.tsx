import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useCreateShow, useAdminVenueDetail } from '../api/useAdmin';
import type { AdminVenue } from '../types';

const FORMATS   = ['2D', '3D', 'IMAX', 'IMAX-3D', '4DX', 'Dolby Cinema', 'EPIQ', 'MX4D'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati'];

interface Movie { id: string; title: string; posterUrl?: string; certificate?: string; }
interface Event { id: string; title: string; type: string; eventDateLabel?: string; }

interface Props {
  onClose:           () => void;
  onSuccess:         () => void;
  prefilledVenueId?: string;
}

export function ShowFormModal({ onClose, onSuccess, prefilledVenueId }: Props) {
  const createShow = useCreateShow();

  const [type, setType]           = useState<'movie' | 'event'>('movie');
  const [movieSearch, setMovieSearch] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [venueId, setVenueId]     = useState(prefilledVenueId ?? '');
  const [screenId, setScreenId]   = useState('');
  const [showDate, setShowDate]   = useState('');
  const [showTime, setShowTime]   = useState('');
  const [format, setFormat]       = useState('2D');
  const [language, setLanguage]   = useState('Hindi');
  const [conflict, setConflict]   = useState<'checking' | 'clear' | 'conflict' | null>(null);

  const debouncedSearch = useDebounce(movieSearch, 400);
  const today = new Date().toISOString().split('T')[0];

  const { data: movies } = useQuery<{ items: Movie[] }>({
    queryKey: ['admin-movie-search', debouncedSearch],
    queryFn: () =>
      api.get('/api/movies', { params: { status: 'Published', pageSize: 30, q: debouncedSearch } }).then((r) => r.data),
    enabled: type === 'movie',
  });

  const { data: events } = useQuery<{ items: Event[] }>({
    queryKey: ['admin-events-published'],
    queryFn: () =>
      api.get('/api/events', { params: { status: 'Published', pageSize: 100 } }).then((r) => r.data),
    enabled: type === 'event',
  });

  const { data: venues } = useQuery<AdminVenue[]>({
    queryKey: ['admin-venues-all'],
    queryFn: () =>
      api.get('/api/admin/venues', { params: { pageSize: 100 } }).then((r) => (r.data as {items: AdminVenue[]}).items),
    staleTime: 2 * 60_000,
  });

  const { data: venueDetail } = useAdminVenueDetail(venueId || null);
  const screens = venueDetail?.screens ?? [];

  // Conflict check
  const { data: existingShows } = useQuery<{ items: Array<{ showTimeLabel: string; screenName: string }> }>({
    queryKey: ['admin-shows-conflict', screenId, showDate],
    queryFn: () =>
      api.get('/api/admin/shows', { params: { screenId, fromDate: showDate, toDate: showDate, pageSize: 50 } }).then((r) => r.data),
    enabled: !!(screenId && showDate),
  });

  useEffect(() => {
    if (!screenId || !showDate || !showTime) { setConflict(null); return; }
    setConflict('checking');
    const timer = setTimeout(() => {
      const norm = showTime.length === 5 ? showTime + ':00' : showTime;
      const d = new Date(`${showDate}T${norm}`);
      const timeLabel = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const hasConflict = existingShows?.items?.some((s) =>
        s.showTimeLabel?.replace(' ', '').toLowerCase() === timeLabel.replace(' ', '').toLowerCase()
      );
      setConflict(hasConflict ? 'conflict' : 'clear');
    }, 300);
    return () => clearTimeout(timer);
  }, [screenId, showDate, showTime, existingShows]);

  const canSubmit = (): boolean => {
    if (!screenId || !showDate || !showTime || !format || !language) return false;
    if (type === 'movie' && !selectedMovieId) return false;
    if (type === 'event' && !selectedEventId) return false;
    if (conflict === 'conflict') return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;
    await createShow.mutateAsync({
      screenId,
      movieId: type === 'movie' ? selectedMovieId : undefined,
      eventId: type === 'event' ? selectedEventId : undefined,
      showDate,
      showTime: showTime + ':00',
      format,
      language,
    });
    onSuccess();
    onClose();
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo';
  const selectCls = inputCls;

  return (
    <Modal open onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-xl text-text-primary">Create Show</h2>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors"><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Type toggle */}
        <div className="flex rounded-lg border border-border-default overflow-hidden">
          {(['movie', 'event'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${type === t ? 'bg-accent-indigo text-white' : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface3'}`}
            >
              {t === 'movie' ? '🎬 Movie' : '🎭 Event'}
            </button>
          ))}
        </div>

        {/* Movie / Event selector */}
        {type === 'movie' ? (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Movie *</label>
            <input value={movieSearch} onChange={(e) => setMovieSearch(e.target.value)} placeholder="Search movie…" className={inputCls + ' mb-2'} />
            <select value={selectedMovieId} onChange={(e) => setSelectedMovieId(e.target.value)} className={selectCls}>
              <option value="">— Select Movie —</option>
              {movies?.items?.map((m) => (
                <option key={m.id} value={m.id}>{m.title}{m.certificate ? ` [${m.certificate}]` : ''}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Event *</label>
            <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className={selectCls}>
              <option value="">— Select Event —</option>
              {events?.items?.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title} [{ev.type}]</option>
              ))}
            </select>
          </div>
        )}

        {/* Venue + Screen */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Venue *</label>
            <select
              value={venueId}
              onChange={(e) => { setVenueId(e.target.value); setScreenId(''); }}
              className={selectCls}
            >
              <option value="">— Select Venue —</option>
              {venues?.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.cityName})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Screen *</label>
            <select
              value={screenId}
              onChange={(e) => setScreenId(e.target.value)}
              disabled={!venueId}
              className={selectCls + (!venueId ? ' opacity-50 cursor-not-allowed' : '')}
            >
              <option value="">{venueId ? '— Select Screen —' : 'Select a venue first'}</option>
              {screens.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.totalSeats} seats)</option>)}
            </select>
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Date *</label>
            <input type="date" min={today} value={showDate} onChange={(e) => setShowDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Time *</label>
            <input
              type="time"
              step={1800}
              value={showTime}
              onChange={(e) => setShowTime(e.target.value)}
              className={inputCls + (conflict === 'conflict' ? ' border-semantic-error' : '')}
            />
          </div>
        </div>

        {/* Conflict indicator */}
        {conflict === 'conflict' && (
          <p className="text-xs text-semantic-error">⚠️ This screen already has a show at this time.</p>
        )}
        {conflict === 'clear' && (
          <p className="text-xs text-semantic-success">✅ No conflicts</p>
        )}

        {/* Format + Language */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Format *</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className={selectCls}>
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Language *</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2 sticky bottom-0 bg-bg-surface pb-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border-default text-text-secondary hover:bg-bg-surface2 transition-colors text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit() || createShow.isPending}
            className="flex-1 px-4 py-2 rounded-lg bg-accent-crimson text-white text-sm font-semibold disabled:opacity-60 hover:opacity-90 transition-opacity"
          >
            {createShow.isPending ? 'Creating…' : 'Create Show'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
