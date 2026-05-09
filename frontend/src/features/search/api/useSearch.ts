import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => api.get(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.data),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}
