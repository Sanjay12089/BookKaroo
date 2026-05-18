import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

const icons = { success: CheckCircle, error: XCircle, info: Info, warning: Info };
const accentClass = {
  success: 'border-l-success text-success',
  error: 'border-l-error text-error',
  info: 'border-l-info text-info',
  warning: 'border-l-warning text-warning',
};

export function Toast({ message, variant = 'info', onClose }: ToastProps) {
  const Icon = icons[variant];

  useEffect(() => {
    const id = setTimeout(() => onClose?.(), 4000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div className={cn(
      'bg-white border border-border-l border-l-4 rounded-lg shadow-modal flex items-start gap-3 px-4 py-3 min-w-72 max-w-sm animate-fade-up font-sans',
      accentClass[variant]
    )}>
      <Icon size={18} className="flex-shrink-0 mt-0.5" />
      <span className="flex-1 text-sm text-tx-primary">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-tx-muted hover:text-tx-primary flex-shrink-0">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// ─── Toast container + simple hook ───────────────────────────────────────────

interface ToastItem { id: string; message: string; variant: ToastVariant; }

let _addToast: ((item: Omit<ToastItem, 'id'>) => void) | null = null;

export function toast(message: string, variant: ToastVariant = 'info') {
  _addToast?.({ message, variant });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    _addToast = (item) =>
      setToasts((prev) => [...prev, { ...item, id: Math.random().toString(36).slice(2) }]);
    return () => { _addToast = null; };
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} variant={t.variant} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}
