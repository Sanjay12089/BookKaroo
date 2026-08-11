import { useState, useEffect, useCallback, Fragment } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { CountdownRing } from '../DesignSystem';
import { buildSeatLayout, SEAT_PRICES, MOVIES } from './mockData';
import type { SeatRow, SeatCategory } from './mockData';

const MOVIE = MOVIES[1];
const CONV_FEE = 49;
const GST_RATE = 0.18;
const MAX_SEATS = 10;
const TOTAL_SECONDS = 8 * 60;

// ─── Seat sizing ──────────────────────────────────────────────────────────────

const SEAT_SIZES: Record<SeatCategory, { w: number; h: number; br: string }> = {
  recliner: { w: 36, h: 32, br: '9px 9px 5px 5px' },
  executive: { w: 30, h: 28, br: '7px 7px 4px 4px' },
  normal: { w: 28, h: 26, br: '6px 6px 3px 3px' },
};

const CATEGORY_COLORS: Record<SeatCategory, { bg: string; border: string; hover: string }> = {
  recliner: {
    bg: `rgba(255,215,0,0.14)`,
    border: `rgba(255,215,0,0.35)`,
    hover: `rgba(255,215,0,0.28)`,
  },
  executive: {
    bg: `rgba(65,105,225,0.18)`,
    border: `rgba(65,105,225,0.4)`,
    hover: `rgba(65,105,225,0.32)`,
  },
  normal: {
    bg: `rgba(228,228,231,0.08)`,
    border: `rgba(228,228,231,0.16)`,
    hover: `rgba(228,228,231,0.18)`,
  },
};

const CATEGORY_LABELS: Record<SeatCategory, { name: string; dot: string }> = {
  recliner: { name: 'Recliner', dot: T.colors.seat.recliner },
  executive: { name: 'Executive', dot: T.colors.seat.executive },
  normal: { name: 'Normal', dot: T.colors.seat.normal },
};

// ─── Individual Seat ──────────────────────────────────────────────────────────

interface SeatProps {
  id: string;
  number: number;
  category: SeatCategory;
  state: 'available' | 'booked' | 'locked' | 'selected';
  onToggle: (id: string, category: SeatCategory) => void;
}

function Seat({ id, number, category, state, onToggle }: SeatProps) {
  const [hovered, setHovered] = useState(false);
  const sz = SEAT_SIZES[category];
  const col = CATEGORY_COLORS[category];

  const canInteract = state === 'available' || state === 'selected';

  let bg: string;
  let border: string;
  let color: string;

  if (state === 'selected') {
    bg = `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`;
    border = 'transparent';
    color = T.colors.tint.white;
  } else if (state === 'booked') {
    bg = T.colors.bg.surface3;
    border = T.colors.border.default;
    color = 'transparent';
  } else if (state === 'locked') {
    bg = `rgba(245,158,11,0.18)`;
    border = `rgba(245,158,11,0.4)`;
    color = `rgba(245,158,11,0.6)`;
  } else if (hovered) {
    bg = col.hover;
    border = col.border;
    color = 'rgba(255,255,255,0.5)';
  } else {
    bg = col.bg;
    border = col.border;
    color = 'rgba(255,255,255,0.3)';
  }

  return (
    <button
      onClick={() => canInteract && onToggle(id, category)}
      onMouseEnter={() => canInteract && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={!canInteract}
      title={canInteract ? `${id} · ₹${SEAT_PRICES[category]}` : state === 'booked' ? 'Booked' : 'Locked'}
      style={{
        width: sz.w, height: sz.h, borderRadius: sz.br,
        background: bg, border: `1px solid ${border}`,
        display: 'grid', placeItems: 'center',
        cursor: canInteract ? 'pointer' : 'not-allowed',
        opacity: state === 'booked' ? 0.35 : 1,
        fontSize: 8, color,
        flexShrink: 0,
        transition: `transform ${T.motion.duration.fast}, background ${T.motion.duration.fast}, border-color ${T.motion.duration.fast}`,
        transform: hovered && canInteract ? 'translateY(-2px) scale(1.12)' : state === 'selected' ? 'translateY(-1px)' : 'none',
        boxShadow: state === 'selected' ? `0 0 0 2px rgba(225, 29, 116,0.3), ${T.shadows.glowCrimson}` : 'none',
      }}
    >
      {state === 'selected' ? '✓' : number}
    </button>
  );
}

// ─── Section header row ───────────────────────────────────────────────────────

function SectionLabel({ category }: { category: SeatCategory }) {
  const cat = CATEGORY_LABELS[category];
  const price = SEAT_PRICES[category];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '24px 0 10px', paddingLeft: 36,
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%',
        background: cat.dot, display: 'inline-block', flexShrink: 0,
      }} />
      <span style={{
        fontFamily: T.fonts.mono, fontSize: 11, letterSpacing: '0.18em',
        color: T.colors.text.secondary, textTransform: 'uppercase',
      }}>
        {cat.name}
      </span>
      <span style={{ fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.muted, marginLeft: 'auto', paddingRight: 16 }}>
        ₹{price} / seat
      </span>
    </div>
  );
}

// ─── Seat Grid ────────────────────────────────────────────────────────────────

interface SeatGridProps {
  layout: SeatRow[];
  selected: Set<string>;
  onToggle: (id: string, category: SeatCategory) => void;
}

function SeatGrid({ layout, selected, onToggle }: SeatGridProps) {
  let lastCategory: SeatCategory | null = null;

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      {layout.map((row) => {
        const showLabel = row.category !== lastCategory;
        lastCategory = row.category;

        return (
          <Fragment key={row.letter}>
            {showLabel && <SectionLabel category={row.category} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, padding: '0 6px' }}>
              <span style={{ fontFamily: T.fonts.mono, fontSize: 10, color: T.colors.text.muted, width: 24, textAlign: 'center', flexShrink: 0 }}>
                {row.letter}
              </span>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                {row.seats.map((cell) => {
                  if (cell.state === 'gap') {
                    return <span key={cell.id} style={{ display: 'inline-block', width: 14, flexShrink: 0 }} />;
                  }
                  const isSelected = selected.has(cell.id);
                  return (
                    <Seat
                      key={cell.id}
                      id={cell.id}
                      number={cell.number!}
                      category={row.category}
                      state={isSelected ? 'selected' : cell.state === 'available' ? 'available' : cell.state === 'booked' ? 'booked' : 'locked'}
                      onToggle={onToggle}
                    />
                  );
                })}
              </div>
              <span style={{ fontFamily: T.fonts.mono, fontSize: 10, color: T.colors.text.muted, width: 24, textAlign: 'center', flexShrink: 0 }}>
                {row.letter}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// ─── Sticky Bottom Bar (mobile) ───────────────────────────────────────────────

interface BottomBarProps {
  selected: Set<string>;
  onRemove: (id: string) => void;
  total: number;
}

function BottomBar({ selected, onRemove, total }: BottomBarProps) {
  const hasSelection = selected.size > 0;
  const convFee = hasSelection ? CONV_FEE : 0;
  const gst = hasSelection ? Math.round(convFee * GST_RATE) : 0;
  const grand = total + convFee + gst;

  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 30,
      background: `rgba(19,24,38,0.96)`,
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${T.colors.border.default}`,
      padding: '12px 24px 16px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Selected chips */}
        {hasSelection && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {[...selected].map((id) => (
              <span key={id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: T.radius.full,
                background: 'rgba(225, 29, 116,0.12)', color: T.colors.tint.errorText,
                border: '1px solid rgba(225, 29, 116,0.25)',
                fontSize: 12, fontWeight: 600, fontFamily: T.fonts.body,
              }}>
                {id}
                <button onClick={() => onRemove(id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: T.colors.tint.errorText,
                  fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2,
                }}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Breakdown */}
          <div style={{ flex: 1, minWidth: 160 }}>
            {hasSelection ? (
              <div style={{ fontSize: 12, color: T.colors.text.muted, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>{selected.size} seat{selected.size > 1 ? 's' : ''} · ₹{total}</span>
                <span>Conv. fee ₹{convFee} + GST ₹{gst}</span>
              </div>
            ) : (
              <span style={{ fontSize: 13, color: T.colors.text.muted }}>Select seats to continue</span>
            )}
            {hasSelection && (
              <div style={{ fontFamily: T.fonts.display, fontSize: 24, fontWeight: 700, color: T.colors.text.primary, marginTop: 2 }}>
                ₹{grand}
              </div>
            )}
          </div>

          {/* Pay button */}
          <button
            disabled={!hasSelection}
            style={{
              padding: '0 36px', height: 52, borderRadius: T.radius.full,
              background: hasSelection
                ? `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`
                : T.colors.bg.surface3,
              color: hasSelection ? T.colors.tint.white : T.colors.text.muted,
              border: 'none', fontWeight: 700, fontSize: 16,
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              fontFamily: T.fonts.body,
              boxShadow: hasSelection ? T.shadows.glowCrimson : 'none',
              transition: `all ${T.motion.duration.base}`,
            }}
          >
            {hasSelection ? `Pay Now · ₹${grand} →` : 'Select seats'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SeatSelection ────────────────────────────────────────────────────────────

export default function SeatSelection() {
  const [layout] = useState<SeatRow[]>(() => buildSeatLayout());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [seatCategories] = useState<Map<string, SeatCategory>>(() => {
    const map = new Map<string, SeatCategory>();
    buildSeatLayout().forEach((row) => {
      row.seats.forEach((cell) => {
        if (cell.number !== null) map.set(cell.id, row.category);
      });
    });
    return map;
  });

  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleToggle = useCallback((id: string, _category: SeatCategory) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SEATS) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
  }, []);

  const total = [...selected].reduce((sum, id) => sum + SEAT_PRICES[seatCategories.get(id) ?? 'normal'], 0);

  // Quick count selector: pick N best available seats
  function pickBest(n: number) {
    const available: string[] = [];
    for (const row of layout) {
      for (const cell of row.seats) {
        if (cell.state === 'available' && cell.number !== null) available.push(cell.id);
        if (available.length >= n) break;
      }
      if (available.length >= n) break;
    }
    setSelected(new Set(available.slice(0, n)));
  }

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body, display: 'flex', flexDirection: 'column' }}>
      {/* Sticky header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: `color-mix(in srgb, ${T.colors.bg.surface} 92%, transparent)`,
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.colors.border.default}`,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 72, gap: 20, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={{
              padding: '6px 14px', borderRadius: T.radius.full,
              background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
              color: T.colors.text.secondary, fontSize: 13, cursor: 'pointer', fontFamily: T.fonts.body,
            }}>
              ← Back
            </button>
            <div>
              <div style={{ fontSize: 11, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                PVR Acropolis · Audi 3 · IMAX
              </div>
              <h1 style={{
                fontFamily: T.fonts.display, fontSize: 'clamp(18px, 2.5vw, 28px)',
                margin: '2px 0', fontWeight: 600, letterSpacing: '-0.02em',
              }}>
                {MOVIE.title}
              </h1>
              <div style={{ fontSize: 12, color: T.colors.text.muted }}>
                Today · 7:45 PM · IMAX · Hindi · {MOVIE.duration}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 16px 8px 10px',
            borderRadius: T.radius.full, background: T.colors.bg.surface,
            border: `1px solid ${T.colors.border.strong}`,
          }}>
            <CountdownRing
              totalSeconds={TOTAL_SECONDS}
              remainingSeconds={remaining}
              size={44}
              strokeWidth={4}
              showLabel
            />
            <div>
              <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hold expires in</div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '24px 24px 120px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
          {/* Theatre */}
          <section style={{
            padding: '40px 24px 32px',
            borderRadius: T.radius.xl,
            background: `radial-gradient(80% 60% at 50% 0%, rgba(99,102,241,0.14), transparent 60%), ${T.colors.bg.surface}`,
            border: `1px solid ${T.colors.border.default}`,
            overflowX: 'auto',
          }}>
            {/* Screen */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{
                width: '70%', maxWidth: 580, margin: '0 auto',
                height: 28, borderRadius: '50% / 100% 100% 0 0',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.2))',
                filter: 'drop-shadow(0 -10px 24px rgba(255,255,255,0.35))',
                transform: 'perspective(400px) rotateX(40deg)',
              }} />
              <div style={{
                fontFamily: T.fonts.mono, fontSize: 10, letterSpacing: '0.3em',
                color: T.colors.text.muted, marginTop: 18,
                textTransform: 'uppercase',
              }}>
                — ALL EYES THIS WAY · IMAX —
              </div>
            </div>

            {/* Quick pick */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: T.colors.text.muted }}>Quick pick:</span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button key={n} onClick={() => pickBest(n)} style={{
                  width: 30, height: 30, borderRadius: T.radius.md,
                  background: selected.size === n ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})` : T.colors.bg.surface2,
                  border: `1px solid ${selected.size === n ? 'transparent' : T.colors.border.default}`,
                  color: selected.size === n ? T.colors.tint.white : T.colors.text.secondary,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.fonts.body,
                }}>
                  {n}
                </button>
              ))}
            </div>

            {/* Zoom controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12, color: T.colors.text.muted }}>
              <span>Pinch or use zoom:</span>
              <button onClick={() => setZoomScale((z) => Math.min(1.5, z + 0.1))} style={{
                width: 28, height: 28, borderRadius: T.radius.md, background: T.colors.bg.surface2,
                border: `1px solid ${T.colors.border.default}`, color: T.colors.text.secondary,
                cursor: 'pointer', fontFamily: T.fonts.body, fontSize: 16,
              }}>+</button>
              <button onClick={() => setZoomScale((z) => Math.max(0.7, z - 0.1))} style={{
                width: 28, height: 28, borderRadius: T.radius.md, background: T.colors.bg.surface2,
                border: `1px solid ${T.colors.border.default}`, color: T.colors.text.secondary,
                cursor: 'pointer', fontFamily: T.fonts.body, fontSize: 16,
              }}>−</button>
              <button onClick={() => setZoomScale(1)} style={{
                padding: '0 8px', height: 28, borderRadius: T.radius.md, background: T.colors.bg.surface2,
                border: `1px solid ${T.colors.border.default}`, color: T.colors.text.muted,
                cursor: 'pointer', fontFamily: T.fonts.mono, fontSize: 11,
              }}>Reset</button>
            </div>

            <div style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center', transition: `transform ${T.motion.duration.base}` }}>
              <SeatGrid layout={layout} selected={selected} onToggle={handleToggle} />
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex', gap: 16, flexWrap: 'wrap',
              padding: '14px 18px', borderRadius: T.radius.lg,
              background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
              marginTop: 24, fontSize: 12,
            }}>
              {[
                { label: `Recliner · ₹${SEAT_PRICES.recliner}`, bg: `rgba(255,215,0,0.14)`, border: `rgba(255,215,0,0.35)` },
                { label: `Executive · ₹${SEAT_PRICES.executive}`, bg: `rgba(65,105,225,0.18)`, border: `rgba(65,105,225,0.4)` },
                { label: `Normal · ₹${SEAT_PRICES.normal}`, bg: `rgba(228,228,231,0.08)`, border: `rgba(228,228,231,0.16)` },
                { label: 'Selected', bg: T.colors.accent.crimson, border: 'transparent' },
                { label: 'Booked', bg: T.colors.bg.surface3, border: T.colors.border.default, opacity: 0.4 },
                { label: 'Locked', bg: `rgba(245,158,11,0.18)`, border: `rgba(245,158,11,0.4)` },
              ].map((item) => (
                <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.colors.text.secondary }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: 4,
                    background: item.bg, border: `1px solid ${item.border}`,
                    display: 'inline-block', flexShrink: 0,
                    opacity: ('opacity' in item ? item.opacity : 1) as number,
                  }} />
                  {item.label}
                </span>
              ))}
            </div>
          </section>

          {/* Aside summary */}
          <aside style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
            <div style={{ padding: 22, borderRadius: T.radius.xl, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}` }}>
              {/* Movie mini header */}
              <div style={{
                display: 'flex', gap: 12, paddingBottom: 14,
                borderBottom: `1px dashed ${T.colors.border.default}`, marginBottom: 14,
              }}>
                <div style={{
                  width: 52, aspectRatio: '2/3', borderRadius: T.radius.md, overflow: 'hidden', flexShrink: 0,
                  background: T.gradients.posterPurple,
                }}>
                  <img src={`https://image.tmdb.org/t/p/w300${MOVIE.posterPath}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.colors.text.primary }}>{MOVIE.title}</div>
                  <div style={{ fontSize: 11, color: T.colors.text.muted, marginTop: 2 }}>IMAX · {MOVIE.certificate} · {MOVIE.duration}</div>
                  <div style={{ fontSize: 11, color: T.colors.text.secondary, marginTop: 3 }}>PVR Acropolis · 7:45 PM</div>
                </div>
              </div>

              {/* Selection info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, color: T.colors.text.secondary }}>
                <span>Selected</span>
                <strong style={{ color: T.colors.text.primary }}>{selected.size} / {MAX_SEATS} seats</strong>
              </div>

              {/* Selected chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, minHeight: 28, marginBottom: 12 }}>
                {selected.size === 0 ? (
                  <span style={{ fontSize: 12, color: T.colors.text.muted }}>Tap seats to select</span>
                ) : [...selected].map((id) => (
                  <span key={id} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: T.radius.full,
                    background: 'rgba(99,102,241,0.14)', color: T.colors.tint.indigoText,
                    border: '1px solid rgba(99,102,241,0.28)',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {id}
                    <button onClick={() => handleRemove(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.colors.tint.indigoText, fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>

              {/* Price breakdown */}
              {selected.size > 0 && (
                <div style={{
                  padding: 12, borderRadius: T.radius.md,
                  background: T.colors.bg.base, border: `1px solid ${T.colors.border.default}`,
                  fontSize: 13, marginBottom: 14,
                }}>
                  {[...new Set([...selected].map((id) => seatCategories.get(id) ?? 'normal'))].map((cat) => {
                    const count = [...selected].filter((id) => (seatCategories.get(id) ?? 'normal') === cat).length;
                    return (
                      <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: T.colors.text.secondary }}>
                        <span>{count} × {cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        <span>₹{count * SEAT_PRICES[cat as SeatCategory]}</span>
                      </div>
                    );
                  })}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: T.colors.text.secondary }}>
                    <span>Convenience fee</span><span>₹{CONV_FEE}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: T.colors.text.secondary }}>
                    <span>GST</span><span>₹{Math.round(CONV_FEE * GST_RATE)}</span>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    borderTop: `1px solid ${T.colors.border.default}`,
                    paddingTop: 10, marginTop: 8, fontSize: 16,
                  }}>
                    <span style={{ color: T.colors.text.primary }}>Total</span>
                    <strong style={{ fontFamily: T.fonts.display, fontSize: 22, color: T.colors.text.primary }}>
                      ₹{total + CONV_FEE + Math.round(CONV_FEE * GST_RATE)}
                    </strong>
                  </div>
                </div>
              )}

              <button
                disabled={selected.size === 0}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: T.radius.full,
                  background: selected.size > 0
                    ? `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`
                    : T.colors.bg.surface3,
                  color: selected.size > 0 ? T.colors.tint.white : T.colors.text.muted,
                  border: 'none', fontWeight: 700, fontSize: 16,
                  cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                  fontFamily: T.fonts.body,
                  boxShadow: selected.size > 0 ? T.shadows.glowCrimson : 'none',
                  transition: `all ${T.motion.duration.base}`,
                }}>
                {selected.size > 0 ? `Pay Now →` : 'Select seats to continue'}
              </button>

              <p style={{ fontSize: 11, color: T.colors.text.muted, textAlign: 'center', margin: '12px 0 0' }}>
                By proceeding you agree to BookKaroo's terms. Free reschedule up to 4h before show.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <BottomBar selected={selected} onRemove={handleRemove} total={total} />
    </div>
  );
}
