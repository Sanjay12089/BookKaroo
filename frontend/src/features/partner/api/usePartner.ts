import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type {
  PartnerDashboard,
  PartnerVenueListItem,
  PartnerVenueDetail,
  PartnerShowResponse,
  PartnerBookingListItem,
  PartnerReviewResponse,
} from '../types';

export function usePartnerDashboard() {
  return useQuery({
    queryKey: ['partner', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get<PartnerDashboard>('/api/partner/dashboard');
      return data;
    },
  });
}

export function usePartnerVenues() {
  return useQuery({
    queryKey: ['partner', 'venues'],
    queryFn: async () => {
      const { data } = await api.get<PartnerVenueListItem[]>('/api/partner/venues');
      return data;
    },
  });
}

export function usePartnerVenueDetail(venueId: string | undefined) {
  return useQuery({
    queryKey: ['partner', 'venue', venueId],
    enabled: !!venueId,
    queryFn: async () => {
      const { data } = await api.get<PartnerVenueDetail>(`/api/partner/venues/${venueId}`);
      return data;
    },
  });
}

export function useUpdatePartnerVenue(venueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { contactPhone?: string; contactEmail?: string; amenities?: string }) => {
      const { data } = await api.patch<PartnerVenueDetail>(`/api/partner/venues/${venueId}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partner', 'venue', venueId] });
      qc.invalidateQueries({ queryKey: ['partner', 'venues'] });
    },
  });
}

export interface PartnerShowsQuery {
  venueId?: string;
  screenId?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export function usePartnerShows(query: PartnerShowsQuery) {
  return useQuery({
    queryKey: ['partner', 'shows', query],
    queryFn: async () => {
      const { data } = await api.get<{ items: PartnerShowResponse[]; total: number; page: number; pageSize: number; totalPages: number }>(
        '/api/partner/shows',
        { params: query }
      );
      return data;
    },
  });
}

export function useCancelPartnerShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (showId: string) => {
      await api.post(`/api/partner/shows/${showId}/cancel`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partner', 'shows'] }),
  });
}

export interface PartnerBookingsQuery {
  search?: string;
  status?: string;
  venueId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export function usePartnerBookings(query: PartnerBookingsQuery) {
  return useQuery({
    queryKey: ['partner', 'bookings', query],
    queryFn: async () => {
      const { data } = await api.get<{ items: PartnerBookingListItem[]; total: number; page: number; pageSize: number }>(
        '/api/partner/bookings',
        { params: query }
      );
      return data;
    },
  });
}

export function usePartnerReviews(query: { venueId?: string; status?: string; sort?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['partner', 'reviews', query],
    queryFn: async () => {
      const { data } = await api.get<{ items: PartnerReviewResponse[]; total: number; page: number; pageSize: number }>(
        '/api/partner/reviews',
        { params: query }
      );
      return data;
    },
  });
}
