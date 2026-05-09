export const DESIGN_TOKENS = {
  colors: {
    bg: {
      base: '#0A0E1A',
      surface: '#131826',
      surface2: '#1A2138',
      surface3: '#232C44',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.04)',
      default: 'rgba(255, 255, 255, 0.08)',
      strong: 'rgba(255, 255, 255, 0.16)',
    },
    text: {
      primary: '#F4F4F5',
      secondary: '#A1A1AA',
      muted: '#71717A',
    },
    accent: {
      crimson: '#E50914',
      crimsonLight: '#FF2D3A',
      crimsonDark: '#A8000A',
      indigo: '#6366F1',
      purple: '#A855F7',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    seat: {
      available: '#1A2138',
      selected: '#E50914',
      booked: '#232C44',
      locked: '#F59E0B',
      recliner: '#FFD700',
      gold: '#C0C0C0',
      executive: '#4169E1',
      normal: '#E4E4E7',
    },
  },

  fonts: {
    display: "'Playfair Display', 'Times New Roman', serif",
    body: "'Sora', 'Inter', ui-sans-serif, system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  },

  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
    md: '0 8px 24px rgba(0, 0, 0, 0.35)',
    lg: '0 20px 50px -12px rgba(0, 0, 0, 0.6)',
    glowCrimson: '0 10px 40px -10px rgba(229, 9, 20, 0.55)',
    glowIndigo: '0 10px 40px -10px rgba(99, 102, 241, 0.55)',
  },

  motion: {
    duration: {
      fast: '150ms',
      base: '220ms',
      slow: '400ms',
    },
    ease: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
