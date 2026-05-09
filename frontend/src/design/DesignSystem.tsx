import React, { useEffect, useRef, useState } from 'react';
import { DESIGN_TOKENS } from './tokens';

const T = DESIGN_TOKENS;

// ─── Google Fonts ──────────────────────────────────────────────────────────────

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

// ─── Global CSS ────────────────────────────────────────────────────────────────

export const globalCSS = `
@keyframes bk-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
@keyframes bk-fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bk-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
@keyframes bk-stamp {
  0%   { opacity: 0; transform: scale(1.6) rotate(-18deg); }
  60%  { opacity: 1; transform: scale(0.9) rotate(-6deg); }
  100% { opacity: 1; transform: scale(1) rotate(-8deg); }
}
@keyframes bk-confetti {
  0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(80px) rotate(720deg); opacity: 0; }
}
@keyframes bk-countdown-color {
  0%   { stroke: ${T.colors.semantic.success}; }
  60%  { stroke: ${T.colors.semantic.warning}; }
  85%  { stroke: ${T.colors.semantic.error}; }
  100% { stroke: ${T.colors.semantic.error}; }
}

/* Scrollbar */
* { scrollbar-width: thin; scrollbar-color: ${T.colors.bg.surface3} transparent; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${T.colors.bg.surface3}; border-radius: ${T.radius.full}; }
::-webkit-scrollbar-thumb:hover { background: ${T.colors.border.strong}; }

/* Transition utilities */
.bk-transition { transition: all ${T.motion.duration.base} ${T.motion.ease.default}; }
.bk-transition-fast { transition: all ${T.motion.duration.fast} ${T.motion.ease.out}; }
.bk-transition-slow { transition: all ${T.motion.duration.slow} ${T.motion.ease.out}; }
.bk-fade-up { animation: bk-fadeUp ${T.motion.duration.slow} ${T.motion.ease.out} both; }
`;

// ─── Shared helpers ────────────────────────────────────────────────────────────

function cx(...parts: (string | undefined | false | null)[]): string {
  return parts.filter(Boolean).join(' ');
}

// ─── Button ────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const buttonStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson} 55%, ${T.colors.accent.crimsonDark})`,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: T.shadows.glowCrimson,
  },
  secondary: {
    background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: T.shadows.glowIndigo,
  },
  ghost: {
    background: T.colors.bg.surface,
    color: T.colors.text.primary,
    border: `1px solid ${T.colors.border.default}`,
  },
  gradient: {
    background: `linear-gradient(135deg, ${T.colors.accent.indigo} 0%, ${T.colors.accent.crimson} 100%)`,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 10px 40px -10px rgba(99,102,241,0.4)',
  },
};

const buttonSizes: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: 32, padding: '0 12px', fontSize: 12, borderRadius: T.radius.full },
  md: { height: 40, padding: '0 18px', fontSize: 14, borderRadius: T.radius.full },
  lg: { height: 48, padding: '0 24px', fontSize: 15, borderRadius: T.radius.full },
  xl: { height: 56, padding: '0 32px', fontSize: 16, borderRadius: T.radius.full },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  style,
  className,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cx('bk-transition', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: T.fonts.body,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transform: hovered && !disabled && !loading ? 'translateY(-1px)' : 'none',
        ...buttonStyles[variant],
        ...buttonSizes[size],
        ...style,
      }}
    >
      {loading ? (
        <span style={{
          width: 14, height: 14, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          animation: `bk-pulse 0.8s linear infinite`,
          display: 'inline-block',
        }} />
      ) : null}
      {children}
    </button>
  );
};

// ─── Card ──────────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: number | string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 20,
  hover = false,
  style,
  className,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      {...rest}
      className={cx('bk-transition', className)}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: T.colors.bg.surface,
        border: `1px solid ${hovered ? T.colors.border.strong : T.colors.border.default}`,
        borderRadius: T.radius.lg,
        padding,
        boxShadow: hovered ? T.shadows.md : T.shadows.sm,
        transform: hovered ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── GlassCard ─────────────────────────────────────────────────────────────────

export const GlassCard: React.FC<CardProps> = ({
  children,
  padding = 20,
  hover = false,
  style,
  className,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      {...rest}
      className={cx('bk-transition', className)}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: hovered ? T.colors.bg.surface2 : T.colors.bg.surface,
        border: `1px solid ${hovered ? T.colors.border.strong : T.colors.border.default}`,
        borderRadius: T.radius.xl,
        backdropFilter: 'blur(18px) saturate(130%)',
        WebkitBackdropFilter: 'blur(18px) saturate(130%)',
        padding,
        boxShadow: `${T.shadows.md}, inset 0 1px 0 ${T.colors.border.subtle}`,
        transform: hovered ? 'translateY(-3px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── Badge ─────────────────────────────────────────────────────────────────────

type BadgeColor = 'crimson' | 'indigo' | 'purple' | 'success' | 'warning' | 'error' | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const badgeColors: Record<BadgeColor, React.CSSProperties> = {
  default: {
    background: T.colors.bg.surface2,
    color: T.colors.text.secondary,
    border: `1px solid ${T.colors.border.default}`,
  },
  crimson: {
    background: 'rgba(229, 9, 20, 0.12)',
    color: '#FF6770',
    border: '1px solid rgba(229, 9, 20, 0.25)',
  },
  indigo: {
    background: 'rgba(99, 102, 241, 0.14)',
    color: '#A5B4FC',
    border: '1px solid rgba(99, 102, 241, 0.28)',
  },
  purple: {
    background: 'rgba(168, 85, 247, 0.14)',
    color: '#C4A0FF',
    border: '1px solid rgba(168, 85, 247, 0.28)',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#6EE7B7',
    border: '1px solid rgba(16, 185, 129, 0.28)',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: '#FCD34D',
    border: '1px solid rgba(245, 158, 11, 0.28)',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#FCA5A5',
    border: '1px solid rgba(239, 68, 68, 0.28)',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  color = 'default',
  children,
  style,
  className,
  ...rest
}) => (
  <span
    {...rest}
    className={className}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: T.radius.full,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: T.fonts.body,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      ...badgeColors[color],
      ...style,
    }}
  >
    {children}
  </span>
);

// ─── Chip ──────────────────────────────────────────────────────────────────────

export interface ChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onToggle?: (active: boolean) => void;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onToggle,
  children,
  style,
  className,
  onClick,
  ...rest
}) => (
  <button
    {...rest}
    className={cx('bk-transition', className)}
    onClick={(e) => {
      onToggle?.(!active);
      onClick?.(e);
    }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      height: 30,
      borderRadius: T.radius.full,
      fontSize: 13,
      fontWeight: 500,
      fontFamily: T.fonts.body,
      cursor: 'pointer',
      background: active
        ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`
        : T.colors.bg.surface,
      color: active ? '#FFFFFF' : T.colors.text.secondary,
      border: active ? 'none' : `1px solid ${T.colors.border.default}`,
      boxShadow: active ? T.shadows.glowIndigo : 'none',
      ...style,
    }}
  >
    {children}
  </button>
);

// ─── Skeleton ──────────────────────────────────────────────────────────────────

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  radius = T.radius.md,
  className,
  style,
}) => (
  <span
    className={className}
    style={{
      display: 'block',
      width,
      height,
      borderRadius: radius,
      background: `linear-gradient(90deg, ${T.colors.bg.surface} 25%, ${T.colors.bg.surface3} 50%, ${T.colors.bg.surface} 75%)`,
      backgroundSize: '600px 100%',
      animation: `bk-shimmer 1.4s ease-in-out infinite`,
      ...style,
    }}
  />
);

// ─── Input ─────────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  inputSize = 'md',
  id,
  className,
  style,
  value,
  defaultValue,
  onChange,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const inputId = id ?? `bk-input-${React.useId().replace(/:/g, '')}`;
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = String(currentValue).length > 0;
  const floated = focused || hasValue;

  const heightMap = { sm: 40, md: 48, lg: 56 };

  return (
    <div className={className} style={{ display: 'grid', gap: 4, ...style }}>
      <div style={{ position: 'relative', height: heightMap[inputSize] }}>
        {label && (
          <label
            htmlFor={inputId}
            className="bk-transition"
            style={{
              position: 'absolute',
              left: 14,
              top: floated ? 6 : '50%',
              transform: floated ? 'none' : 'translateY(-50%)',
              fontSize: floated ? 10 : 14,
              fontWeight: floated ? 600 : 400,
              color: error
                ? T.colors.semantic.error
                : focused
                ? T.colors.accent.indigo
                : T.colors.text.muted,
              pointerEvents: 'none',
              fontFamily: T.fonts.body,
              letterSpacing: floated ? '0.06em' : 'normal',
              textTransform: floated ? 'uppercase' : 'none',
              zIndex: 1,
            }}
          >
            {label}
          </label>
        )}
        <input
          {...rest}
          id={inputId}
          value={isControlled ? value : internalValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          }}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          className="bk-transition"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: T.colors.bg.surface,
            border: `1px solid ${error ? T.colors.semantic.error : focused ? T.colors.accent.indigo : T.colors.border.default}`,
            borderRadius: T.radius.md,
            padding: label ? `20px 14px 6px` : `0 14px`,
            fontSize: 14,
            fontFamily: T.fonts.body,
            color: T.colors.text.primary,
            outline: 'none',
            boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)'}` : 'none',
          }}
        />
      </div>
      {error && (
        <span style={{ fontSize: 12, color: T.colors.semantic.error, fontFamily: T.fonts.body }}>
          {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 12, color: T.colors.text.muted, fontFamily: T.fonts.body }}>
          {hint}
        </span>
      )}
    </div>
  );
};

// ─── Modal ─────────────────────────────────────────────────────────────────────

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 520,
  className,
  style,
}) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: `bk-fadeUp ${T.motion.duration.base} ${T.motion.ease.out} both`,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={className}
        style={{
          background: T.colors.bg.surface,
          border: `1px solid ${T.colors.border.default}`,
          borderRadius: T.radius.xl,
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: T.shadows.lg,
          ...style,
        }}
      >
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${T.colors.border.default}`,
          }}>
            <span style={{
              fontFamily: T.fonts.display,
              fontWeight: 600,
              fontSize: 18,
              color: T.colors.text.primary,
              letterSpacing: '-0.02em',
            }}>
              {title}
            </span>
            <button
              onClick={onClose}
              className="bk-transition"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: T.colors.text.muted, padding: 4,
                borderRadius: T.radius.sm,
                fontSize: 20, lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

// ─── BottomSheet ───────────────────────────────────────────────────────────────

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  title,
  children,
  className,
  style,
}) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'flex-end',
        background: 'rgba(10, 14, 26, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={className}
        style={{
          width: '100%',
          background: T.colors.bg.surface,
          border: `1px solid ${T.colors.border.default}`,
          borderTopLeftRadius: T.radius.xl,
          borderTopRightRadius: T.radius.xl,
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
          boxShadow: T.shadows.lg,
          animation: `bk-fadeUp ${T.motion.duration.base} ${T.motion.ease.out} both`,
          ...style,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <span style={{
            width: 36, height: 4,
            background: T.colors.border.strong,
            borderRadius: T.radius.full,
            display: 'block',
          }} />
        </div>
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px 16px',
          }}>
            <span style={{
              fontFamily: T.fonts.display,
              fontWeight: 600,
              fontSize: 17,
              color: T.colors.text.primary,
              letterSpacing: '-0.02em',
            }}>
              {title}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: T.colors.text.muted, fontSize: 20, lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: '0 20px 20px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── StarRating ────────────────────────────────────────────────────────────────

export interface StarRatingProps {
  value?: number;
  max?: 5 | 10;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  max = 5,
  onChange,
  readOnly = false,
  size = 20,
  className,
  style,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', gap: 2, ...style }}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < display;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => !readOnly && setHovered(i + 1)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            className="bk-transition-fast"
            style={{
              background: 'none', border: 'none', cursor: readOnly ? 'default' : 'pointer',
              padding: 1,
              color: filled ? T.colors.seat.recliner : T.colors.border.strong,
              fontSize: size,
              lineHeight: 1,
            }}
            aria-label={`Rate ${i + 1} of ${max}`}
          >
            ★
          </button>
        );
      })}
    </span>
  );
};

// ─── CountdownRing ─────────────────────────────────────────────────────────────

export interface CountdownRingProps {
  totalSeconds: number;
  remainingSeconds: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CountdownRing: React.FC<CountdownRingProps> = ({
  totalSeconds,
  remainingSeconds,
  size = 64,
  strokeWidth = 5,
  showLabel = true,
  className,
  style,
}) => {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, remainingSeconds / totalSeconds));
  const dash = circumference * pct;

  const pctElapsed = 1 - pct;
  const trackColor =
    pctElapsed < 0.6
      ? T.colors.semantic.success
      : pctElapsed < 0.85
      ? T.colors.semantic.warning
      : T.colors.semantic.error;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const label = `${mins}:${String(secs).padStart(2, '0')}`;

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative', ...style }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={T.colors.bg.surface3}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          style={{ transition: `stroke-dasharray ${T.motion.duration.base} ${T.motion.ease.default}, stroke 0.5s ease` }}
        />
      </svg>
      {showLabel && (
        <span style={{
          position: 'absolute',
          fontFamily: T.fonts.mono,
          fontSize: size * 0.22,
          fontWeight: 600,
          color: trackColor,
          letterSpacing: '-0.02em',
        }}>
          {label}
        </span>
      )}
    </span>
  );
};

// ─── SectionHeader ─────────────────────────────────────────────────────────────

export interface SectionHeaderProps {
  title: React.ReactNode;
  seeAllHref?: string;
  seeAllLabel?: string;
  onSeeAll?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  seeAllHref,
  seeAllLabel = 'See all →',
  onSeeAll,
  className,
  style,
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: T.spacing[4],
      ...style,
    }}
  >
    <h2 style={{
      margin: 0,
      fontFamily: T.fonts.display,
      fontWeight: 600,
      fontSize: 'clamp(20px, 3vw, 28px)',
      letterSpacing: '-0.02em',
      color: T.colors.text.primary,
    }}>
      {title}
    </h2>
    {(seeAllHref || onSeeAll) && (
      <a
        href={seeAllHref ?? '#'}
        onClick={onSeeAll ? (e) => { e.preventDefault(); onSeeAll(); } : undefined}
        className="bk-transition"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: T.colors.text.secondary,
          textDecoration: 'none',
          fontFamily: T.fonts.body,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = T.colors.text.primary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = T.colors.text.secondary)}
      >
        {seeAllLabel}
      </a>
    )}
  </div>
);

// ─── Toast ─────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const toastIcons: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const toastAccents: Record<ToastVariant, string> = {
  success: T.colors.semantic.success,
  error: T.colors.semantic.error,
  info: T.colors.accent.indigo,
};

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  onClose,
  className,
  style,
}) => {
  const accent = toastAccents[variant];

  return (
    <div
      className={cx('bk-fade-up', className)}
      role="alert"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: T.colors.bg.surface2,
        border: `1px solid ${T.colors.border.default}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: T.radius.md,
        boxShadow: T.shadows.md,
        minWidth: 260,
        maxWidth: 420,
        fontFamily: T.fonts.body,
        ...style,
      }}
    >
      <span style={{
        width: 22, height: 22,
        borderRadius: T.radius.full,
        background: `${accent}22`,
        border: `1.5px solid ${accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: accent,
        flexShrink: 0,
      }}>
        {toastIcons[variant]}
      </span>
      <span style={{ flex: 1, fontSize: 14, color: T.colors.text.primary }}>
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className="bk-transition-fast"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.colors.text.muted, fontSize: 18, lineHeight: 1,
            padding: 2, flexShrink: 0,
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
};

// ─── ToastContainer ────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

const positionStyles: Record<string, React.CSSProperties> = {
  'top-right':    { top: 20, right: 20 },
  'top-center':   { top: 20, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 20, right: 20 },
  'bottom-center':{ bottom: 20, left: '50%', transform: 'translateX(-50%)' },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right',
}) => (
  <div style={{
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    ...positionStyles[position],
  }}>
    {toasts.map((t) => (
      <Toast key={t.id} message={t.message} variant={t.variant} onClose={() => onRemove(t.id)} />
    ))}
  </div>
);
