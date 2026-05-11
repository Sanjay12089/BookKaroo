import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import { toast } from '@/shared/components/ui/Toast';
import type {
  DashboardData, AuditLogPage,
  AdminMoviePage, AdminMovieResponse, AdminMovieDetailResponse, AdminMovieFilters,
  CreateMoviePayload, UpdateMoviePayload,
  AdminEventPage, AdminEventDetailResponse, AdminEventFilters,
  CreateEventPayload, UpdateEventPayload,
  AdminVenueItem,
  AdminVenuePage, AdminVenueFilters, AdminVenueDetail,
  CreateVenuePayload, UpdateVenuePayload,
  CreateScreenPayload, UpdateScreenPayload,
  AdminShowPage, AdminShowFilters, CancelShowResponse,
  CreateShowPayload,
} from '../types';

type ApiError = { response?: { data?: { error?: string }; statusText?: string } };

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get<DashboardData>('/api/admin/dashboard').then((r) => r.data),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useAuditLogs(entityType?: string, page = 1, pageSize = 20) {
  return useQuery<AuditLogPage>({
    queryKey: ['admin', 'audit-logs', entityType, page],
    queryFn: () =>
      api.get<AuditLogPage>('/api/admin/audit-logs', {
        params: { entityType, page, pageSize },
      }).then((r) => r.data),
    staleTime: 60_000,
    retry: false,
  });
}

export { useDashboard as useAdminDashboard };

// ── Movies ────────────────────────────────────────────────────────────────────

export function useAdminMovies(filters: AdminMovieFilters, page: number) {
  return useQuery<AdminMoviePage>({
    queryKey: ['admin-movies', filters, page],
    queryFn: () =>
      api.get<AdminMoviePage>('/api/admin/movies', {
        params: { ...filters, page, pageSize: 20 },
      }).then((r) => r.data),
    staleTime: 60_000,
    retry: false,
  });
}

export function useAdminMovie(id: string | null) {
  return useQuery<AdminMovieDetailResponse>({
    queryKey: ['admin-movie', id],
    queryFn: () => api.get<AdminMovieDetailResponse>(`/api/admin/movies/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMoviePayload) =>
      api.post('/api/admin/movies', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-movies'] });
      toast('Movie created successfully', 'success');
    },
    onError: () => toast('Failed to create movie', 'error'),
  });
}

export function useUpdateMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMoviePayload }) =>
      api.patch(`/api/admin/movies/${id}`, data).then((r) => r.data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-movies'] });
      qc.invalidateQueries({ queryKey: ['admin-movie', id] });
      toast('Movie updated', 'success');
    },
    onError: () => toast('Failed to update movie', 'error'),
  });
}

export function useDeleteMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/movies/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-movies'] });
      toast('Movie deleted', 'success');
    },
    onError: () => toast('Failed to delete movie', 'error'),
  });
}

export function useSyncFromTmdb() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tmdbId: number) =>
      api.post<AdminMovieResponse>('/api/admin/movies/sync-tmdb', { tmdbId }).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-movies'] });
      toast(`Synced: ${data.title}`, 'success');
    },
    onError: () => toast('TMDB sync failed — check your TMDB_BEARER token', 'error'),
  });
}

export function useImportPopular() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post<{ imported: number; skipped: number }>('/api/admin/movies/import-popular').then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-movies'] });
      toast(`Imported ${data.imported} movies, skipped ${data.skipped}`, 'success');
    },
    onError: () => toast('Import failed', 'error'),
  });
}

// ── Events ────────────────────────────────────────────────────────────────────

export function useAdminEvents(filters: AdminEventFilters, page: number) {
  return useQuery<AdminEventPage>({
    queryKey: ['admin-events', filters, page],
    queryFn: () =>
      api.get<AdminEventPage>('/api/admin/events', {
        params: { ...filters, page, pageSize: 20 },
      }).then((r) => r.data),
    staleTime: 60_000,
    retry: false,
  });
}

export function useAdminEvent(id: string | null) {
  return useQuery<AdminEventDetailResponse>({
    queryKey: ['admin-event', id],
    queryFn: () => api.get<AdminEventDetailResponse>(`/api/admin/events/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventPayload) =>
      api.post('/api/admin/events', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      toast('Event created successfully', 'success');
    },
    onError: () => toast('Failed to create event', 'error'),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventPayload }) =>
      api.patch(`/api/admin/events/${id}`, data).then((r) => r.data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      qc.invalidateQueries({ queryKey: ['admin-event', id] });
      toast('Event updated', 'success');
    },
    onError: () => toast('Failed to update event', 'error'),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/events/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      toast('Event deleted', 'success');
    },
    onError: () => toast('Failed to delete event', 'error'),
  });
}

// ── Venues (simple list for dropdowns) ───────────────────────────────────────

export function useAdminVenuesList() {
  return useQuery<AdminVenueItem[]>({
    queryKey: ['admin-venues-list'],
    queryFn: () => api.get<AdminVenueItem[]>('/api/admin/venues/list').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// ── Venues CRUD ───────────────────────────────────────────────────────────────

export function useAdminVenuesPaged(filters: AdminVenueFilters, page: number) {
  return useQuery<AdminVenuePage>({
    queryKey: ['admin-venues', filters, page],
    queryFn: () =>
      api.get<AdminVenuePage>('/api/admin/venues', {
        params: { ...filters, page, pageSize: 20 },
      }).then((r) => r.data),
    staleTime: 60_000,
    retry: false,
  });
}

export function useAdminVenueDetail(id: string | null) {
  return useQuery<AdminVenueDetail>({
    queryKey: ['admin-venue', id],
    queryFn: () => api.get<AdminVenueDetail>(`/api/admin/venues/${id}`).then((r) => r.data),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVenuePayload) =>
      api.post('/api/admin/venues', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-venues'] });
      qc.invalidateQueries({ queryKey: ['admin-venues-list'] });
      toast('Venue created successfully', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to create venue', 'error'),
  });
}

export function useUpdateVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVenuePayload }) =>
      api.patch(`/api/admin/venues/${id}`, data).then((r) => r.data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-venues'] });
      qc.invalidateQueries({ queryKey: ['admin-venue', id] });
      qc.invalidateQueries({ queryKey: ['admin-venues-list'] });
      toast('Venue updated', 'success');
    },
    onError: () => toast('Failed to update venue', 'error'),
  });
}

export function useDeleteVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/venues/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-venues'] });
      qc.invalidateQueries({ queryKey: ['admin-venues-list'] });
      toast('Venue deleted', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to delete venue', 'error'),
  });
}

// ── Screens ───────────────────────────────────────────────────────────────────

export function useCreateScreen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ venueId, data }: { venueId: string; data: CreateScreenPayload }) =>
      api.post(`/api/admin/venues/${venueId}/screens`, data).then((r) => r.data),
    onSuccess: (_result, { venueId }) => {
      qc.invalidateQueries({ queryKey: ['admin-venue', venueId] });
      qc.invalidateQueries({ queryKey: ['admin-venues'] });
      toast('Screen created successfully', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to create screen', 'error'),
  });
}

export function useUpdateScreen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ screenId, data }: { screenId: string; venueId: string; data: UpdateScreenPayload }) =>
      api.patch(`/api/admin/screens/${screenId}`, data).then((r) => r.data),
    onSuccess: (_result, { venueId }) => {
      qc.invalidateQueries({ queryKey: ['admin-venue', venueId] });
      toast('Screen updated', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to update screen', 'error'),
  });
}

export function useDeleteScreen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ screenId }: { screenId: string; venueId: string }) =>
      api.delete(`/api/admin/screens/${screenId}`),
    onSuccess: (_result, { venueId }) => {
      qc.invalidateQueries({ queryKey: ['admin-venue', venueId] });
      qc.invalidateQueries({ queryKey: ['admin-venues'] });
      toast('Screen deleted', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to delete screen', 'error'),
  });
}

// ── Shows CRUD ────────────────────────────────────────────────────────────────

export function useAdminShows(filters: AdminShowFilters, page: number) {
  return useQuery<AdminShowPage>({
    queryKey: ['admin-shows', filters, page],
    queryFn: () =>
      api.get<AdminShowPage>('/api/admin/shows', {
        params: { ...filters, page, pageSize: 20 },
      }).then((r) => r.data),
    staleTime: 30_000,
    retry: false,
  });
}

export function useCreateShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShowPayload) =>
      api.post('/api/admin/shows', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shows'] });
      toast('Show created successfully', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to create show', 'error'),
  });
}

export function useCancelShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (showId: string) =>
      api.post<CancelShowResponse>(`/api/admin/shows/${showId}/cancel`).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-shows'] });
      toast(data.message, 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to cancel show', 'error'),
  });
}

export function useDeleteShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (showId: string) => api.delete(`/api/admin/shows/${showId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shows'] });
      toast('Show deleted', 'success');
    },
    onError: () => toast('Failed to delete show', 'error'),
  });
}
