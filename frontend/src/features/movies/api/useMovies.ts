import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Movie, PaginatedResponse } from '@/shared/types';
import { STALE } from '@/shared/lib/queryClient';

interface MovieFilters {
  language?: string;
  genre?: string;
  format?: string;
  category?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export function useMovies(filters: MovieFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });

  return useQuery({
    queryKey: ['movies', 'list', filters],
    queryFn: () => api.get<PaginatedResponse<Movie>>(`/api/movies?${params}`).then((r) => r.data),
    staleTime: STALE.MOVIES,
  });
}

export function useMovieDetail(slug: string) {
  return useQuery({
    queryKey: ['movies', slug],
    queryFn: () => api.get<Movie>(`/api/movies/${slug}`).then((r) => r.data),
    staleTime: STALE.MOVIES,
    enabled: !!slug,
  });
}

export function useShowtimes(slug: string, date?: string) {
  return useQuery({
    queryKey: ['showtimes', slug, date],
    queryFn: () =>
      api.get(`/api/movies/${slug}/showtimes${date ? `?date=${date}` : ''}`).then((r) => r.data),
    staleTime: STALE.SHOWTIMES,
    enabled: !!slug,
  });
}
