import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { ROUTES, TMDB_POSTER } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';

export default function ConfirmationPage() {
  const navigate         = useNavigate();
  const { bookingDetail, orderResponse, contactEmail, clearAll } = useCheckoutStore();

  // If no booking detail, fall back to orderResponse or redirect
  useEffect(() => {
    if (!bookingDetail && !orderResponse) navigate('/');
  }, []);

  const detail = bookingDetail;
  const ref    = detail?.bookingRef ?? orderResponse?.bookingRef ?? '';

  function handleDone() {
    clearAll();
    navigate(ROUTES.HOME);
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans flex flex-col items-center justify-start py-10 px-4">
      {/* Success badge */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-semantic-success/15 border-2 border-semantic-success/40 flex items-center justify-center text-4xl mb-4 animate-[bounce_0.5s_ease]">
          ✓
        </div>
        <h1 className="font-display font-black text-3xl text-text-primary mb-1">Booking Confirmed!</h1>
        <p className="text-text-muted font-sans text-sm">
          {contactEmail ? `Confirmation sent to ${contactEmail}` : 'Your booking is confirmed.'}
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Booking ref */}
        <div className="p-5 rounded-xl bg-bg-surface border border-border-default text-center">
          <p className="text-[11px] text-text-muted font-sans uppercase tracking-widest mb-1">Booking Reference</p>
          <p className="font-mono font-bold text-2xl text-text-primary tracking-widest">{ref}</p>
          {detail?.invoiceNumber && (
            <p className="text-[11px] text-text-muted font-sans mt-1">Invoice: {detail.invoiceNumber}</p>
          )}
        </div>

        {/* Movie + show details */}
        {detail && (
          <div className="p-5 rounded-xl bg-bg-surface border border-border-default">
            <div className="flex gap-4">
              {detail.movie.posterUrl && (
                <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={TMDB_POSTER(detail.movie.posterUrl, 'w185')}
                    alt={detail.movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-base leading-tight">{detail.movie.title}</p>
                <p className="text-sm text-text-secondary font-sans mt-0.5">
                  {detail.movie.format} · {detail.movie.language}
                </p>
                <p className="text-sm text-text-secondary font-sans">{detail.show.venueName}</p>
                <p className="text-sm text-text-muted font-sans">{detail.show.date} · {detail.show.time}</p>
              </div>
            </div>

            {/* Seats */}
            <div className="mt-3 pt-3 border-t border-border-default flex flex-wrap gap-1.5">
              {detail.seats.map((s) => (
                <span
                  key={s.label}
                  className="px-2 py-0.5 rounded bg-accent-indigo/10 border border-accent-indigo/20 text-[11px] font-mono text-[#A5B4FC] uppercase"
                >
                  {s.label} · {s.category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* QR code */}
        {detail?.qrUrl && (
          <div className="p-5 rounded-xl bg-bg-surface border border-border-default flex flex-col items-center">
            <p className="text-[11px] text-text-muted font-sans uppercase tracking-widest mb-3">M-Ticket QR</p>
            <img
              src={detail.qrUrl}
              alt="QR code"
              className="w-44 h-44 rounded-lg border border-border-default"
            />
            <p className="text-[10px] text-text-muted font-sans mt-2 text-center">
              Show this at the cinema entrance
            </p>
          </div>
        )}

        {/* Amount paid */}
        {detail && (
          <div className="p-4 rounded-xl bg-bg-surface border border-border-default flex justify-between items-center">
            <span className="text-sm text-text-secondary font-sans">Amount Paid</span>
            <span className="font-display font-bold text-xl text-accent-crimson">
              ₹{detail.pricing.amountPaid}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDone}
            className={cn(
              'w-full py-3.5 rounded-xl font-semibold text-base font-sans',
              'bg-gradient-to-r from-accent-crimson-light to-accent-crimson text-white',
              'shadow-[0_10px_40px_-10px_rgba(229,9,20,0.55)] hover:-translate-y-0.5 transition-all'
            )}
          >
            Back to Home
          </button>
          <Link to={ROUTES.MY_BOOKINGS} className="w-full">
            <button className="w-full py-3 rounded-xl border border-border-default text-sm font-sans text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors">
              View My Bookings
            </button>
          </Link>
        </div>

        <p className="text-center text-[10px] text-text-muted font-sans mt-2 leading-relaxed">
          Free reschedule up to 4 hours before show.
          Convenience fee is non-refundable.
        </p>
      </div>
    </div>
  );
}
