import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import { ThemeProvider } from '@/design/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
