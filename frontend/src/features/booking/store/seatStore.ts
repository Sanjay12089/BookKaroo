import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SeatStoreState {
  showId:       string | null;
  selectedSeats: string[];
  lockId:        string | null;
  lockExpiresAt: string | null;
}

interface SeatStoreActions {
  selectSeat:   (seat: string) => void;
  deselectSeat: (seat: string) => void;
  clearSeats:   (newShowId?: string) => void;
  setLock:      (lockId: string, expiresAt: string) => void;
  setShowId:    (showId: string) => void;
}

const MAX_SEATS = 10;

export const useSeatStore = create<SeatStoreState & SeatStoreActions>()(
  persist(
    (set, get) => ({
      showId:        null,
      selectedSeats: [],
      lockId:        null,
      lockExpiresAt: null,

      selectSeat: (seat) =>
        set((s) => {
          if (s.selectedSeats.includes(seat) || s.selectedSeats.length >= MAX_SEATS) return s;
          return { selectedSeats: [...s.selectedSeats, seat] };
        }),

      deselectSeat: (seat) =>
        set((s) => ({ selectedSeats: s.selectedSeats.filter((l) => l !== seat) })),

      clearSeats: (newShowId) =>
        set({
          selectedSeats: [],
          lockId:        null,
          lockExpiresAt: null,
          showId:        newShowId ?? null,
        }),

      setLock: (lockId, expiresAt) => set({ lockId, lockExpiresAt: expiresAt }),

      setShowId: (showId) => {
        if (get().showId !== showId) {
          set({ showId, selectedSeats: [], lockId: null, lockExpiresAt: null });
        }
      },
    }),
    {
      name:    'bk-seat-selection',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
