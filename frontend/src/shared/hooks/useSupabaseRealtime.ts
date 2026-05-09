import { useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

interface SeatEvent {
  type: 'seat_locked' | 'seat_unlocked' | 'seat_booked';
  seatLabel: string;
  userId?: string;
}

export function useShowRealtime(showId: string | null, onEvent: (event: SeatEvent) => void) {
  useEffect(() => {
    if (!showId) return;

    const channel = supabase
      .channel(`show:${showId}`)
      .on('broadcast', { event: 'seat_locked' }, ({ payload }) =>
        onEvent({ type: 'seat_locked', seatLabel: payload.seatLabel as string, userId: payload.userId as string | undefined })
      )
      .on('broadcast', { event: 'seat_unlocked' }, ({ payload }) =>
        onEvent({ type: 'seat_unlocked', seatLabel: payload.seatLabel as string })
      )
      .on('broadcast', { event: 'seat_booked' }, ({ payload }) =>
        onEvent({ type: 'seat_booked', seatLabel: payload.seatLabel as string })
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [showId, onEvent]);
}
