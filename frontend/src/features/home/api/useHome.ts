import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Movie, Event } from '@/shared/types';
import { STALE } from '@/shared/lib/queryClient';

export function useNowShowing() {
  return useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: () =>
      api.get<{ items: Movie[]; total: number }>('/api/movies?category=NowShowing&pageSize=10').then((r) => r.data),
    staleTime: STALE.MOVIES,
  });
}

export function useComingSoon() {
  return useQuery({
    queryKey: ['movies', 'coming-soon'],
    queryFn: () =>
      api.get<{ items: Movie[]; total: number }>('/api/movies?category=ComingSoon&pageSize=6').then((r) => r.data),
    staleTime: STALE.MOVIES,
  });
}

export function useEvents(type?: string) {
  return useQuery({
    queryKey: ['events', type ?? 'all'],
    queryFn: () =>
      api.get<{ items: Event[]; total: number }>(`/api/events${type ? `?type=${type}` : '?pageSize=6'}`).then((r) => r.data),
    staleTime: STALE.MOVIES,
  });
}

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => api.get<{ items: unknown[] }>('/api/cms/banners').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });
}
