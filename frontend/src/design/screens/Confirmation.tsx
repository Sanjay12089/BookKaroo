import { useEffect, useState } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Logo } from '../Logo';
import { Badge } from '../DesignSystem';
import { MOVIES } from './mockData';

const MOVIE = MOVIES[1]; // Chhaava
const TMDB = 'https://image.tmdb.org/t/p/w300';
const BOOKING_ID = 'BK-20260509-WS22Q';

// ─── Confetti ─────────────────────────────────────────────────────────────────

interface ConfettiParticle {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
  duration: number;
}

const CONFETTI_COLORS = [
  T.colors.accent.crimson,
  T.colors.accent.indigo,
  T.colors.accent.purple,
  '#FFD700',
  T.colors.semantic.success,
  T.colors.tint.errorText,
  T.colors.tint.indigoText,
];

function generateParticles(): ConfettiParticle[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
    duration: 2 + Math.random() * 2,
  }));
}

// ─── QR placeholder ───────────────────────────────────────────────────────────

function QRPlaceholder() {
  const dots: JSX.Element[] = [];
  const seed = BOOKING_ID;
  let h = 0;
  for (const c of seed) h = ((h * 31 + c.charCodeAt(0)) >>> 0);
  function rng() { h = ((h * 1103515245 + 12345) >>> 0); return (h % 1000) / 1000; }

  for (let r = 0; r < 7; r++) {
    for (let col = 0; col < 7; col++) {
      const isCorner = (r < 2 && col < 2) || (r < 2 && col > 4) || (r > 4 && col < 2);
      const filled = isCorner || rng() > 0.45;
      dots.push(
        <div key={`${r}-${col}`} style={{
          width: 14, height: 14,
          background: filled ? T.colors.bg.base : 'transparent',
          borderRadius: 2,
        }} />
      );
    }
  }

  return (
    <div style={{
      width: 140, height: 140, background: T.colors.tint.white,
      borderRadius: T.radius.md, padding: 10,
      display: 'grid', placeItems: 'center',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 14px)', gap: 2 }}>
        {dots}
      </div>
    </div>
  );
}

// ─── Ticket Card ──────────────────────────────────────────────────────────────

function TicketCard({ stampVisible }: { stampVisible: boolean }) {
  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${T.colors.bg.surface2}, ${T.colors.bg.surface3})`,
      border: `1px solid ${T.colors.border.default}`,
      borderRadius: T.radius.xl,
      boxShadow: T.shadows.lg,
      overflow: 'visible',
      maxWidth: 700, margin: '0 auto',
    }}>
      {/* Left notch */}
      <div style={{
        position: 'absolute', left: -14, top: '42%',
        width: 28, height: 28, borderRadius: T.radius.full,
        background: T.colors.bg.base, border: `1px solid ${T.colors.border.default}`,
        zIndex: 2,
      }} />
      {/* Right notch */}
      <div style={{
        position: 'absolute', right: -14, top: '42%',
        width: 28, height: 28, borderRadius: T.radius.full,
        background: T.colors.bg.base, border: `1px solid ${T.colors.border.default}`,
        zIndex: 2,
      }} />

      {/* Top half */}
      <div style={{
        padding: '28px 36px 24px',
        background: `linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.04))`,
        position: 'relative',
      }}>
        {/* Diagonal pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,1) 0 2px, transparent 2px 18px)',
        }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative' }}>
          {/* Poster */}
          <div style={{
            width: 72, aspectRatio: '2/3', borderRadius: T.radius.md, overflow: 'hidden', flexShrink: 0,
            background: T.gradients.posterPurple,
            boxShadow: T.shadows.md,
          }}>
            <img src={`${TMDB}${MOVIE.posterPath}`} alt={MOVIE.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.fonts.mono, fontSize: 10, letterSpacing: '0.2em', color: T.colors.text.muted }}>
              ★ ADMIT TWO · IMAX
            </div>
            <h2 style={{
              fontFamily: T.fonts.display, fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900,
              letterSpacing: '-0.02em', margin: '6px 0 4px', color: T.colors.text.primary, lineHeight: 1.1,
            }}>
              {MOVIE.title}
            </h2>
            <div style={{ fontSize: 13, color: T.colors.text.secondary }}>
              {MOVIE.genres.join(' · ')} · {MOVIE.certificate} · {MOVIE.languages[0]}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 20px', marginTop: 18 }}>
              {[
                { l: 'Date', v: '9 May 2026' },
                { l: 'Show', v: '7:45 PM' },
                { l: 'Screen', v: 'Audi 3' },
                { l: 'Cinema', v: 'PVR Acropolis', wide: true },
                { l: 'Seats', v: 'H12, H13', mono: true },
                { l: 'Class', v: 'Executive', mono: true },
              ].map((cell) => (
                <div key={cell.l} style={{ gridColumn: (cell as { wide?: boolean }).wide ? '1 / -1' : 'auto' }}>
                  <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{cell.l}</div>
                  <div style={{
                    fontSize: (cell as { wide?: boolean }).wide ? 16 : 15, fontWeight: 600, marginTop: 4,
                    color: T.colors.text.primary,
                    fontFamily: (cell as { mono?: boolean }).mono ? T.fonts.mono : T.fonts.display,
                  }}>
                    {cell.v}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              <Badge color="indigo">IMAX</Badge>
              <Badge color="success">Free reschedule until 3:45 PM</Badge>
            </div>
          </div>

          {/* STAMP */}
          {stampVisible && (
            <div style={{
              position: 'absolute', right: 0, top: -8,
              padding: '6px 14px', borderRadius: T.radius.md,
              border: `3px solid ${T.colors.accent.crimson}`,
              color: T.colors.accent.crimson,
              fontFamily: T.fonts.mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
              transform: 'rotate(-15deg)',
              textTransform: 'uppercase',
              boxShadow: `inset 0 0 0 2px rgba(229,9,20,0.15)`,
              animation: 'bk-stamp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.8s both',
            }}>
              CONFIRMED
            </div>
          )}
        </div>
      </div>

      {/* Dashed tear line */}
      <div style={{
        height: 0, borderTop: `2px dashed ${T.colors.border.strong}`,
        position: 'relative',
      }} />

      {/* Bottom half — QR */}
      <div style={{
        padding: '24px 36px 28px',
        display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'center',
        background: T.colors.bg.surface3,
        borderBottomLeftRadius: T.radius.xl,
        borderBottomRightRadius: T.radius.xl,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: T.colors.text.muted, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Scan at entry counter
          </div>
          <QRPlaceholder />
          <div style={{ fontFamily: T.fonts.mono, fontSize: 12, color: T.colors.text.secondary, marginTop: 10 }}>
            {BOOKING_ID}
          </div>
          <div style={{ fontSize: 10, color: T.colors.text.muted, marginTop: 4 }}>
            Brightness auto-boosts in app
          </div>
        </div>

        <div style={{ height: 160, width: 1, background: T.colors.border.default, flexShrink: 0 }} />

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Total Paid</div>
            <div style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 700, color: T.colors.text.primary }}>₹897</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Booking ID</div>
            <div style={{ fontFamily: T.fonts.mono, fontSize: 13, color: T.colors.text.secondary }}>{BOOKING_ID}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Payment</div>
            <div style={{ fontSize: 13, color: T.colors.text.secondary }}>Test Mode · ₹0 charged</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation ─────────────────────────────────────────────────────────────

export default function Confirmation() {
  const [mounted, setMounted] = useState(false);
  const [stampVisible, setStampVisible] = useState(false);
  const [particles] = useState<ConfettiParticle[]>(generateParticles);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 100);
    const t2 = setTimeout(() => setStampVisible(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      {/* Mini nav */}
      <nav style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: `1px solid ${T.colors.border.default}` }}>
        <Logo size={28} />
        <a href="/movies" style={{ fontSize: 13, color: T.colors.text.muted, textDecoration: 'none' }}>← Back to Movies</a>
      </nav>

      {/* Confetti layer */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
        {particles.map((p) => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`, top: -20,
            width: p.size, height: p.size,
            background: p.color, borderRadius: 2,
            animation: `bk-confetti ${p.duration}s ${p.delay}s ease-in both`,
            opacity: 0,
          }} />
        ))}
      </div>

      <main>
        {/* Hero section */}
        <section style={{
          padding: '56px 24px 24px', textAlign: 'center',
          background: `radial-gradient(80% 60% at 50% 20%, rgba(16,185,129,0.18), transparent 60%)`,
          position: 'relative',
        }}>
          {/* Checkmark */}
          <div style={{
            width: 80, height: 80, borderRadius: T.radius.full,
            margin: '0 auto 20px',
            background: 'rgba(16,185,129,0.16)', border: '1px solid rgba(16,185,129,0.35)',
            color: T.colors.tint.successText, fontSize: 36,
            display: 'grid', placeItems: 'center',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.4)',
            transition: `opacity 0.4s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}>
            ✓
          </div>

          <div style={{
            opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)',
            transition: `opacity 0.5s 0.15s, transform 0.5s 0.15s`,
          }}>
            <Logo size={40} glow style={{ justifyContent: 'center', marginBottom: 16 }} />

            <h1 style={{
              fontFamily: T.fonts.display, fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px',
              color: T.colors.semantic.success,
            }}>
              Booking Confirmed!
            </h1>
            <p style={{ color: T.colors.text.secondary, fontSize: 16, margin: '0 0 14px' }}>
              Tickets emailed to <strong style={{ color: T.colors.text.primary }}>aarav@bookkaroo.in</strong>
            </p>
            <div style={{
              display: 'inline-block',
              fontFamily: T.fonts.mono, fontSize: 13,
              color: T.colors.text.muted, letterSpacing: '0.16em',
              padding: '4px 16px', borderRadius: T.radius.full,
              background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
            }}>
              {BOOKING_ID}
            </div>
          </div>
        </section>

        {/* Ticket */}
        <section style={{ maxWidth: 720, margin: '24px auto 0', padding: '0 16px' }}>
          <TicketCard stampVisible={stampVisible} />
        </section>

        {/* Action buttons */}
        <section style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10, maxWidth: 620, margin: '32px auto', padding: '0 16px',
        }}>
          {[
            { icon: '📄', label: 'Download Invoice', primary: false },
            { icon: '📅', label: 'Add to Calendar', primary: false },
            { icon: '💬', label: 'Share on WhatsApp', primary: false },
          ].map((btn) => (
            <button key={btn.label} style={{
              padding: '16px 12px', borderRadius: T.radius.lg, textAlign: 'center',
              background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
              fontSize: 13, fontWeight: 500, color: T.colors.text.primary, cursor: 'pointer',
              fontFamily: T.fonts.body,
              transition: `all ${T.motion.duration.base}`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.colors.border.strong; e.currentTarget.style.background = T.colors.bg.surface2; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.colors.border.default; e.currentTarget.style.background = T.colors.bg.surface; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{btn.icon}</div>
              {btn.label}
            </button>
          ))}
        </section>

        {/* Order summary strip */}
        <section style={{ maxWidth: 720, margin: '0 auto 32px', padding: '0 16px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            borderRadius: T.radius.lg, overflow: 'hidden',
            border: `1px solid ${T.colors.border.default}`,
          }}>
            {[
              { label: 'Booking Date', value: '9 May 2026 · 6:18 PM' },
              { label: 'Payment Type', value: 'Test Mode · UPI' },
              { label: 'Confirmation #', value: BOOKING_ID },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: '16px 18px', background: i % 2 === 0 ? T.colors.bg.surface : T.colors.bg.surface2,
                borderRight: i < 2 ? `1px solid ${T.colors.border.default}` : 'none',
              }}>
                <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: T.colors.text.secondary, fontFamily: i === 2 ? T.fonts.mono : T.fonts.body }}>{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section style={{ maxWidth: 720, margin: '0 auto 64px', padding: '0 16px' }}>
          <div style={{
            borderRadius: T.radius.xl, border: `1px solid ${T.colors.border.default}`,
            background: T.colors.bg.surface, overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.colors.border.default}`, fontWeight: 600, fontSize: 14 }}>
              📋 Important instructions
            </div>
            <div style={{ padding: '0 0 8px' }}>
              {[
                { icon: '🪪', text: 'Carry a valid government-issued photo ID. Entry may be denied without ID.' },
                { icon: '⏰', text: 'Arrive at least 20 minutes early. IMAX gates close 5 minutes before showtime.' },
                { icon: '🚫', text: 'Outside food and beverages are not permitted inside the cinema.' },
                { icon: '📱', text: 'Show this QR code at the entry counter. Brightness will auto-boost in the BookKaroo app.' },
              ].map((item) => (
                <div key={item.icon} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '12px 20px',
                  borderBottom: `1px solid ${T.colors.border.subtle}`,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: T.colors.text.secondary, lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
