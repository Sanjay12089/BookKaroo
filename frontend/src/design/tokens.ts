export const DESIGN_TOKENS = {
  colors: {
    bg: {
      base:     'var(--bk-bg-base)',
      surface:  'var(--bk-bg-surface)',
      surface2: 'var(--bk-bg-surface2)',
      surface3: 'var(--bk-bg-surface3)',
    },
    border: {
      subtle:  'var(--bk-border-subtle)',
      default: 'var(--bk-border-default)',
      strong:  'var(--bk-border-strong)',
    },
    text: {
      primary:   'var(--bk-text-primary)',
      secondary: 'var(--bk-text-secondary)',
      muted:     'var(--bk-text-muted)',
    },
    accent: {
      crimson: '#E51937',
      crimsonLight: '#FF3F56',
      crimsonDark: '#B5111F',
      indigo: '#4F46E5',
      purple: '#7C3AED',
    },
    semantic: {
      success: '#18BC60',
      warning: '#F59E0B',
      error: '#E51937',
    },
    seat: {
      available: 'var(--bk-seat-available-bg)',
      selected: '#E51937',
      booked: '#CCCCCC',
      locked: '#F59E0B',
      recliner: '#FFD700',
      gold: '#C8A951',
      executive: '#4169E1',
      normal: '#E8E8E8',
    },
    // Light tints — legible on dark gradients; NOT bg colors
    tint: {
      white: '#FFFFFF',
      successText: '#6EE7B7',
      warningText: '#FCD34D',
      errorText: '#FF6770',
      indigoText: '#A5B4FC',
      purpleText: '#C4A0FF',
      gold: '#F5C56B',
      goldDark: '#D4A017',
      goldBg: '#1a0a05',
      cyan: '#22D3EE',
    },
  },

  // Decorative gradients reused across poster cards / hero / IPL
  gradients: {
    posterPurple: 'linear-gradient(135deg, #2a1a3d, #4c1d95)',
    posterCard: 'linear-gradient(135deg, #1a1f33, #0f1424)',
    heroDark: 'linear-gradient(135deg, #1a0e2e 0%, #0A0E1A 70%)',
    iplStrip: 'linear-gradient(110deg, #1a0a05 0%, #2d0a0e 60%, #1a0535 100%)',
    iplGoldCta: 'linear-gradient(135deg, #F5C56B, #D4A017)',
    navBg: '#2B3148',
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
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.10)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.14)',
    glowCrimson: '0 6px 24px rgba(229, 25, 55, 0.30)',
    glowIndigo: '0 6px 24px rgba(79, 70, 229, 0.30)',
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
