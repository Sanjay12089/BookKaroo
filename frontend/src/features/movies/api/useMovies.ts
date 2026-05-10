import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Movie, PaginatedResponse } from '@/shared/types';
import { STALE } from '@/shared/lib/queryClient';

export interface MovieFilters {
  languages?: string[];
  genres?: string[];
  formats?: string[];
  category?: string;
  cityId?: string;
  sort?: 'rating' | 'release' | 'az' | '';
  page?: number;
  pageSize?: number;
}

export interface PaginatedMovies extends PaginatedResponse<Movie> {
  totalPages: number;
}

function buildParams(filters: MovieFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.category) p.set('category', filters.category);
  if (filters.sort)     p.set('sort', filters.sort);
  if (filters.cityId)   p.set('cityId', filters.cityId);
  if (filters.page)     p.set('page', String(filters.page));
  if (filters.pageSize) p.set('pageSize', String(filters.pageSize));
  filters.languages?.forEach((l) => p.append('languages', l));
  filters.genres?.forEach((g) => p.append('genres', g));
  filters.formats?.forEach((f) => p.append('formats', f));
  return p;
}

export function useMovies(filters: MovieFilters = {}) {
  return useQuery<PaginatedMovies>({
    queryKey: ['movies', 'list', filters],
    queryFn: () =>
      api.get<PaginatedMovies>(`/api/movies?${buildParams(filters)}`).then((r) => r.data),
    staleTime: STALE.MOVIES,
    placeholderData: (prev) => prev, // smooth pagination without flash
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
