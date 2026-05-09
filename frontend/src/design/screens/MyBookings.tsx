import { useState } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Logo } from '../Logo';
import { GlassCard, Badge } from '../DesignSystem';
import { MOVIES } from './mockData';

const TMDB = 'https://image.tmdb.org/t/p/w300';

type BookingStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
type Tab = 'upcoming' | 'past';

interface Booking {
  id: string;
  bookingRef: string;
  movie: typeof MOVIES[0];
  date: string;
  time: string;
  venue: string;
  screen: string;
  seats: string;
  seatCategory: string;
  total: number;
  status: BookingStatus;
  format: string;
  hoursUntilShow?: number;
}

const BOOKINGS: Booking[] = [
  {
    id: 'b1',
    bookingRef: 'BK-20260509-WS22Q',
    movie: MOVIES[1],
    date: 'Today, 9 May 2026',
    time: '7:45 PM',
    venue: 'PVR Cinemas · Acropolis Mall',
    screen: 'Audi 3 · IMAX',
    seats: 'H12, H13',
    seatCategory: 'Executive',
    total: 897,
    status: 'CONFIRMED',
    format: 'IMAX',
    hoursUntilShow: 3,
  },
  {
    id: 'b2',
    bookingRef: 'BK-20260511-RT91K',
    movie: MOVIES[2],
    date: 'Sun, 11 May 2026',
    time: '4:30 PM',
    venue: 'INOX · Iscon Mega Mall',
    screen: 'Audi 2 · 4DX',
    seats: 'D5, D6, D7',
    seatCategory: 'Executive',
    total: 2340,
    status: 'CONFIRMED',
    format: '4DX',
    hoursUntilShow: 50,
  },
  {
    id: 'b3',
    bookingRef: 'BK-20260428-MN44X',
    movie: MOVIES[0],
    date: 'Mon, 28 Apr 2026',
    time: '9:00 PM',
    venue: 'PVR Cinemas · Acropolis Mall',
    screen: 'Audi 1 · IMAX',
    seats: 'A3, A4',
    seatCategory: 'Recliner',
    total: 1560,
    status: 'COMPLETED',
    format: 'IMAX',
  },
  {
    id: 'b4',
    bookingRef: 'BK-20260402-XT77Q',
    movie: MOVIES[4],
    date: 'Wed, 2 Apr 2026',
    time: '8:45 PM',
    venue: 'Cinépolis · The Pavilion',
    screen: 'Audi 4 · 2D',
    seats: 'F8',
    seatCategory: 'Normal',
    total: 312,
    status: 'CANCELLED',
    format: '2D',
  },
];

const STATUS_STYLES: Record<BookingStatus, { bg: string; color: string; border: string }> = {
  CONFIRMED: { bg: 'rgba(16,185,129,0.12)', color: T.colors.tint.successText, border: 'rgba(16,185,129,0.28)' },
  COMPLETED: { bg: T.colors.bg.surface3, color: T.colors.text.muted, border: T.colors.border.default },
  CANCELLED: { bg: 'rgba(229,9,20,0.12)', color: T.colors.tint.errorText, border: 'rgba(229,9,20,0.25)' },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <GlassCard padding="18px 20px">
      <div style={{ fontFamily: T.fonts.display, fontSize: 30, fontWeight: 600, lineHeight: 1, color: T.colors.text.primary }}>{value}</div>
      <div style={{ fontSize: 11, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: T.colors.semantic.success, marginTop: 4 }}>{sub}</div>}
    </GlassCard>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: Booking }) {
  const [hovered, setHovered] = useState(false);
  const status = STATUS_STYLES[booking.status];
  const canCancel = booking.status === 'CONFIRMED' && (booking.hoursUntilShow ?? 0) > 2;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '64px 1fr auto',
        gap: 18, alignItems: 'center',
        padding: 18, borderRadius: T.radius.xl,
        background: T.colors.bg.surface,
        border: `1px solid ${hovered ? T.colors.border.strong : T.colors.border.default}`,
        transition: `all ${T.motion.duration.base}`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? T.shadows.md : 'none',
      }}
    >
      {/* Poster */}
      <div style={{
        width: 64, aspectRatio: '2/3', borderRadius: T.radius.md, overflow: 'hidden', flexShrink: 0,
        background: T.gradients.posterPurple,
        opacity: booking.status === 'CANCELLED' ? 0.5 : 1,
      }}>
        <img src={`${TMDB}${booking.movie.posterPath}`} alt={booking.movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>

      {/* Info */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            padding: '2px 10px', borderRadius: T.radius.full, fontSize: 11, fontWeight: 600,
            background: status.bg, color: status.color, border: `1px solid ${status.border}`,
            fontFamily: T.fonts.body,
            textDecoration: booking.status === 'CANCELLED' ? 'line-through' : 'none',
          }}>
            {booking.status}
          </span>
          {booking.status === 'CONFIRMED' && booking.hoursUntilShow && booking.hoursUntilShow < 24 && (
            <Badge color="warning">⏱ {booking.hoursUntilShow}h to show</Badge>
          )}
        </div>

        <div style={{
          fontFamily: T.fonts.display, fontSize: 20, fontWeight: 600,
          letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4,
          color: booking.status === 'CANCELLED' ? T.colors.text.muted : T.colors.text.primary,
        }}>
          {booking.movie.title}
        </div>

        <div style={{ fontSize: 13, color: T.colors.text.secondary, marginBottom: 2 }}>
          {booking.date} · {booking.time} · {booking.format}
        </div>
        <div style={{ fontSize: 12, color: T.colors.text.muted, marginBottom: 10 }}>
          {booking.venue} · {booking.screen}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            padding: '3px 10px', borderRadius: T.radius.full,
            background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
            fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.secondary,
          }}>
            {booking.seatCategory.toUpperCase()} — {booking.seats}
          </span>
          <span style={{
            padding: '3px 10px', borderRadius: T.radius.full,
            background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
            fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.muted,
          }}>
            {booking.bookingRef}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{
          fontFamily: T.fonts.display, fontSize: 22, fontWeight: 600,
          color: booking.status === 'CANCELLED' ? T.colors.text.muted : T.colors.text.primary,
          textDecoration: booking.status === 'CANCELLED' ? 'line-through' : 'none',
        }}>
          ₹{booking.total.toLocaleString()}
        </div>

        {booking.status !== 'CANCELLED' && (
          <button style={{
            padding: '8px 20px', borderRadius: T.radius.full,
            background: booking.status === 'CONFIRMED'
              ? `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`
              : T.colors.bg.surface2,
            border: `1px solid ${booking.status === 'CONFIRMED' ? 'transparent' : T.colors.border.default}`,
            color: T.colors.tint.white,
            fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: T.fonts.body,
            boxShadow: booking.status === 'CONFIRMED' ? T.shadows.glowCrimson : 'none',
            whiteSpace: 'nowrap',
          }}>
            {booking.status === 'CONFIRMED' ? 'View Ticket →' : 'Book Again'}
          </button>
        )}

        {booking.status === 'CANCELLED' && (
          <button style={{ fontSize: 12, color: T.colors.accent.indigo, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.fonts.body }}>
            Refund details
          </button>
        )}

        {canCancel && (
          <button style={{ fontSize: 12, color: T.colors.semantic.error, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.fonts.body }}>
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MyBookings ───────────────────────────────────────────────────────────────

export default function MyBookings() {
  const [tab, setTab] = useState<Tab>('upcoming');

  const upcoming = BOOKINGS.filter((b) => b.status === 'CONFIRMED');
  const past = BOOKINGS.filter((b) => b.status !== 'CONFIRMED');
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      {/* Nav */}
      <nav style={{ height: 60, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', borderBottom: `1px solid ${T.colors.border.default}`, position: 'sticky', top: 0, zIndex: 40, background: `color-mix(in srgb, ${T.colors.bg.surface} 90%, transparent)`, backdropFilter: 'blur(16px)' }}>
        <Logo size={28} />
        <nav style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {['Movies', 'Events', 'My Bookings'].map((item) => (
            <a key={item} href="#" style={{ padding: '6px 12px', borderRadius: T.radius.md, fontSize: 13, fontWeight: item === 'My Bookings' ? 700 : 500, color: item === 'My Bookings' ? T.colors.text.primary : T.colors.text.secondary, textDecoration: 'none' }}>{item}</a>
          ))}
        </nav>
      </nav>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Profile header */}
        <header style={{
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'center',
          padding: '32px 0 24px', borderBottom: `1px solid ${T.colors.border.default}`,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: T.radius.full,
            background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
            display: 'grid', placeItems: 'center', color: T.colors.tint.white,
            fontFamily: T.fonts.display, fontSize: 28, fontWeight: 600,
            boxShadow: T.shadows.glowIndigo,
          }}>
            A
          </div>
          <div>
            <h1 style={{ fontFamily: T.fonts.display, margin: '0 0 4px', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Aarav Rastogi</h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 13, color: T.colors.text.muted }}>
              <span>aarav@bookkaroo.in</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.colors.text.muted, display: 'inline-block' }} />
              <span>+91 98765 43210</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.colors.text.muted, display: 'inline-block' }} />
              <span>Member since Jan 2026</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, margin: '24px 0 32px' }}>
          <StatCard label="Total Bookings" value="24" sub="↑ 8 vs last month" />
          <StatCard label="Upcoming" value={String(upcoming.length)} />
          <StatCard label="Total Spent" value="₹18,420" sub="23% on IMAX" />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, padding: '0 0 8px',
          borderBottom: `1px solid ${T.colors.border.default}`, marginBottom: 24,
        }}>
          {([['upcoming', 'Upcoming', upcoming.length], ['past', 'Past', past.length]] as const).map(([key, label, count]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '10px 16px', fontSize: 14, cursor: 'pointer',
              background: 'none', border: 'none', fontFamily: T.fonts.body,
              color: tab === key ? T.colors.text.primary : T.colors.text.muted,
              fontWeight: tab === key ? 600 : 400,
              position: 'relative',
            }}>
              {label}
              <span style={{
                marginLeft: 6, fontFamily: T.fonts.mono, fontSize: 11,
                padding: '1px 6px', borderRadius: T.radius.full,
                background: tab === key ? T.colors.bg.surface2 : T.colors.bg.surface,
                color: tab === key ? T.colors.text.primary : T.colors.text.muted,
              }}>
                {count}
              </span>
              {tab === key && (
                <span style={{
                  position: 'absolute', bottom: 0, left: 12, right: 12,
                  height: 2,
                  background: `linear-gradient(90deg, ${T.colors.accent.crimson}, ${T.colors.accent.crimsonLight})`,
                  borderRadius: 1,
                }} />
              )}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ padding: '6px 14px', borderRadius: T.radius.full, fontSize: 12, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`, color: T.colors.text.secondary, cursor: 'pointer', fontFamily: T.fonts.body }}>
              Filter
            </button>
          </div>
        </div>

        {/* Booking list */}
        <div style={{ display: 'grid', gap: 14 }}>
          {shown.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '56px 24px', borderRadius: T.radius.xl,
              background: T.colors.bg.surface, border: `1px dashed ${T.colors.border.strong}`,
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🎬</div>
              <p style={{ color: T.colors.text.muted, margin: 0, fontSize: 14 }}>No {tab} bookings</p>
            </div>
          ) : (
            shown.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </div>

        {shown.length > 0 && past.length > 0 && tab === 'past' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button style={{
              padding: '10px 28px', borderRadius: T.radius.full,
              background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
              color: T.colors.text.secondary, fontSize: 13, cursor: 'pointer', fontFamily: T.fonts.body,
            }}>
              Load more →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
