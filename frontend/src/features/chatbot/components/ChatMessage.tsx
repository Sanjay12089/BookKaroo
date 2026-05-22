import { useNavigate } from 'react-router-dom';
import type { ChatMessage as ChatMsg } from '../types';
import { ChatShowCard } from './ChatShowCard';
import { ChatEventCard } from './ChatEventCard';
import { ChatBookingCard } from './ChatBookingCard';

interface Props {
  msg: ChatMsg;
}

export function ChatMessageBubble({ msg }: Props) {
  const navigate = useNavigate();
  const isUser = msg.role === 'user';

  const hasCards =
    (msg.shows && msg.shows.length > 0) ||
    (msg.events && msg.events.length > 0) ||
    (msg.bookings && msg.bookings.length > 0);

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-accent-crimson text-white rounded-br-sm'
            : 'bg-[#1e2436] text-text-primary rounded-bl-sm'
        }`}
      >
        {msg.content}
      </div>

      {!isUser && hasCards && (
        <div className="w-full overflow-x-auto pb-1 snap-x snap-mandatory">
          <div className="flex gap-3 px-1">
            {msg.shows?.map((card) => (
              <ChatShowCard key={card.showId} card={card} />
            ))}
            {msg.events?.map((card) => (
              <ChatEventCard key={card.eventId} card={card} />
            ))}
            {msg.bookings?.map((card) => (
              <ChatBookingCard key={card.bookingRef} card={card} />
            ))}
          </div>
        </div>
      )}

      {!isUser && msg.actionType === 'navigate' && msg.actionUrl && (
        <button
          onClick={() => navigate(msg.actionUrl!)}
          className="text-accent-indigo text-xs font-semibold hover:underline"
        >
          Go there →
        </button>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="bg-[#1e2436] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
