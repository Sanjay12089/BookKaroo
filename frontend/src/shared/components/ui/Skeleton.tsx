import { cn } from '@/shared/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ width, height, className, style, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton rounded', className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
