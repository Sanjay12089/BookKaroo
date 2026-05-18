import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export interface Column<T> {
  key:      string;
  header:   string;
  width?:   string;
  render:   (row: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns:       Column<T>[];
  data:          T[];
  isLoading:     boolean;
  emptyMessage?: string;
  onRowClick?:   (row: T) => void;
}

export function AdminTable<T>({
  columns, data, isLoading, emptyMessage = 'No data found.', onRowClick,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-l">
      <table className="w-full text-sm font-sans border-collapse">
        <thead className="bg-section border-b border-border-l sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className="px-4 py-3 text-left text-[11px] font-semibold text-tx-muted uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 8 }, (_, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-page' : 'bg-card'}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <Skeleton height={14} width="80%" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center text-tx-muted font-sans">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-border-l/50 transition-colors',
                  onRowClick ? 'cursor-pointer hover:bg-section' : '',
                  i % 2 === 0 ? 'bg-page' : 'bg-card',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
