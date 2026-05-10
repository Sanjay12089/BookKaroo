import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { City } from '@/shared/types';

export function useCities() {
  return useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: () => api.get<City[]>('/api/cities').then((r) => r.data),
    staleTime: 1000 * 60 * 60, // 1 hour — cities don't change often
  });
}
