import { cn } from '@/shared/lib/utils';

type BadgeColor = 'crimson' | 'indigo' | 'purple' | 'success' | 'warning' | 'error' | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  default: 'bg-section text-tx-muted border border-border-l',
  crimson: 'bg-brand-light text-brand border border-brand-border',
  indigo: 'bg-brand-light text-brand border border-brand-border',
  purple: 'bg-brand-light text-brand border border-brand-border',
  success: 'bg-success-bg text-success border border-success-border',
  warning: 'bg-warning-bg text-warning border border-warning-bg',
  error: 'bg-error-bg text-error border border-error-bg',
};

export function Badge({ color = 'default', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide font-sans',
        colorClasses[color],
        className
      )}
      {...rest}
    />
  );
}
