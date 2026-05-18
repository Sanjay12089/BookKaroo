import { cn } from '@/shared/lib/utils';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onToggle?: (active: boolean) => void;
}

export function Chip({ active = false, onToggle, className, onClick, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-sans transition-colors cursor-pointer select-none shrink-0',
        active
          ? 'border border-brand bg-brand-light text-brand font-semibold'
          : 'border border-border-l bg-card text-tx-secondary hover:border-border-m hover:bg-card-hover',
        className
      )}
      onClick={(e) => {
        onToggle?.(!active);
        onClick?.(e);
      }}
      {...rest}
    >
      {active && <span className="text-[11px] leading-none">✓</span>}
      {children}
    </button>
  );
}
