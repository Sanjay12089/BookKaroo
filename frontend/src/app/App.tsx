import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { useAuthStore } from '@/features/auth/store/authStore';
import { configureApiInterceptors } from '@/shared/lib/api';

function AppInit({ children }: { children: React.ReactNode }) {
  const { initialize, clearAuth, accessToken } = useAuthStore();

  useEffect(() => {
    // Wire api interceptors to read from store
    configureApiInterceptors({
      getToken: () => useAuthStore.getState().accessToken,
      onRefreshFail: () => {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      },
    });

    // Attempt to rehydrate user from httpOnly cookie
    void initialize();
  }, [initialize, clearAuth, accessToken]);

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
