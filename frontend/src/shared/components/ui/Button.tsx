import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gradient' | 'destructive';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-accent-crimson-light to-accent-crimson text-white shadow-[0_10px_40px_-10px_rgba(229,9,20,0.55)] hover:-translate-y-px hover:shadow-[0_14px_50px_-10px_rgba(229,9,20,0.7)]',
  secondary:
    'bg-gradient-to-r from-accent-indigo to-accent-purple text-white shadow-[0_10px_40px_-10px_rgba(99,102,241,0.55)] hover:-translate-y-px',
  ghost:
    'bg-bg-surface border border-border-default text-text-primary hover:bg-bg-surface2 hover:border-border-strong',
  gradient:
    'bg-gradient-to-r from-accent-indigo via-accent-purple to-accent-crimson text-white hover:-translate-y-px',
  destructive:
    'bg-gradient-to-r from-semantic-error to-red-700 text-white hover:-translate-y-px',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-full',
  md: 'h-10 px-5 text-sm rounded-full',
  lg: 'h-12 px-7 text-base rounded-full',
  xl: 'h-14 px-9 text-base rounded-full',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, className, children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold font-sans transition-all duration-[220ms] ease-in-out whitespace-nowrap select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
