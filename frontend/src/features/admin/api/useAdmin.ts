import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get('/api/admin/dashboard').then((r) => r.data),
    staleTime: 60_000,
  });
}
