import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { EventDetail, EventListItem, EventListResponse, HomeData } from '../types';

export function useEvents(
  type:   string | null = null,
  cityId: string | null = null,
  page    = 1,
) {
  return useQuery<EventListResponse>({
    queryKey: ['events', type, cityId, page],
    queryFn: () =>
      api.get<EventListResponse>('/api/events', {
        params: { ...(type ? { type } : {}), ...(cityId ? { cityId } : {}), page, pageSize: 20 },
      }).then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useEventDetail(slug: string) {
  return useQuery<EventDetail>({
    queryKey: ['event', slug],
    queryFn: () => api.get<EventDetail>(`/api/events/${slug}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useUpcomingEvents(
  type:   string,
  cityId: string | null = null,
  count   = 6,
) {
  return useQuery<EventListItem[]>({
    queryKey: ['events-upcoming', type, cityId, count],
    queryFn: () =>
      api.get<EventListItem[]>(`/api/events/upcoming/${type}`, {
        params: { ...(cityId ? { cityId } : {}), count },
      }).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHomeData(cityId: string | null) {
  return useQuery<HomeData>({
    queryKey: ['home', cityId],
    queryFn: () =>
      api.get<HomeData>('/api/home', {
        params: cityId ? { cityId } : {},
      }).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRemindMeEvent(eventId: string) {
  return useMutation({
    mutationFn: () => api.post(`/api/events/${eventId}/remind-me`),
  });
}
