import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Booking } from '@/shared/types';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: () => api.get<Booking[]>('/api/bookings').then((r) => r.data),
    staleTime: 0,
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: (ref: string) => api.post(`/api/bookings/${ref}/cancel`).then((r) => r.data),
  });
}
