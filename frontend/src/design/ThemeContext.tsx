import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { DESIGN_TOKENS as T } from './tokens';
import type { Theme } from './theme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Set attribute first (no transition flash on initial load)
    document.documentElement.setAttribute('data-theme', theme);

    // Enable smooth transitions after first paint
    const id = setTimeout(() => {
      document.documentElement.classList.add('bk-theme-ready');
    }, 50);

    return () => clearTimeout(id);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

// ─── ThemeToggle button ────────────────────────────────────────────────────────

interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeToggle({ className, style }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        borderRadius: T.radius.full,
        background: T.colors.bg.surface2,
        border: `1px solid ${T.colors.border.default}`,
        color: T.colors.text.secondary,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: T.fonts.body,
        transition: `all 200ms ease`,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.colors.border.strong;
        e.currentTarget.style.color = T.colors.text.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.colors.border.default;
        e.currentTarget.style.color = T.colors.text.secondary;
      }}
    >
      {isDark ? '☀️' : '🌙'}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
