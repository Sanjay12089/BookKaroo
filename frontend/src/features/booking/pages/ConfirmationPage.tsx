import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { useBookingDetail } from '../api/useBooking';
import { ROUTES, TMDB_POSTER } from '@/shared/constants';
import { formatCurrency } from '@/shared/lib/utils';

// ── Confetti particle ─────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  '#E50914', '#6366F1', '#A855F7', '#F59E0B', '#10B981',
  '#EC4899', '#3B82F6', '#14B8A6', '#F97316', '#84CC16',
  '#E50914', '#6366F1',
];

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {CONFETTI_COLORS.map((color, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            background: color,
            left: `${8 + (i * 7.5) % 84}%`,
            top: '-8px',
            animation: `confettiFall 1.5s ${i * 0.12}s ease-out forwards`,
            transform: 'rotate(0deg)',
          }}
        />
      ))}
    </div>
  );
}

// ── QR placeholder (7×7 dot grid) ────────────────────────────────────────────

function QrPlaceholder() {
  const dots = Array.from({ length: 49 }, (_, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
    const dark = isCorner || Math.random() > 0.5;
    return dark;
  });

  return (
    <div className="grid grid-cols-7 gap-0.5 p-2 bg-white rounded-xl" style={{ width: 140, height: 140 }}>
      {dots.map((dark, i) => (
        <div
          key={i}
          className={`rounded-sm ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}
        />
      ))}
    </div>
  );
}

// ── Ticket card notch ─────────────────────────────────────────────────────────

function TicketNotch({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className="absolute w-6 h-6 rounded-full bg-bg-base z-10"
      style={{
        top: 'calc(45% - 12px)',
        [side]: '-12px',
      }}
    />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConfirmationPage() {
  const navigate  = useNavigate();
  const { bookingDetail, orderResponse, contactEmail, clearAll } = useCheckoutStore();

  const ref        = bookingDetail?.bookingRef ?? orderResponse?.bookingRef ?? '';
  const { data: fetched } = useBookingDetail(ref && !bookingDetail ? ref : '');
  const detail     = bookingDetail ?? fetched ?? null;

  const stampShown = useRef(false);

  useEffect(() => {
    if (!bookingDetail && !orderResponse) {
      navigate('/');
    }
  }, []);

  // ── Calendar ICS ──────────────────────────────────────────────────────────
  function handleAddToCalendar() {
    if (!detail) return;
    const show = detail.show;

    const dtStr  = `${show.date.replace(/-/g, '')}T${show.time.replace(':', '')}00`;
    const ics    = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${dtStr}`,
      `SUMMARY:🎬 ${detail.movie.title} at ${show.venueName}`,
      `DESCRIPTION:Booking: ${detail.bookingRef}\\nSeats: ${detail.seats.map(s => s.label).join(', ')}\\nScreen: ${show.screenName}`,
      `LOCATION:${show.venueName}, ${show.city}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${detail.bookingRef}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── WhatsApp share ────────────────────────────────────────────────────────
  function handleWhatsApp() {
    if (!detail) return;
    const msg = [
      '🎬 *BookKaroo Booking Confirmed!*',
      '',
      `*Movie:* ${detail.movie.title}`,
      `*Date:* ${detail.show.date}`,
      `*Time:* ${detail.show.time}`,
      `*Venue:* ${detail.show.venueName}`,
      `*Seats:* ${detail.seats.map(s => s.label).join(', ')}`,
      `*Booking ID:* ${detail.bookingRef}`,
    ].join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function handleDone() {
    clearAll();
    navigate(ROUTES.HOME);
  }

  // ── Framer-motion variants ────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const pricing = detail?.pricing;

  return (
    <>
      {/* Confetti keyframe */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0)    rotate(0deg)   opacity: 1; }
          100% { transform: translateY(520px) rotate(720deg); opacity: 0; }
        }
        @keyframes stampIn {
          0%   { transform: scale(2) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(0.95) rotate(-15deg); opacity: 1; }
          100% { transform: scale(1) rotate(-15deg); opacity: 1; }
        }
      `}</style>

      <div className="min-h-screen bg-bg-base text-text-primary font-sans pb-16 overflow-x-hidden">
        <motion.div
          className="max-w-[480px] mx-auto px-4 pt-10 relative"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Confetti */}
          <div className="relative h-0">
            <Confetti />
          </div>

          {/* ── Hero section ── */}
          <motion.div className="flex flex-col items-center mb-8" variants={itemVariants}>
            <motion.div
              className="w-20 h-20 rounded-full bg-semantic-success/20 border-[3px] border-semantic-success flex items-center justify-center text-4xl text-semantic-success mb-5"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{ duration: 0.5, times: [0, 0.7, 1] }}
            >
              ✓
            </motion.div>

            {/* Logo wordmark */}
            <div className="font-display font-bold text-xl mb-4">
              <span className="text-text-primary">Book</span>
              <span className="text-accent-crimson">Karoo</span>
            </div>

            <h1 className="font-display font-black text-3xl text-semantic-success text-center leading-tight mb-3">
              Booking Confirmed!
            </h1>

            <div className="px-4 py-1.5 rounded-full bg-bg-surface2 border border-border-default font-mono text-sm text-text-primary tracking-widest">
              {ref || 'BK-XXXXXXXX'}
            </div>
          </motion.div>

          {/* ── Ticket card ── */}
          <motion.div variants={itemVariants} className="mb-5">
            <div
              className="relative rounded-[20px] overflow-hidden border border-border-default"
              style={{
                background: 'linear-gradient(135deg, var(--color-bg-surface2, #16213e), var(--color-bg-surface3, #1a1a2e))',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Notch cutouts */}
              <TicketNotch side="left" />
              <TicketNotch side="right" />

              {/* Dashed tear line */}
              <div
                className="absolute left-4 right-4 border-t-2 border-dashed border-border-default"
                style={{ top: '45%' }}
              />

              {/* Top half */}
              <div className="p-6 pb-8" style={{ minHeight: '45%' }}>
                <div className="flex gap-4">
                  {/* Poster */}
                  <div className="w-[68px] flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-bg-surface2">
                    {detail?.movie.posterUrl
                      ? <img src={TMDB_POSTER(detail.movie.posterUrl, 'w185')} alt={detail.movie.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-accent-indigo/40 to-accent-purple/40 flex items-center justify-center text-2xl">🎬</div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black text-lg text-text-primary leading-tight mb-1 truncate">
                      {detail?.movie.title ?? 'Movie Ticket'}
                    </p>
                    <p className="text-[13px] text-text-secondary font-sans">
                      {detail?.show.date} · {detail?.show.time}
                    </p>
                    <p className="text-[13px] text-text-muted font-sans mt-0.5 leading-snug">
                      {detail?.show.venueName}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded bg-bg-surface border border-border-default text-[11px] font-mono text-text-secondary uppercase">
                        {detail?.show.screenName ?? 'SCREEN'}
                      </span>
                      {detail?.seats.map(s => (
                        <span key={s.label} className="px-2 py-0.5 rounded bg-accent-indigo/10 border border-accent-indigo/20 text-[11px] font-mono text-[#A5B4FC] uppercase">
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* BOOKING CONFIRMED stamp */}
                  <div
                    className="absolute top-4 right-5 text-center select-none"
                    style={{
                      border: '2px solid #E50914',
                      borderRadius: 8,
                      padding: '4px 10px',
                      transform: 'rotate(-15deg)',
                      color: '#E50914',
                      animation: stampShown.current ? 'none' : 'stampIn 0.5s 0.8s cubic-bezier(0.34,1.56,0.64,1) both',
                    }}
                    ref={() => { stampShown.current = true; }}
                  >
                    <div className="text-[9px] font-black tracking-widest leading-tight">BOOKING</div>
                    <div className="text-[9px] font-black tracking-widest leading-tight">CONFIRMED</div>
                  </div>
                </div>
              </div>

              {/* Bottom half — QR */}
              <div className="flex flex-col items-center px-6 pt-8 pb-6">
                {detail?.qrUrl
                  ? <img src={detail.qrUrl} alt="QR code" width={140} height={140} className="rounded-xl bg-white p-2" />
                  : <QrPlaceholder />
                }
                <p className="text-[10px] text-text-muted font-sans tracking-widest uppercase mt-2">
                  Scan at entry counter
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Action buttons ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 mb-5">
            <button
              onClick={() => detail?.invoiceUrl && window.open(detail.invoiceUrl, '_blank')}
              disabled={!detail?.invoiceUrl}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-bg-surface border border-border-default text-center disabled:opacity-40 hover:border-border-strong transition-colors"
              title={!detail?.invoiceUrl ? 'Invoice generating...' : 'Download Invoice'}
            >
              <span className="text-xl">📄</span>
              <span className="text-[10px] font-sans text-text-secondary leading-tight">Download{'\n'}Invoice</span>
            </button>

            <button
              onClick={handleAddToCalendar}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-bg-surface border border-border-default text-center hover:border-border-strong transition-colors"
            >
              <span className="text-xl">📅</span>
              <span className="text-[10px] font-sans text-text-secondary leading-tight">Add to{'\n'}Calendar</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-bg-surface border border-border-default text-center hover:border-border-strong transition-colors"
            >
              <span className="text-xl">💬</span>
              <span className="text-[10px] font-sans text-text-secondary leading-tight">Share on{'\n'}WhatsApp</span>
            </button>
          </motion.div>

          {/* ── Order summary ── */}
          {pricing && (
            <motion.div variants={itemVariants} className="mb-5 p-5 rounded-xl bg-bg-surface border border-border-default">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold font-sans text-text-primary">Amount Paid</span>
                <span className="font-display font-bold text-2xl text-accent-crimson">
                  {formatCurrency(pricing.amountPaid)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div>
                  <p className="text-[10px] text-text-muted font-sans uppercase tracking-wider mb-1">Booked</p>
                  <p className="text-xs font-sans text-text-secondary">{detail?.createdAt ? new Date(detail.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-sans uppercase tracking-wider mb-1">Payment</p>
                  <p className="text-xs font-sans text-text-secondary">{detail?.payment.method ?? 'Mock'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-sans uppercase tracking-wider mb-1">Ref #</p>
                  <p className="text-xs font-mono text-text-secondary">{ref.slice(-6)}</p>
                </div>
              </div>
              <div className="border-t border-border-default pt-4 space-y-2">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-text-muted">Ticket Amount</span>
                  <span className="text-text-secondary">{formatCurrency(pricing.ticketAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-text-muted">Convenience Fee</span>
                  <span className="text-text-secondary">{formatCurrency(pricing.convenienceFee + pricing.convenienceFeeGst)}</span>
                </div>
                {pricing.offerProcessingFee > 0 && (
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-text-muted">Offer Processing Fee</span>
                    <span className="text-text-secondary">{formatCurrency(pricing.offerProcessingFee + pricing.offerProcessingFeeGst)}</span>
                  </div>
                )}
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-semantic-success">Discount</span>
                    <span className="text-semantic-success">-{formatCurrency(pricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-sans pt-1 border-t border-border-default">
                  <span className="font-semibold text-text-primary">Total Paid</span>
                  <span className="font-bold text-accent-crimson">{formatCurrency(pricing.amountPaid)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Important instructions ── */}
          <motion.div variants={itemVariants} className="mb-5 p-5 rounded-xl bg-bg-surface border border-border-default">
            <p className="text-[11px] text-text-muted font-sans uppercase tracking-widest mb-3">Important Instructions</p>
            <ul className="space-y-2 text-sm text-text-secondary font-sans list-disc list-inside leading-relaxed">
              <li>Carry a valid government-issued photo ID — checked at the venue.</li>
              <li>Cancellation allowed if show is more than 2 hours away. Convenience fee non-refundable.</li>
              <li>Outside food and beverages not allowed inside the venue.</li>
              <li>Show QR code at the entry counter.</li>
            </ul>
          </motion.div>

          {/* ── CTA buttons ── */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <Link to={ROUTES.MY_BOOKINGS} className="w-full">
              <button className="w-full py-3.5 rounded-xl border border-border-default text-sm font-semibold font-sans text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors">
                View My Bookings →
              </button>
            </Link>
            <button
              onClick={handleDone}
              className="w-full py-3 rounded-xl text-sm font-sans text-text-muted hover:text-text-secondary transition-colors"
            >
              Back to Home
            </button>
          </motion.div>

          {contactEmail && (
            <motion.p variants={itemVariants} className="text-center text-[11px] text-text-muted font-sans mt-4 leading-relaxed">
              Confirmation & invoice sent to {contactEmail}
            </motion.p>
          )}
        </motion.div>
      </div>
    </>
  );
}
