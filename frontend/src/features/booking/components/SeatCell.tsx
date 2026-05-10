import { cn } from '@/shared/lib/utils';
import type { SeatState } from '@/shared/types';

interface Props {
  label:   string;
  state:   SeatState;
  color:   string;
  onClick: () => void;
}

export function SeatCell({ label, state, color, onClick }: Props) {
  const unavailable = state === 'booked' || state === 'locked';

  return (
    <button
      disabled={unavailable}
      onClick={onClick}
      title={unavailable ? (state === 'locked' ? 'Held by another user' : 'Booked') : label}
      aria-label={`Seat ${label} — ${state}`}
      className={cn(
        'w-7 h-7 md:w-8 md:h-8 rounded flex items-center justify-center text-[8px] font-mono font-semibold flex-shrink-0 transition-all duration-150',
        state === 'available' && 'hover:scale-110 cursor-pointer',
        state === 'selected'  && 'cursor-pointer ring-2 ring-white/30 shadow-[0_0_0_2px_rgba(229,9,20,0.3)]',
        state === 'booked'    && 'cursor-not-allowed opacity-40',
        state === 'locked'    && 'cursor-not-allowed'
      )}
      style={
        state === 'available' ? { background: color + '33', border: `1px solid ${color}66` } :
        state === 'selected'  ? { background: '#E50914', border: 'none', color: '#fff' } :
        state === 'booked'    ? { background: '#232C44', border: '1px solid #3f3f46' } :
        /* locked */            { background: 'rgba(245,158,11,0.5)', border: '1px solid rgba(245,158,11,0.7)' }
      }
    >
      {state === 'selected' ? '✓'
        : state === 'locked' ? <span style={{ fontSize: 8 }}>🔒</span>
        : null}
    </button>
  );
}
