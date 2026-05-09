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
        'inline-flex items-center gap-1.5 px-3 h-[30px] rounded-full text-sm font-medium font-sans transition-all duration-150 cursor-pointer',
        active
          ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white border-transparent shadow-[0_10px_40px_-10px_rgba(99,102,241,0.55)]'
          : 'bg-bg-surface border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary',
        className
      )}
      onClick={(e) => {
        onToggle?.(!active);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
