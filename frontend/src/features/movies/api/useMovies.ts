import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Movie, PaginatedResponse } from '@/shared/types';
import type { MovieDetail, PaginatedReviews } from '../types';
import { STALE } from '@/shared/lib/queryClient';
import { toast } from '@/shared/components/ui/Toast';

// ── Movie list ────────────────────────────────────────────────────────────────

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
    queryFn: () =>
      api.get<PaginatedResponse<Movie>>(`/api/movies?${params}`).then((r) => r.data),
    staleTime: STALE.MOVIES,
  });
}

// ── Movie detail ──────────────────────────────────────────────────────────────

export function useMovieDetail(slug: string) {
  return useQuery<MovieDetail>({
    queryKey: ['movie', slug],
    queryFn: () => api.get<MovieDetail>(`/api/movies/${slug}`).then((r) => r.data),
    staleTime: STALE.MOVIES,
    enabled: !!slug,
  });
}

// ── Showtimes ─────────────────────────────────────────────────────────────────

export function useShowtimes(slug: string, date?: string) {
  return useQuery({
    queryKey: ['showtimes', slug, date],
    queryFn: () =>
      api.get(`/api/movies/${slug}/showtimes${date ? `?date=${date}` : ''}`).then((r) => r.data),
    staleTime: STALE.SHOWTIMES,
    enabled: !!slug,
  });
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export function useMovieReviews(movieId: string, sort: string, page: number) {
  return useQuery<PaginatedReviews>({
    queryKey: ['movie-reviews', movieId, sort, page],
    queryFn: () =>
      api.get<PaginatedReviews>(`/api/movies/${movieId}/reviews`, {
        params: { sort, page, pageSize: 10 },
      }).then((r) => r.data),
    staleTime: 2 * 60 * 1000,
    enabled: !!movieId,
  });
}

export function useCreateReview(movieId: string, slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; title?: string; body?: string }) =>
      api.post(`/api/movies/${movieId}/reviews`, data).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['movie', slug] });
      void qc.invalidateQueries({ queryKey: ['movie-reviews', movieId] });
      toast('Review submitted!', 'success');
    },
    onError: (err: { message?: string }) => {
      toast(err?.message ?? 'Could not submit review.', 'error');
    },
  });
}

export function useRemindMe(movieId: string) {
  return useMutation({
    mutationFn: () => api.post(`/api/movies/${movieId}/remind-me`).then((r) => r.data),
    onSuccess: () => toast("We'll notify you when it releases!", 'success'),
    onError:   () => toast('Could not set reminder. Please try again.', 'error'),
  });
}
