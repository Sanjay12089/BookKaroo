import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-card border border-border-l rounded-lg shadow-card transition-all duration-200',
        hover && 'hover:shadow-card-hover hover:border-border-m cursor-pointer',
        className
      )}
      {...rest}
    />
  )
);
Card.displayName = 'Card';

export const GlassCard = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-card border border-border-l rounded-xl shadow-card transition-all duration-200',
        hover && 'hover:shadow-card-hover hover:border-border-m',
        className
      )}
      {...rest}
    />
  )
);
GlassCard.displayName = 'GlassCard';
