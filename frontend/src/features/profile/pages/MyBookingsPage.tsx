import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { GlassCard } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useMyBookings } from '@/features/booking/api/useBooking';
import { ROUTES } from '@/shared/constants';
import { formatDate, formatCurrency } from '@/shared/lib/utils';
import type { Booking } from '@/shared/types';

const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  Confirmed:  { label: 'CONFIRMED',  className: 'bg-semantic-success/12 text-[#6EE7B7] border border-semantic-success/28' },
  Completed:  { label: 'COMPLETED',  className: 'bg-bg-surface3 text-text-muted border border-border-default' },
  Cancelled:  { label: 'CANCELLED',  className: 'bg-accent-crimson/12 text-[#FF6770] border border-accent-crimson/25' },
  Pending:    { label: 'PENDING',    className: 'bg-semantic-warning/12 text-[#FCD34D] border border-semantic-warning/28' },
};

function BookingCard({ booking }: { booking: Booking }) {
  const style = STATUS_STYLE[booking.status] ?? STATUS_STYLE.Pending;
  const canCancel = booking.status === 'Confirmed';

  return (
    <div className="p-5 rounded-xl bg-bg-surface border border-border-default hover:border-border-strong transition-colors">
      <div className="flex gap-5 items-start">
        {/* Poster placeholder */}
        <div className="w-16 aspect-[2/3] rounded-lg bg-gradient-to-br from-accent-indigo/40 to-accent-purple/40 flex-shrink-0 flex items-center justify-center text-2xl">
          🎬
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-sans ${style.className}`}>
              {style.label}
            </span>
          </div>

          <p className="font-display font-semibold text-lg text-text-primary leading-snug">{booking.bookingRef}</p>
          <p className="text-sm text-text-secondary font-sans mt-1">{formatDate(booking.createdAt)}</p>
          <p className="text-sm text-text-muted font-sans">{booking.ticketQty} ticket{booking.ticketQty > 1 ? 's' : ''}</p>

          <div className="flex gap-3 mt-3 flex-wrap">
            <Link to={`/booking/confirmed?ref=${booking.bookingRef}`}>
              <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-crimson-light to-accent-crimson text-white text-xs font-semibold font-sans">
                View Ticket →
              </button>
            </Link>
            {canCancel && (
              <button className="text-xs text-semantic-error font-sans underline">Cancel Booking</button>
            )}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="font-display font-semibold text-xl text-text-primary">
            {formatCurrency(booking.amountPaid)}
          </div>
          <p className="text-xs font-mono text-text-muted mt-1">{booking.bookingRef}</p>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { user } = useAuthStore();
  const { data: bookings, isLoading } = useMyBookings();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = (bookings ?? []).filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const past = (bookings ?? []).filter(b => b.status !== 'Confirmed' && b.status !== 'Pending');
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <PublicLayout>
      <div className="max-w-[960px] mx-auto px-6 py-10">
        {/* Profile header */}
        <header className="flex items-center gap-5 pb-8 mb-8 border-b border-border-default">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <h1 className="font-display font-semibold text-2xl text-text-primary">{user?.name}</h1>
            <p className="text-text-muted text-sm font-sans">{user?.email}</p>
          </div>
          <div className="ml-auto">
            <Link to={ROUTES.PROFILE}>
              <button className="px-4 py-2 rounded-full bg-bg-surface border border-border-default text-sm text-text-secondary hover:text-text-primary transition-colors font-sans">
                Edit Profile
              </button>
            </Link>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: String((bookings ?? []).length) },
            { label: 'Upcoming',       value: String(upcoming.length) },
            { label: 'Total Spent',    value: formatCurrency((bookings ?? []).reduce((s, b) => s + b.amountPaid, 0)) },
          ].map(({ label, value }) => (
            <GlassCard key={label} style={{ padding: "16px 20px" }}>
              <div className="font-display font-semibold text-2xl text-text-primary">{value}</div>
              <div className="text-[11px] text-text-muted uppercase tracking-wider mt-1 font-sans">{label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border-default mb-6">
          {(['upcoming', 'past'] as const).map((t) => {
            const count = t === 'upcoming' ? upcoming.length : past.length;
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`relative px-4 py-3 text-sm font-medium font-sans capitalize transition-colors ${
                  tab === t ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}>
                {t}
                <span className="ml-2 text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-bg-surface2 text-text-muted">{count}</span>
                {tab === t && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-crimson rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Booking list */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={120} className="rounded-xl" />)}
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-4xl mb-3">🎬</span>
            <p className="text-text-secondary font-sans">No {tab} bookings</p>
            <Link to={ROUTES.MOVIES} className="mt-4">
              <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold font-sans">
                Browse Movies
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
