import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { TMDB_POSTER } from '@/shared/constants';
import { formatIndianCurrency } from './KpiCard';
import type { RecentBookingDto } from '../types';

const STATUS_STYLE: Record<string, string> = {
  Confirmed: 'bg-success-bg/15 text-success',
  Cancelled: 'bg-error-bg/15 text-error',
  Pending:   'bg-brand/12 text-[#A5B4FC]',
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

interface Props {
  bookings:  RecentBookingDto[];
  isLoading: boolean;
}

export function RecentBookingsTable({ bookings, isLoading }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Skeleton className="w-8 h-12 rounded" />
            <div className="flex-1 space-y-1.5">
              <Skeleton height={12} width="60%" />
              <Skeleton height={10} width="40%" />
            </div>
            <Skeleton height={12} width={60} />
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <p className="text-tx-muted text-sm font-sans text-center py-8">No recent bookings</p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm font-sans min-w-[640px]">
        <thead>
          <tr className="border-b border-border-l">
            {['Booking', 'Movie', 'Show Details', 'Amount', 'Status', 'Date'].map((h) => (
              <th key={h} className="px-2 py-2 text-left text-[11px] font-semibold text-tx-muted uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr
              key={b.bookingRef}
              onClick={() => navigate(`/admin/bookings/${b.bookingRef}`)}
              className={`cursor-pointer hover:bg-section transition-colors border-b border-border-l/50
                ${i % 2 === 0 ? 'bg-page' : 'bg-card'}`}
            >
              <td className="px-2 py-2.5 font-mono text-[11px] text-tx-secondary">
                {b.bookingRef}
              </td>
              <td className="px-2 py-2.5">
                <div className="flex items-center gap-2">
                  {b.posterUrl ? (
                    <img
                      src={b.posterUrl.startsWith('/') ? TMDB_POSTER(b.posterUrl, 'w92') : b.posterUrl}
                      alt=""
                      className="w-8 h-12 object-cover rounded-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-12 bg-section rounded-sm flex-shrink-0 flex items-center justify-center text-tx-muted text-xs">
                      ?
                    </div>
                  )}
                  <span className="text-[13px] font-medium text-tx-primary max-w-[120px] truncate">
                    {b.movieTitle ?? 'Unknown'}
                  </span>
                </div>
              </td>
              <td className="px-2 py-2.5">
                <p className="text-[12px] text-tx-secondary line-clamp-1">{b.venueName}</p>
                <p className="text-[11px] text-tx-muted">{b.showDate} {b.showTime}</p>
              </td>
              <td className="px-2 py-2.5 text-[13px] text-tx-primary text-right">
                {formatIndianCurrency(b.amountPaid)}
              </td>
              <td className="px-2 py-2.5">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase
                  ${STATUS_STYLE[b.status] ?? 'bg-section text-tx-muted'}`}>
                  {b.status}
                </span>
              </td>
              <td className="px-2 py-2.5 text-[11px] text-tx-muted whitespace-nowrap">
                {relativeTime(b.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
