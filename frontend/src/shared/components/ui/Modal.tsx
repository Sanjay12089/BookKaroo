import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg', className }: ModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-fade-up"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={cn('w-full bg-card border border-border-l rounded-xl shadow-modal overflow-y-auto max-h-[90vh]', maxWidth, className)}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-l">
            <span className="font-display font-semibold text-lg text-tx-primary tracking-tight">{title}</span>
            <button onClick={onClose} className="text-tx-muted hover:text-tx-primary transition-colors p-1 rounded-md">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
