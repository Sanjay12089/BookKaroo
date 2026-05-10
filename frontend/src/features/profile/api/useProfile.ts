import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { User } from '@/shared/types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<User>('/api/auth/me').then((r) => r.data),
  });
}

interface UpdateProfilePayload {
  name?: string;
  mobile?: string;
  gender?: string;
  cityId?: string;
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) =>
      api.put<User>('/api/users/me', data).then((r) => r.data),
    onSuccess: (updated) => {
      // Keep the existing access token, just refresh user object in store
      setAuth(updated, useAuthStore.getState().accessToken ?? '');
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
