// Theme system removed — app is now light-only.
// This module is kept as a no-op shim so existing imports continue to compile.
import type { ReactNode } from 'react';
import type { Theme } from './theme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useTheme(): ThemeContextValue {
  return { theme: 'light', toggleTheme: () => undefined };
}

interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeToggle(_props: ThemeToggleProps) {
  // No-op: light-only theme.
  return null;
}
