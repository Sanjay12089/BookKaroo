import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';
import type { Booking, PaginatedResponse, BookingStatus } from '@/shared/types';

type ApiError = { response?: { status?: number }; statusCode?: number };

const STATUS_BADGE: Record<BookingStatus, string> = {
  Confirmed: 'bg-semantic-success/15 text-semantic-success',
  Pending: 'bg-amber-500/15 text-amber-400',
  Cancelled: 'bg-semantic-error/15 text-semantic-error',
  Refunded: 'bg-bg-surface3 text-text-muted',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function AdminBookingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () =>
      api.get<PaginatedResponse<Booking>>('/api/admin/bookings').then((r) => r.data),
    retry: false,
  });

  const is501 =
    (error as ApiError | null)?.response?.status === 501 ||
    (error as ApiError | null)?.statusCode === 501;

  const bookings: Booking[] = Array.isArray(data)
    ? (data as Booking[])
    : ((data as PaginatedResponse<Booking> | undefined)?.items ?? []);

  const showEmpty = is501 || (!isLoading && !error && bookings.length === 0);
  const showError = !isLoading && !!error && !is501;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Bookings</h1>
            <p className="text-text-muted text-sm font-sans">View and manage all ticket bookings.</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64 text-text-muted text-sm font-sans">
            Loading bookings…
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-4xl">🎟</p>
            <p className="text-text-secondary font-sans text-base">No bookings found yet.</p>
          </div>
        )}

        {showError && (
          <div className="flex items-center justify-center h-64 text-semantic-error text-sm font-sans">
            Failed to load bookings. Please try again.
          </div>
        )}

        {!isLoading && !showEmpty && !showError && bookings.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full text-sm font-sans">
              <thead className="bg-bg-surface2 border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Ref #</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Show</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Seats</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-text-primary font-semibold">
                      {booking.bookingRef}
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs truncate max-w-[120px]">
                      {booking.userId}
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs truncate max-w-[120px]">
                      {booking.showId}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{booking.ticketQty}</td>
                    <td className="px-4 py-3 text-text-primary font-semibold">{formatCurrency(booking.amountPaid)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_BADGE[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <button disabled className="text-xs text-accent-indigo opacity-40 cursor-not-allowed font-semibold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
