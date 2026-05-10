import { useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';

export function useShowRealtime(
  showId:          string | null,
  onSeatLocked:    (seats: string[]) => void,
  onSeatUnlocked:  (seats: string[]) => void,
) {
  useEffect(() => {
    if (!showId) return;

    const channel = supabase
      .channel(`show-${showId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'seat_locks',
          filter: `show_id=eq.${showId}`,
        },
        (payload) => {
          const label = (payload.new as { seat_label?: string }).seat_label;
          if (label) onSeatLocked([label]);
        }
      )
      .on(
        'postgres_changes',
        {
          event:  'DELETE',
          schema: 'public',
          table:  'seat_locks',
          filter: `show_id=eq.${showId}`,
        },
        (payload) => {
          const label = (payload.old as { seat_label?: string }).seat_label;
          if (label) onSeatUnlocked([label]);
        }
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [showId]);
}
