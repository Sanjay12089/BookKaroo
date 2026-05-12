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
  AdminBooking, AdminBookingPage, AdminBookingFilters,
  AdminUserPage, AdminUserDetail, AdminUserFilters,
} from '../types';

type ApiError = { response?: { data?: { error?: string } } };

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

// ── Venues ────────────────────────────────────────────────────────────────────

export function useAdminVenues() {
  return useQuery<AdminVenueItem[]>({
    queryKey: ['admin-venues'],
    queryFn: () => api.get<AdminVenueItem[]>('/api/admin/venues').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// ── Admin Bookings ────────────────────────────────────────────────────────────

export function useAdminBookings(filters: AdminBookingFilters, page: number) {
  return useQuery<AdminBookingPage>({
    queryKey: ['admin-bookings', filters, page],
    queryFn: () =>
      api.get<AdminBookingPage>('/api/admin/bookings', {
        params: { ...filters, page, pageSize: 20 },
      }).then((r) => r.data),
    staleTime: 30_000,
    retry: false,
  });
}

export function useAdminBookingDetail(ref: string | null) {
  return useQuery<AdminBooking>({
    queryKey: ['admin-booking', ref],
    queryFn: () => api.get<AdminBooking>(`/api/admin/bookings/${ref}`).then((r) => r.data),
    enabled: !!ref,
    staleTime: 60_000,
  });
}

export function useAdminCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ref: string) =>
      api.post(`/api/admin/bookings/${ref}/cancel`).then((r) => r.data),
    onSuccess: (_data, ref) => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
      qc.invalidateQueries({ queryKey: ['admin-booking', ref] });
      toast('Booking cancelled and refund processed', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to cancel booking', 'error'),
  });
}

export function useAdminRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ref, amount }: { ref: string; amount: number }) =>
      api.post(`/api/admin/bookings/${ref}/refund`, { refundAmount: amount }).then((r) => r.data),
    onSuccess: (_data, { ref }) => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
      qc.invalidateQueries({ queryKey: ['admin-booking', ref] });
      toast('Refund processed successfully', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to process refund', 'error'),
  });
}

export function useResendBookingEmail() {
  return useMutation({
    mutationFn: (ref: string) =>
      api.post(`/api/admin/bookings/${ref}/resend-email`).then((r) => r.data),
    onSuccess: () => toast('Confirmation email resent', 'success'),
    onError: () => toast('Failed to resend email', 'error'),
  });
}

// ── Admin Users ───────────────────────────────────────────────────────────────

export function useAdminUsers(filters: AdminUserFilters, page: number) {
  return useQuery<AdminUserPage>({
    queryKey: ['admin-users', filters, page],
    queryFn: () =>
      api.get<AdminUserPage>('/api/admin/users', {
        params: { ...filters, page, pageSize: 20 },
      }).then((r) => r.data),
    staleTime: 60_000,
    retry: false,
  });
}

export function useAdminUserDetail(id: string | null) {
  return useQuery<AdminUserDetail>({
    queryKey: ['admin-user', id],
    queryFn: () => api.get<AdminUserDetail>(`/api/admin/users/${id}`).then((r) => r.data),
    enabled: !!id,
    staleTime: 2 * 60_000,
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/api/admin/users/${id}/block`).then((r) => r.data),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-user', id] });
      toast('User blocked successfully', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to block user', 'error'),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/api/admin/users/${id}/unblock`).then((r) => r.data),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-user', id] });
      toast('User unblocked successfully', 'success');
    },
    onError: (err: ApiError) =>
      toast(err.response?.data?.error ?? 'Failed to unblock user', 'error'),
  });
}

export function useAdminResetPassword() {
  return useMutation({
    mutationFn: (id: string) =>
      api.post<{ tempPassword: string }>(`/api/admin/users/${id}/reset-password`).then((r) => r.data),
  });
}
