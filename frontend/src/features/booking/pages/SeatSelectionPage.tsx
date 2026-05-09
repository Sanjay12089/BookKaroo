import { useState, useEffect, useCallback, Fragment } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cn, formatCurrency } from '@/shared/lib/utils';
import { CountdownRing } from '@/shared/components/ui/CountdownRing';
import { useSeatStore } from '../store/seatStore';
import { ROUTES } from '@/shared/constants';

const TOTAL_SECONDS = 8 * 60;

// ── Hardcoded layout (12 rows × 18 cols, aisles after col 6 & 12) ─────────────
type Category = 'recliner' | 'executive' | 'normal';

interface SeatDef { label: string; category: Category; number: number; }
interface RowDef  { letter: string; category: Category; seats: (SeatDef | 'gap')[]; }

const SEAT_PRICES: Record<Category, number> = { recliner: 650, executive: 420, normal: 260 };
const CAT_COLORS: Record<Category, { bg: string; border: string }> = {
  recliner:  { bg: 'rgba(255,215,0,0.14)',    border: 'rgba(255,215,0,0.35)' },
  executive: { bg: 'rgba(65,105,225,0.18)',   border: 'rgba(65,105,225,0.4)' },
  normal:    { bg: 'rgba(228,228,231,0.08)',  border: 'rgba(228,228,231,0.16)' },
};

// Pre-booked seats (for demo realism)
// Pre-booked seats for demo (seat numbers within each row)
const BOOKED: Record<string, number[]> = {
  A: [2,8], B: [4,11], C: [3,9,16], D: [1,7,13], E: [5,12],
  F: [2,6,10,15], G: [4,8,11], H: [1,14], I: [3,7,13], J: [6,9,12], K: [2,5,17], L: [4,15],
};

function buildLayout(): RowDef[] {
  const rows: RowDef[] = [];
  const defs: [string, Category][] = [
    ['A','recliner'],['B','recliner'],
    ['C','executive'],['D','executive'],['E','executive'],['F','executive'],
    ['G','normal'],['H','normal'],['I','normal'],['J','normal'],['K','normal'],['L','normal'],
  ];
  for (const [letter, category] of defs) {
    const seats: RowDef['seats'] = [];
    let seatNum = 0;
    for (let col = 1; col <= 18; col++) {
      if (col === 7 || col === 13) seats.push('gap');
      seatNum++;
      seats.push({ label: `${letter}${seatNum}`, category, number: seatNum });
    }
    rows.push({ letter, category, seats });
  }
  return rows;
}

const LAYOUT = buildLayout();
const CONV_FEE = 59;

// ── Single seat button ─────────────────────────────────────────────────────────
function Seat({ seat, isSelected, isBooked, onToggle }: {
  seat: SeatDef; isSelected: boolean; isBooked: boolean; onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const col = CAT_COLORS[seat.category];
  const canClick = !isBooked;

  return (
    <button
      onClick={canClick ? onToggle : undefined}
      onMouseEnter={() => canClick && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isBooked ? 'Booked' : `${seat.label} · ₹${SEAT_PRICES[seat.category]}`}
      className={cn(
        'w-7 h-[26px] md:w-8 md:h-[28px] rounded-[6px_6px_4px_4px] text-[8px] flex items-center justify-center flex-shrink-0 transition-all duration-100',
        isBooked
          ? 'bg-bg-surface3 border border-border-default opacity-35 cursor-not-allowed'
          : isSelected
          ? 'bg-gradient-to-br from-accent-crimson-light to-accent-crimson text-white border-transparent shadow-[0_0_0_2px_rgba(229,9,20,0.3)]'
          : hovered
          ? 'cursor-pointer scale-110'
          : 'cursor-pointer'
      )}
      style={!isBooked && !isSelected ? { background: hovered ? col.border : col.bg, borderColor: col.border, border: '1px solid' } : undefined}
    >
      {isSelected ? '✓' : seat.number}
    </button>
  );
}

// ── SeatSelectionPage ─────────────────────────────────────────────────────────
export default function SeatSelectionPage() {
  const { showId = '' } = useParams();
  const navigate = useNavigate();
  const { selectSeat, deselectSeat, selectedSeats, clearSeats } = useSeatStore();
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  // Countdown
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  // Clear seats when showId changes
  useEffect(() => { clearSeats(); }, [showId]);

  const handleToggle = useCallback((seatLabel: string, _category: Category) => {
    if (selectedSeats.includes(seatLabel)) deselectSeat(seatLabel);
    else if (selectedSeats.length < 10) selectSeat(showId, seatLabel);
  }, [selectedSeats, showId, selectSeat, deselectSeat]);

  function pickBest(n: number) {
    clearSeats();
    let count = 0;
    for (const row of LAYOUT) {
      for (const cell of row.seats) {
        if (cell === 'gap') continue;
        const s = cell as SeatDef;
        if (!(BOOKED[row.letter] ?? []).includes(s.number)) {
          selectSeat(showId, s.label);
          count++;
          if (count >= n) return;
        }
      }
    }
  }

  const total = selectedSeats.reduce((sum, label) => {
    const row = LAYOUT.find((r) => r.seats.some((s) => s !== 'gap' && (s as SeatDef).label === label));
    return sum + (row ? SEAT_PRICES[row.category] : 0);
  }, 0);
  const convFee = selectedSeats.length * CONV_FEE;
  const gst = Math.round(convFee * 0.18);
  const grand = total + convFee + gst;

  let lastCategory: Category | null = null;

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary font-sans">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between gap-4 px-6 bg-bg-surface/90 backdrop-blur-md border-b border-border-default">
        <div className="flex items-center gap-3">
          <Link to={-1 as never}>
            <button className="px-3 py-1.5 rounded-full bg-bg-surface2 border border-border-default text-text-secondary text-sm">← Back</button>
          </Link>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Seat Selection</p>
            <p className="font-semibold text-sm text-text-primary">Show ID: {showId.slice(0, 8)}…</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-bg-surface border border-border-strong">
          <CountdownRing totalSeconds={TOTAL_SECONDS} remainingSeconds={remaining} size={44} strokeWidth={4} />
          <div className="text-[10px] text-text-muted uppercase tracking-wider">Hold expires</div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 md:px-6 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Seat grid */}
          <section className="p-4 md:p-8 rounded-xl bg-[radial-gradient(80%_60%_at_50%_0%,rgba(99,102,241,0.14),transparent_60%)] bg-bg-surface border border-border-default overflow-x-auto">
            {/* Screen */}
            <div className="text-center mb-8">
              <div className="w-[70%] max-w-[540px] mx-auto h-6 rounded-[50%/100%_100%_0_0] bg-gradient-to-b from-white/90 to-white/20 [filter:drop-shadow(0_-8px_20px_rgba(255,255,255,0.35))] [transform:perspective(400px)_rotateX(40deg)]" />
              <p className="font-mono text-[10px] tracking-widest text-text-muted mt-4 uppercase">— ALL EYES THIS WAY —</p>
            </div>

            {/* Quick pick */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-text-muted">Quick pick:</span>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button key={n} onClick={() => pickBest(n)}
                  className={cn('w-7 h-7 rounded-md text-xs font-semibold transition-all', selectedSeats.length === n
                    ? 'bg-gradient-to-br from-accent-indigo to-accent-purple text-white'
                    : 'bg-bg-surface2 border border-border-default text-text-secondary hover:text-text-primary')}>
                  {n}
                </button>
              ))}
            </div>

            {/* Rows */}
            <div>
              {LAYOUT.map((row) => {
                const showLabel = row.category !== lastCategory;
                lastCategory = row.category;
                return (
                  <Fragment key={row.letter}>
                    {showLabel && (
                      <div className="flex items-center gap-3 my-4 pl-8">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CAT_COLORS[row.category].border }} />
                        <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">{row.category}</span>
                        <span className="font-mono text-[10px] text-text-muted ml-auto pr-3">₹{SEAT_PRICES[row.category]}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-1.5 px-1">
                      <span className="font-mono text-[10px] text-text-muted w-5 text-center flex-shrink-0">{row.letter}</span>
                      <div className="flex gap-1 justify-center flex-wrap">
                        {row.seats.map((cell, ci) => {
                          if (cell === 'gap') return <span key={ci} className="w-3 flex-shrink-0" />;
                          const s = cell as SeatDef;
                          const isBooked = (BOOKED[row.letter] ?? []).includes(s.number);
                          const isSelected = selectedSeats.includes(s.label);
                          return (
                            <Seat key={s.label} seat={s} isSelected={isSelected} isBooked={isBooked}
                              onToggle={() => handleToggle(s.label, row.category)} />
                          );
                        })}
                      </div>
                      <span className="font-mono text-[10px] text-text-muted w-5 text-center flex-shrink-0">{row.letter}</span>
                    </div>
                  </Fragment>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 flex-wrap mt-6 p-4 rounded-lg bg-bg-surface2 border border-border-default text-xs">
              {[
                { label: 'Recliner', ...CAT_COLORS.recliner },
                { label: 'Executive', ...CAT_COLORS.executive },
                { label: 'Normal', ...CAT_COLORS.normal },
                { label: 'Selected', bg: '#E50914', border: 'transparent' },
                { label: 'Booked', bg: '#232C44', border: '#3f3f46', opacity: 0.5 },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-text-secondary">
                  <span className="w-3.5 h-3.5 rounded-[4px] inline-block" style={{ background: item.bg, border: `1px solid ${item.border}`, opacity: (item as { opacity?: number }).opacity ?? 1 }} />
                  {item.label}
                </span>
              ))}
            </div>
          </section>

          {/* Aside summary */}
          <aside className="sticky top-20 self-start">
            <div className="p-5 rounded-xl bg-bg-surface border border-border-default">
              <h4 className="font-semibold text-sm mb-4">Selected Seats</h4>

              {/* Seat chips */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px] mb-4">
                {selectedSeats.length === 0
                  ? <p className="text-xs text-text-muted">Tap seats to select</p>
                  : selectedSeats.map((label) => (
                    <span key={label} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-indigo/14 text-[#A5B4FC] border border-accent-indigo/28 text-[11px] font-semibold font-mono">
                      {label}
                      <button onClick={() => deselectSeat(label)} className="text-[#A5B4FC] hover:text-white ml-0.5">×</button>
                    </span>
                  ))
                }
              </div>

              {/* Price breakdown */}
              {selectedSeats.length > 0 && (
                <div className="space-y-1.5 text-sm font-sans p-3 rounded-lg bg-bg-base border border-border-default mb-4">
                  <div className="flex justify-between text-text-secondary"><span>{selectedSeats.length} ticket{selectedSeats.length > 1 ? 's' : ''}</span><span>₹{total}</span></div>
                  <div className="flex justify-between text-text-secondary"><span>Convenience fee</span><span>₹{convFee}</span></div>
                  <div className="flex justify-between text-text-secondary"><span>GST 18%</span><span>₹{gst}</span></div>
                  <div className="flex justify-between border-t border-border-default pt-2 mt-2 font-semibold text-base text-text-primary">
                    <span>Total</span>
                    <span className="font-display text-xl">{formatCurrency(grand)}</span>
                  </div>
                </div>
              )}

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => navigate(ROUTES.CHECKOUT)}
                className={cn(
                  'w-full py-3.5 rounded-full font-semibold text-base transition-all',
                  selectedSeats.length > 0
                    ? 'bg-gradient-to-r from-accent-crimson-light to-accent-crimson text-white shadow-[0_10px_40px_-10px_rgba(229,9,20,0.55)] hover:-translate-y-0.5'
                    : 'bg-bg-surface3 text-text-muted cursor-not-allowed'
                )}
              >
                {selectedSeats.length > 0 ? `Pay Now · ${formatCurrency(grand)} →` : 'Select seats'}
              </button>

              <p className="text-[10px] text-text-muted text-center mt-3 leading-relaxed">
                Free reschedule up to 4h before show. Convenience fee non-refundable.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
