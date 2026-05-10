import { create } from 'zustand';

const LS_KEY = 'bk-city';

interface CityState {
  cityName: string;
  setCityName: (name: string) => void;
}

export const useCityStore = create<CityState>((set) => ({
  // Initialise synchronously from localStorage so first render is correct
  cityName: (() => {
    try { return localStorage.getItem(LS_KEY) ?? ''; } catch { return ''; }
  })(),

  setCityName: (name) => {
    try { localStorage.setItem(LS_KEY, name); } catch { /* ignore */ }
    set({ cityName: name });
  },
}));
