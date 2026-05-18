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
    'bg-brand hover:bg-brand-dark text-white font-semibold shadow-btn-brand hover:shadow-btn-hover hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'border border-brand text-brand bg-transparent hover:bg-brand-light font-medium',
  ghost:
    'bg-transparent text-tx-secondary hover:bg-section font-medium',
  gradient:
    'bg-brand hover:bg-brand-dark text-white font-semibold shadow-btn-brand hover:shadow-btn-hover hover:-translate-y-0.5',
  destructive:
    'bg-error hover:opacity-90 text-white font-semibold',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-md',
  lg: 'px-7 py-3 text-base rounded-md',
  xl: 'px-9 py-4 text-base rounded-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, className, children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans transition-all duration-200 ease-in-out whitespace-nowrap select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed shadow-none hover:translate-y-0',
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
