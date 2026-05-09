import React from 'react';
import { DESIGN_TOKENS } from './tokens';

export interface LogoProps {
  size?: number;
  variant?: 'full-horizontal' | 'full-stacked' | 'icon-only' | 'wordmark-only';
  theme?: 'dark' | 'light' | 'mono-white' | 'mono-black';
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface LogoIconProps {
  size?: number;
  theme?: 'dark' | 'light' | 'mono-white' | 'mono-black';
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface WordmarkProps {
  size?: number;
  theme?: 'dark' | 'light' | 'mono-white' | 'mono-black';
  className?: string;
  style?: React.CSSProperties;
}

const TAGLINE = 'Book the moment. Karo it now.';

function getWordmarkColor(theme: LogoProps['theme']): { primary: string; accent: string } {
  switch (theme) {
    case 'light':
      return { primary: DESIGN_TOKENS.colors.bg.base, accent: DESIGN_TOKENS.colors.accent.crimson };
    case 'mono-white':
      return { primary: '#FFFFFF', accent: '#FFFFFF' };
    case 'mono-black':
      return { primary: DESIGN_TOKENS.colors.bg.base, accent: DESIGN_TOKENS.colors.bg.base };
    default:
      return { primary: DESIGN_TOKENS.colors.text.primary, accent: DESIGN_TOKENS.colors.accent.crimson };
  }
}

function IconMark({ size = 40, theme = 'dark', glow = false }: { size?: number; theme?: LogoProps['theme']; glow?: boolean }) {
  const isMono = theme === 'mono-white' || theme === 'mono-black';
  const monoColor = theme === 'mono-white' ? '#FFFFFF' : DESIGN_TOKENS.colors.bg.base;
  const uid = React.useId().replace(/:/g, '');

  if (isMono) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        role="img"
        aria-label="BookKaroo"
      >
        <g transform="translate(-4 0)">
          <rect x="62" y="54" width="22" height="132" rx="5" fill={monoColor} />
          <path
            d="M92 58 Q92 54 96 56 L190 116 Q195 120 190 124 L96 184 Q92 186 92 182 Z"
            fill={monoColor}
          />
        </g>
      </svg>
    );
  }

  const bgGradId = `bk-bg-${uid}`;
  const glowGradId = `bk-glow-${uid}`;
  const redGradId = `bk-red-${uid}`;
  const barGradId = `bk-bar-${uid}`;
  const bgFill = theme === 'light' ? '#F4F1EA' : DESIGN_TOKENS.colors.bg.base;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      role="img"
      aria-label="BookKaroo"
      style={glow ? { filter: `drop-shadow(0 0 ${size * 0.15}px rgba(229,9,20,0.4))` } : undefined}
    >
      <defs>
        <linearGradient id={bgGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={DESIGN_TOKENS.colors.bg.base} />
          <stop offset="100%" stopColor="#141B33" />
        </linearGradient>
        <radialGradient id={glowGradId} cx="0.62" cy="0.5" r="0.62">
          <stop offset="0%" stopColor="#7A48E8" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#3B1E78" stopOpacity="0.18" />
          <stop offset="100%" stopColor={DESIGN_TOKENS.colors.bg.base} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={redGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={DESIGN_TOKENS.colors.accent.crimsonLight} />
          <stop offset="55%" stopColor={DESIGN_TOKENS.colors.accent.crimson} />
          <stop offset="100%" stopColor={DESIGN_TOKENS.colors.accent.crimsonDark} />
        </linearGradient>
        <linearGradient id={barGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E6E9F2" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="240" height="240" rx="56" fill={`url(#${bgGradId})`} />
      <rect x="0" y="0" width="240" height="240" rx="56" fill={`url(#${glowGradId})`} />

      <g transform="translate(-4 0)">
        <rect x="62" y="54" width="22" height="132" rx="5" fill={`url(#${barGradId})`} />
        <circle cx="73" cy="80" r="3" fill={bgFill} opacity="0.85" />
        <circle cx="73" cy="120" r="3" fill={bgFill} opacity="0.85" />
        <circle cx="73" cy="160" r="3" fill={bgFill} opacity="0.85" />
        <path
          d="M92 58 Q92 54 96 56 L190 116 Q195 120 190 124 L96 184 Q92 186 92 182 Z"
          fill={`url(#${redGradId})`}
        />
      </g>

      <rect
        x="1" y="1" width="238" height="238" rx="55"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.06"
      />
    </svg>
  );
}

function Wordmark({ size = 28, theme = 'dark', className, style }: WordmarkProps) {
  const { primary, accent } = getWordmarkColor(theme);
  const fontSize = size;
  const letterSpacing = '-0.02em';

  return (
    <span
      className={className}
      style={{
        fontFamily: DESIGN_TOKENS.fonts.display,
        fontWeight: 700,
        fontSize,
        letterSpacing,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline',
        color: primary,
        ...style,
      }}
    >
      {'Book'}
      <span style={{ color: accent }}>{'K'}</span>
      {'aroo'}
    </span>
  );
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  size = 40,
  theme = 'dark',
  glow = false,
  className,
  style,
}) => (
  <span className={className} style={{ display: 'inline-flex', ...style }}>
    <IconMark size={size} theme={theme} glow={glow} />
  </span>
);

export const Logo: React.FC<LogoProps> = ({
  size = 40,
  variant = 'full-horizontal',
  theme = 'dark',
  glow = false,
  className,
  style,
}) => {
  const wordmarkSize = Math.round(size * 0.65);

  if (variant === 'icon-only') {
    return (
      <span className={className} style={{ display: 'inline-flex', ...style }}>
        <IconMark size={size} theme={theme} glow={glow} />
      </span>
    );
  }

  if (variant === 'wordmark-only') {
    return (
      <Wordmark
        size={wordmarkSize}
        theme={theme}
        className={className}
        style={style}
      />
    );
  }

  if (variant === 'full-stacked') {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          ...style,
        }}
      >
        <IconMark size={size} theme={theme} glow={glow} />
        <Wordmark size={Math.round(size * 0.5)} theme={theme} />
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        ...style,
      }}
    >
      <IconMark size={size} theme={theme} glow={glow} />
      <Wordmark size={wordmarkSize} theme={theme} />
    </span>
  );
};

export { TAGLINE };
export default Logo;
