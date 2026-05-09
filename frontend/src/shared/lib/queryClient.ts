import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 min default
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Per-route stale times (used when creating individual queries)
export const STALE = {
  MOVIES: 10 * 60 * 1000,    // 10 min
  SHOWTIMES: 60 * 1000,       // 1 min
  SEATS: 0,                   // always fresh (Realtime handles it)
  USER: Infinity,             // manual invalidation only
} as const;
