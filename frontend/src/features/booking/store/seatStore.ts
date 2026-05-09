import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SeatState {
  showId: string | null;
  selectedSeats: string[];    // seat labels e.g. ["H12", "H13"]
  lockId: string | null;
  lockExpiresAt: string | null; // ISO string
}

interface SeatActions {
  selectSeat: (showId: string, seatLabel: string) => void;
  deselectSeat: (seatLabel: string) => void;
  clearSeats: () => void;
  setLock: (lockId: string, expiresAt: string) => void;
}

const MAX_SEATS = 10;

export const useSeatStore = create<SeatState & SeatActions>()(
  persist(
    (set) => ({
      showId: null,
      selectedSeats: [],
      lockId: null,
      lockExpiresAt: null,

      selectSeat: (showId, seatLabel) =>
        set((state) => {
          // If switching shows, clear existing selection
          const currentShowId = state.showId === showId ? state.showId : null;
          const existing = currentShowId ? state.selectedSeats : [];

          if (existing.includes(seatLabel) || existing.length >= MAX_SEATS) return state;
          return {
            showId,
            selectedSeats: [...existing, seatLabel],
          };
        }),

      deselectSeat: (seatLabel) =>
        set((state) => ({
          selectedSeats: state.selectedSeats.filter((s) => s !== seatLabel),
        })),

      clearSeats: () =>
        set({ showId: null, selectedSeats: [], lockId: null, lockExpiresAt: null }),

      setLock: (lockId, expiresAt) => set({ lockId, lockExpiresAt: expiresAt }),
    }),
    {
      name: 'bk-seat-selection',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
