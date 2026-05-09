import React, { useState } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Badge } from '../DesignSystem';
import { MOVIES, VENUES } from './mockData';
import type { Showtime } from './mockData';

const TMDB = 'https://image.tmdb.org/t/p/w300';
const MOVIE = MOVIES[1]; // Chhaava

// ─── Date strip helpers ────────────────────────────────────────────────────────

function buildDates() {
  const base = new Date('2026-05-09');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return {
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      day: d.getDate(),
      month: months[d.getMonth()],
      date: d,
    };
  });
}

const DATES = buildDates();

// ─── Availability config ──────────────────────────────────────────────────────

const AVAIL: Record<Showtime['availability'], { color: string; label: string; textColor: string }> = {
  good: { color: T.colors.semantic.success, label: 'Available', textColor: '#6EE7B7' },
  fast: { color: T.colors.semantic.warning, label: 'Filling fast', textColor: '#FCD34D' },
  low: { color: T.colors.semantic.error, label: 'Few seats left', textColor: '#FF6770' },
  sold: { color: T.colors.text.muted, label: 'Sold Out', textColor: T.colors.text.muted },
};

const AMENITY_ICONS: Record<string, string> = {
  Parking: '🅿', 'Food Court': '🍿', 'M-Ticket': '📱', Accessible: '♿',
  Recliner: '🛋', Dolby: '🔊', '4DX': '🌀',
};

// ─── Time Chip ────────────────────────────────────────────────────────────────

interface TimeChipProps {
  show: Showtime;
  selected: boolean;
  onSelect: () => void;
}

function TimeChip({ show, selected, onSelect }: TimeChipProps) {
  const [hovered, setHovered] = useState(false);
  const avail = AVAIL[show.availability];
  const isSold = show.availability === 'sold';

  return (
    <button
      disabled={isSold}
      onClick={onSelect}
      onMouseEnter={() => !isSold && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 12px', borderRadius: T.radius.md,
        display: 'flex', flexDirection: 'column', gap: 3,
        textAlign: 'left', cursor: isSold ? 'not-allowed' : 'pointer',
        position: 'relative', overflow: 'hidden',
        background: selected
          ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`
          : hovered
          ? T.colors.bg.surface3
          : T.colors.bg.surface2,
        border: `1px solid ${selected ? 'transparent' : hovered ? T.colors.border.strong : T.colors.border.default}`,
        boxShadow: selected ? T.shadows.glowIndigo : 'none',
        opacity: isSold ? 0.45 : 1,
        transition: `all ${T.motion.duration.base}`,
        transform: hovered && !isSold ? 'translateY(-1px)' : 'none',
        fontFamily: T.fonts.body,
      }}
    >
      {/* Left availability stripe */}
      {!selected && !isSold && (
        <span style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: avail.color, borderRadius: '3px 0 0 3px',
        }} />
      )}

      <span style={{
        fontWeight: 700, fontSize: 14,
        color: selected ? '#fff' : isSold ? T.colors.text.muted : T.colors.text.primary,
        textDecoration: isSold ? 'line-through' : 'none',
      }}>
        {show.time}
      </span>
      <span style={{ fontSize: 10, color: selected ? 'rgba(255,255,255,0.85)' : avail.textColor }}>
        {show.format} · {show.language}
      </span>
      <span style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.7)' : T.colors.text.muted }}>
        {isSold ? '—' : `from ₹${show.price}`}
      </span>
    </button>
  );
}

// ─── Venue Card ───────────────────────────────────────────────────────────────

interface VenueCardProps {
  venue: typeof VENUES[0];
  selectedShowId: string | null;
  onSelectShow: (venueId: string, showId: string) => void;
}

function VenueCard({ venue, selectedShowId, onSelectShow }: VenueCardProps) {
  return (
    <div style={{
      padding: 22, borderRadius: T.radius.xl,
      background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
      marginBottom: 12,
      transition: `border-color ${T.motion.duration.base}`,
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.colors.border.strong)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.colors.border.default)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: T.radius.md,
              background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>
              🎬
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: T.colors.text.primary }}>{venue.name}</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: T.colors.text.muted }}>{venue.area}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.colors.text.muted, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.colors.text.secondary, fontWeight: 500 }}>{venue.distance}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.colors.text.muted, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: T.colors.text.muted }}>from ₹{venue.fromPrice}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {venue.amenities.map((a) => (
              <span key={a} style={{
                padding: '2px 8px', borderRadius: T.radius.full,
                background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
                fontSize: 11, color: T.colors.text.secondary, fontFamily: T.fonts.body,
              }}>
                {AMENITY_ICONS[a] ?? '·'} {a}
              </span>
            ))}
          </div>
        </div>

        <button style={{
          fontSize: 12, color: T.colors.text.muted, background: 'none', border: 'none',
          cursor: 'pointer', textDecoration: 'underline', fontFamily: T.fonts.body, whiteSpace: 'nowrap',
        }}>
          Venue info
        </button>
      </div>

      {/* Time chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 8,
      }}>
        {venue.showtimes.map((show) => (
          <TimeChip
            key={show.id}
            show={show}
            selected={selectedShowId === show.id}
            onSelect={() => onSelectShow(venue.id, show.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Showtimes ────────────────────────────────────────────────────────────────

export default function Showtimes() {
  const [dateIdx, setDateIdx] = useState(0);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<string[]>([]);

  function handleSelectShow(venueId: string, showId: string) {
    setSelectedVenueId(venueId);
    setSelectedShowId(showId);
  }

  const selectedVenue = VENUES.find((v) => v.id === selectedVenueId);
  const selectedShow = selectedVenue?.showtimes.find((s) => s.id === selectedShowId);

  const totalShows = VENUES.reduce((sum, v) => sum + v.showtimes.filter((s) => s.availability !== 'sold').length, 0);

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Movie header */}
        <section style={{ padding: '28px 0 16px', display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{
            width: 60, aspectRatio: '2/3', borderRadius: T.radius.md, overflow: 'hidden', flexShrink: 0,
            background: 'linear-gradient(135deg, #2a1a3d, #4c1d95)',
          }}>
            <img
              src={`${TMDB}${MOVIE.posterPath}`}
              alt={MOVIE.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Showtimes
            </div>
            <h1 style={{ fontFamily: T.fonts.display, fontSize: 'clamp(24px, 4vw, 40px)', margin: '0 0 8px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              {MOVIE.title}
            </h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge color="warning">⭐ {MOVIE.rating}</Badge>
              <Badge>{MOVIE.certificate} · {MOVIE.duration}</Badge>
              {MOVIE.genres.slice(0, 2).map((g) => <Badge key={g}>{g}</Badge>)}
            </div>
          </div>
        </section>

        {/* Date strip */}
        <div style={{
          display: 'flex', gap: 8, padding: '16px 0',
          overflowX: 'auto', borderBottom: `1px solid ${T.colors.border.default}`,
          position: 'sticky', top: 0,
          background: `color-mix(in srgb, ${T.colors.bg.base} 95%, transparent)`,
          backdropFilter: 'blur(12px)',
          zIndex: 20, marginBottom: 20,
        }}>
          {DATES.map((d, i) => (
            <button
              key={i}
              onClick={() => setDateIdx(i)}
              style={{
                flexShrink: 0, minWidth: 80, padding: '12px 14px',
                borderRadius: T.radius.lg, textAlign: 'center', cursor: 'pointer',
                background: dateIdx === i
                  ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`
                  : T.colors.bg.surface,
                border: `1px solid ${dateIdx === i ? 'transparent' : T.colors.border.default}`,
                color: dateIdx === i ? '#fff' : T.colors.text.secondary,
                boxShadow: dateIdx === i ? T.shadows.glowIndigo : 'none',
                transition: `all ${T.motion.duration.fast}`,
                fontFamily: T.fonts.body,
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>{d.label}</div>
              <div style={{ fontFamily: T.fonts.display, fontSize: 24, fontWeight: 600, lineHeight: 1, margin: '4px 0' }}>{d.day}</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>{d.month}</div>
            </button>
          ))}
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          {['All Formats', '2D', 'IMAX', 'Dolby', '4DX'].map((f) => (
            <button key={f} onClick={() => setFormatFilter(f === 'All Formats' ? [] : [f])}
              style={{
                padding: '4px 14px', height: 32, borderRadius: T.radius.full, fontSize: 13, fontWeight: 500,
                background: (f === 'All Formats' && formatFilter.length === 0) || formatFilter.includes(f)
                  ? 'rgba(99,102,241,0.2)' : T.colors.bg.surface,
                border: `1px solid ${(f === 'All Formats' && formatFilter.length === 0) || formatFilter.includes(f) ? T.colors.accent.indigo : T.colors.border.default}`,
                color: (f === 'All Formats' && formatFilter.length === 0) || formatFilter.includes(f)
                  ? T.colors.accent.indigo : T.colors.text.secondary,
                cursor: 'pointer', fontFamily: T.fonts.body,
              }}>
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: T.colors.text.muted }}>
            {VENUES.length} venues · {totalShows} shows
          </span>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', padding: '12px 18px',
          borderRadius: T.radius.lg, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
          marginBottom: 20, fontSize: 12,
        }}>
          {Object.entries(AVAIL).map(([key, val]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.colors.text.secondary }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: val.color, display: 'inline-block', flexShrink: 0 }} />
              {val.label}
            </span>
          ))}
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28 }}>
          <div>
            {VENUES.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                selectedShowId={selectedShowId}
                onSelectShow={handleSelectShow}
              />
            ))}
          </div>

          {/* Sticky aside summary */}
          <aside style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
            <div style={{ padding: 22, borderRadius: T.radius.xl, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}` }}>
              <h4 style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 14 }}>Your selection</h4>
              {!selectedShow ? (
                <p style={{ color: T.colors.text.muted, fontSize: 13, padding: '24px 0', textAlign: 'center' }}>
                  Tap a showtime to see details here.
                </p>
              ) : (
                <>
                  {[
                    { label: 'Movie', value: `${MOVIE.title} · ${selectedShow.format}` },
                    { label: 'Venue', value: selectedVenue?.name ?? '' },
                    { label: 'Date', value: DATES[dateIdx].label },
                    { label: 'Showtime', value: selectedShow.time },
                    { label: 'Language', value: selectedShow.language },
                    { label: 'Starts from', value: `₹${selectedShow.price}` },
                    { label: 'Hold time', value: '8 min once selected' },
                  ].map((row) => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                      borderBottom: `1px dashed ${T.colors.border.default}`,
                      fontSize: 13, color: T.colors.text.secondary,
                    }}>
                      <span>{row.label}</span>
                      <strong style={{ color: T.colors.text.primary, fontWeight: 500, maxWidth: '55%', textAlign: 'right' }}>{row.value}</strong>
                    </div>
                  ))}

                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <a href={`/booking/${selectedShow.id}/seats`} style={{ textDecoration: 'none' }}>
                      <button style={{
                        width: '100%', padding: '12px 0', borderRadius: T.radius.full,
                        background: `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`,
                        color: '#fff', border: 'none', fontWeight: 700, fontSize: 15,
                        cursor: 'pointer', fontFamily: T.fonts.body,
                        boxShadow: T.shadows.glowCrimson,
                      }}>
                        Choose Seats →
                      </button>
                    </a>
                    <button style={{
                      width: '100%', padding: '10px 0', borderRadius: T.radius.full,
                      background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
                      color: T.colors.text.secondary, fontWeight: 500, fontSize: 13,
                      cursor: 'pointer', fontFamily: T.fonts.body,
                    }}>
                      Notify if cancelled
                    </button>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: 14, padding: 22, borderRadius: T.radius.xl, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}` }}>
              <h4 style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 13, color: T.colors.text.secondary }}>Why BookKaroo</h4>
              <ul style={{ margin: 0, paddingLeft: 18, color: T.colors.text.muted, fontSize: 13, lineHeight: 1.8 }}>
                <li>Reserved seats · No queue at counter</li>
                <li>Free reschedule up to 4h before</li>
                <li>IMAX & Dolby certified screens</li>
                <li>Instant M-Tickets on your phone</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
