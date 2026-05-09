import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Event, PaginatedResponse } from '@/shared/types';

export function useEvents(type?: string) {
  return useQuery({
    queryKey: ['events', type ?? 'all'],
    queryFn: () =>
      api.get<PaginatedResponse<Event>>(`/api/events${type ? `?type=${type}` : ''}`).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}
