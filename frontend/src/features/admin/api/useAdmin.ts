import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { DashboardData, AuditLogPage } from '../types';

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

export function useAdminDashboard() {
  return useDashboard();
}
