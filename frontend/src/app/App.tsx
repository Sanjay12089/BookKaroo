import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCityStore } from '@/shared/store/cityStore';
import { configureApiInterceptors, api } from '@/shared/lib/api';
import type { City } from '@/shared/types';

function AppInit({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Wire token interceptors
    configureApiInterceptors({
      getToken: () => useAuthStore.getState().accessToken,
      onRefreshFail: () => {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      },
    });

    // Restore city from localStorage before anything renders
    useCityStore.getState().initFromStorage();

    // Auto-detect city if none persisted (best-effort; fails silently for localhost)
    if (!useCityStore.getState().selectedCity) {
      api.get<City>('/api/cities/detect')
        .then(({ data }) => {
          if (data && !useCityStore.getState().selectedCity) {
            useCityStore.getState().setCity(data);
          }
        })
        .catch(() => { /* user will choose via CityModal */ });
    }

    // Rehydrate auth from httpOnly cookie
    void initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}

export default function App() {
  return (
    <Providers>
      <AppInit>
        <RouterProvider router={router} />
        <ToastContainer />
      </AppInit>
    </Providers>
  );
}
