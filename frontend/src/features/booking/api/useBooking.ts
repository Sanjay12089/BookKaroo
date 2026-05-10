import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Booking } from '@/shared/types';
import type {
  ShowSeatsData, SeatLockResponse,
  CreateOrderRequest, CreateOrderResponse,
  ValidateCouponRequest, CouponValidation,
} from '../types';
import type { ApiError } from '@/shared/types';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: () => api.get<Booking[]>('/api/bookings').then((r) => r.data),
    staleTime: 0,
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ref: string) => api.post(`/api/bookings/${ref}/cancel`).then((r) => r.data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['bookings', 'mine'] }),
  });
}

// ── Seats ─────────────────────────────────────────────────────────────────────

export function useShowSeats(showId: string) {
  return useQuery<ShowSeatsData>({
    queryKey: ['show-seats', showId],
    queryFn: () => api.get<ShowSeatsData>(`/api/shows/${showId}/seats`).then((r) => r.data),
    staleTime: 0,
    enabled: !!showId,
  });
}

// ── Seat locks ────────────────────────────────────────────────────────────────

export function useLockSeats() {
  return useMutation<SeatLockResponse, { message?: string }, { showId: string; seats: string[] }>({
    mutationFn: ({ showId, seats }) =>
      api.post<SeatLockResponse>('/api/seat-locks', { showId, seats }).then((r) => r.data),
  });
}

export function useReleaseSeats() {
  return useMutation<void, { message?: string }, string>({
    mutationFn: (showId: string) =>
      api.delete('/api/seat-locks', { params: { showId } }).then(() => undefined),
  });
}

// ── Checkout ──────────────────────────────────────────────────────────────────

export function useCreateOrder() {
  return useMutation<CreateOrderResponse, ApiError, CreateOrderRequest>({
    mutationFn: (data) =>
      api.post<CreateOrderResponse>('/api/payments/order', data, {
        headers: { 'Idempotency-Key': data.idempotencyKey },
      }).then((r) => r.data),
  });
}

export function useValidateCoupon() {
  return useMutation<CouponValidation, ApiError, ValidateCouponRequest>({
    mutationFn: (data) =>
      api.post<CouponValidation>('/api/coupons/validate', data).then((r) => r.data),
  });
}
