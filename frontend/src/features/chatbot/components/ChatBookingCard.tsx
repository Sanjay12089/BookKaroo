import { Link } from 'react-router-dom';
import type { ChatbotBookingCard } from '../types';

interface Props {
  card: ChatbotBookingCard;
}

export function ChatBookingCard({ card }: Props) {
  return (
    <div className="flex gap-3 bg-bg-card border border-white/10 rounded-xl p-3 min-w-[260px] max-w-[280px] flex-shrink-0 snap-start">
      {card.posterUrl && (
        <img
          src={card.posterUrl}
          alt={card.title}
          className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
        />
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-text-primary font-semibold text-sm leading-tight line-clamp-2">
          {card.title}
        </p>
        <p className="text-text-muted text-xs">
          {card.showDate} · {card.showTime}
        </p>
        <p className="text-text-muted text-xs line-clamp-1">{card.venueName}</p>
        <p className="text-text-muted text-xs">
          {card.ticketQty} ticket{card.ticketQty !== 1 ? 's' : ''} · ₹{card.amountPaid.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-text-muted font-mono">{card.bookingRef}</p>
        <Link
          to="/profile/bookings"
          className="mt-auto inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full text-center hover:bg-white/20 transition-colors"
        >
          View Booking
        </Link>
      </div>
    </div>
  );
}
