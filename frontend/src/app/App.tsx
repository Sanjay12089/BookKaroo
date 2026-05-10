import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { useAuthStore } from '@/features/auth/store/authStore';
import { configureApiInterceptors } from '@/shared/lib/api';

function AppInit({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    configureApiInterceptors({
      getToken: () => useAuthStore.getState().accessToken,
      onRefreshFail: () => {
        useAuthStore.getState().clearAuth();
        // Don't use window.location.href — it causes a full reload loop on every init.
        // ProtectedRoute handles the /login redirect via React Router when needed.
      },
    });
    void initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="w-10 h-10 rounded-full border-2 border-accent-indigo/20 border-t-accent-indigo animate-spin" />
      </div>
    );
  }

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
