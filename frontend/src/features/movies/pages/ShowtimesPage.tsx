import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { Badge } from '@/shared/components/ui/Badge';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useMovieDetail, useShowtimes } from '../api/useMovies';
import { ROUTES, TMDB_POSTER } from '@/shared/constants';

// ── Date strip helpers ────────────────────────────────────────────────────────
function buildDates() {
  const base = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return {
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      day: d.getDate(),
      month: months[d.getMonth()],
      isoDate: d.toISOString().split('T')[0],
    };
  });
}

const DATES = buildDates();

// ── Availability colours ───────────────────────────────────────────────────────
type Avail = 'good' | 'fast' | 'low' | 'sold';
const AVAIL_COLORS: Record<Avail, string> = {
  good: '#10B981', fast: '#F59E0B', low: '#EF4444', sold: '#71717A',
};
const AVAIL_LABELS: Record<Avail, string> = {
  good: 'Available', fast: 'Filling fast', low: 'Few left', sold: 'Sold Out',
};

// ── Amenity icons ─────────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, string> = {
  Parking: '🅿', 'Food Court': '🍿', 'M-Ticket': '📱', Accessible: '♿',
  Recliner: '🛋', Dolby: '🔊', '4DX': '🌀',
};

// ── Types from API response ───────────────────────────────────────────────────
interface ShowSlot { id: string; showTime: string; format: string; language: string; seatsLeft?: number; }
interface VenueGroup { venueId: string; venueName: string; area?: string; distance?: string; amenities: string[]; fromPrice: number; shows: ShowSlot[]; }

// ── Venue Card ─────────────────────────────────────────────────────────────────
function VenueCard({ vg, selectedShowId, onSelect }: { vg: VenueGroup; selectedShowId: string | null; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);

  function availFor(seatsLeft?: number): Avail {
    if (!seatsLeft) return 'sold';
    if (seatsLeft > 50) return 'good';
    if (seatsLeft > 15) return 'fast';
    return 'low';
  }

  return (
    <div
      className={cn('p-5 rounded-xl bg-bg-surface border transition-colors duration-150', hovered ? 'border-border-strong' : 'border-border-default')}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      {/* Venue header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-sm flex-shrink-0">🎬</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-base leading-snug">{vg.venueName}</h3>
          <div className="flex gap-2 items-center text-xs text-text-muted font-sans mt-1 flex-wrap">
            {vg.area && <span>{vg.area}</span>}
            {vg.distance && <><span>·</span><span className="font-medium text-text-secondary">{vg.distance}</span></>}
            <span>·</span><span>from ₹{vg.fromPrice}</span>
          </div>
          {/* Amenity badges */}
          <div className="flex gap-1.5 flex-wrap mt-2">
            {vg.amenities.map((a) => (
              <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-surface2 border border-border-default text-text-secondary font-sans">
                {AMENITY_ICONS[a] ?? '·'} {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Show time chips */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
        {vg.shows.map((show) => {
          const avail = availFor(show.seatsLeft);
          const isSold = avail === 'sold';
          const isSelected = selectedShowId === show.id;
          const color = AVAIL_COLORS[avail];

          return (
            <button
              key={show.id}
              disabled={isSold}
              onClick={() => !isSold && onSelect(show.id)}
              className={cn(
                'relative flex flex-col gap-0.5 text-left p-3 rounded-lg border transition-all duration-150 overflow-hidden',
                isSelected
                  ? 'bg-gradient-to-br from-accent-indigo to-accent-purple border-transparent shadow-[0_8px_24px_rgba(99,102,241,0.4)]'
                  : isSold
                  ? 'bg-bg-surface2 border-border-default opacity-45 cursor-not-allowed'
                  : 'bg-bg-surface2 border-border-default hover:border-border-strong hover:-translate-y-0.5 cursor-pointer'
              )}
            >
              {/* Left colour stripe */}
              {!isSelected && !isSold && (
                <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg" style={{ background: color }} />
              )}
              <span className={cn('font-bold text-sm', isSelected ? 'text-white' : 'text-text-primary', isSold && 'line-through')}>
                {show.showTime.slice(0, 5)}
              </span>
              <span className={cn('text-[10px]', isSelected ? 'text-white/80' : 'text-text-muted')} style={!isSelected && !isSold ? { color } : undefined}>
                {show.format} · {show.language}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ShowtimesPage() {
  const { slug = '' } = useParams();
  const [dateIdx, setDateIdx] = useState(0);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);

  const { data: movie, isLoading: movieLoading } = useMovieDetail(slug);
  const { data: showtimesData, isLoading: showsLoading } = useShowtimes(slug, DATES[dateIdx].isoDate);

  // The API returns raw shows grouped by venue — we need to group them here
  const venueGroups: VenueGroup[] = (() => {
    const raw = (showtimesData as { venues?: VenueGroup[] } | null)?.venues ?? [];
    if (raw.length) return raw;

    // Fallback: raw array of shows
    const shows = (showtimesData as ShowSlot[] | null) ?? [];
    if (!shows.length) return [];

    // Group by venue if flat array returned
    const map = new Map<string, VenueGroup>();
    shows.forEach((s: ShowSlot & { venueId?: string; venueName?: string }) => {
      const vid = s.venueId ?? 'unknown';
      if (!map.has(vid)) map.set(vid, { venueId: vid, venueName: s.venueName ?? 'Venue', area: '', distance: '', amenities: [], fromPrice: 180, shows: [] });
      map.get(vid)!.shows.push(s);
    });
    return [...map.values()];
  })();

  const posterUrl = movie?.posterUrl ? TMDB_POSTER(movie.posterUrl) : null;

  return (
    <PublicLayout>
      <div className="max-w-[1280px] mx-auto px-6 pb-20">
        {/* Movie mini header */}
        <header className="flex gap-5 items-center py-6 mb-2">
          <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden bg-bg-surface2 flex-shrink-0">
            {posterUrl
              ? <img src={posterUrl} alt={movie?.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-bg-surface2 to-bg-surface3" />}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-muted tracking-widest uppercase font-sans mb-1">Showtimes</p>
            {movieLoading
              ? <Skeleton height={32} width={240} />
              : <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight">{movie?.title}</h1>}
            <div className="flex gap-2 mt-2 flex-wrap">
              {movie?.imdbRating && <Badge color="warning">⭐ {movie.imdbRating}</Badge>}
              {movie?.genres?.slice(0, 2).map((g) => <Badge key={g}>{g}</Badge>)}
              {movie?.certificate && <Badge>{movie.certificate}</Badge>}
            </div>
          </div>
        </header>

        {/* Date strip (sticky) */}
        <div className="sticky top-16 z-20 -mx-6 px-6 pb-4 bg-bg-base/95 backdrop-blur-md border-b border-border-default mb-6">
          <div className="flex gap-2 overflow-x-auto pt-3 pb-1 [scrollbar-width:none]">
            {DATES.map((d, i) => (
              <button
                key={d.isoDate}
                onClick={() => { setDateIdx(i); setSelectedShowId(null); }}
                className={cn(
                  'flex-shrink-0 w-[76px] py-3 rounded-xl text-center transition-all duration-150 font-sans',
                  dateIdx === i
                    ? 'bg-gradient-to-br from-accent-indigo to-accent-purple text-white shadow-[0_8px_24px_rgba(99,102,241,0.4)]'
                    : 'bg-bg-surface border border-border-default text-text-secondary hover:border-border-strong'
                )}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">{d.label}</div>
                <div className="font-display font-semibold text-xl leading-tight">{d.day}</div>
                <div className="text-[10px] opacity-80">{d.month}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap mb-5 p-4 rounded-xl bg-bg-surface border border-border-default text-xs font-sans">
          {(Object.entries(AVAIL_LABELS) as [Avail, string][]).map(([k, label]) => (
            <span key={k} className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: AVAIL_COLORS[k] }} />
              {label}
            </span>
          ))}
        </div>

        {/* Venue list + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-3">
            {showsLoading
              ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={180} className="rounded-xl" />)
              : venueGroups.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-bg-surface border border-border-default">
                  <span className="text-4xl mb-3">🎭</span>
                  <p className="text-text-secondary font-sans">No shows on {DATES[dateIdx].label}.</p>
                  <p className="text-text-muted text-sm mt-1 font-sans">Try another date.</p>
                </div>
              )
              : venueGroups.map((vg) => (
                <VenueCard key={vg.venueId} vg={vg} selectedShowId={selectedShowId} onSelect={setSelectedShowId} />
              ))}
          </div>

          {/* Sticky aside */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 p-5 rounded-xl bg-bg-surface border border-border-default">
              <h4 className="font-semibold text-sm mb-4 font-sans">Your selection</h4>
              {!selectedShowId ? (
                <p className="text-text-muted text-sm text-center py-6 font-sans">Tap a showtime to see details.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary font-sans">Show selected ✓</p>
                  <Link to={ROUTES.SEAT_SELECTION(selectedShowId)}>
                    <button className="w-full py-3 rounded-full bg-gradient-to-r from-accent-crimson-light to-accent-crimson text-white font-semibold text-sm font-sans shadow-[0_10px_40px_-10px_rgba(229,9,20,0.55)]">
                      Choose Seats →
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 p-5 rounded-xl bg-bg-surface border border-border-default">
              <h4 className="font-semibold text-xs text-text-muted uppercase tracking-wider mb-3 font-sans">Why BookKaroo</h4>
              <ul className="text-sm text-text-muted font-sans space-y-2">
                <li>✓ Reserved seats · No queue</li>
                <li>✓ Free reschedule (4h before)</li>
                <li>✓ Instant M-Tickets</li>
                <li>✓ IMAX & Dolby certified</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
