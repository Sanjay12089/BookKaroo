import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { formatCurrency } from '@/shared/lib/utils';
import type { BookingListItem } from '@/features/booking/types';

interface CancelConfirmModalProps {
  booking:   BookingListItem;
  isPending: boolean;
  onConfirm: () => void;
  onClose:   () => void;
}

export function CancelConfirmModal({ booking, isPending, onConfirm, onClose }: CancelConfirmModalProps) {
  // Convenience fee estimate: base + 18% GST per seat
  const convFeeBase = booking.seats.length * 59;
  const convFeeGst  = Math.round(convFeeBase * 0.18 * 100) / 100;
  const convFee     = Math.round((convFeeBase + convFeeGst) * 100) / 100;
  const refundAmount = Math.max(0, Math.round((booking.amountPaid - convFee) * 100) / 100);

  return (
    <Modal
      open
      onClose={onClose}
      maxWidth="max-w-sm"
      title={
        <span className="flex items-center gap-2 text-semantic-error">
          <AlertTriangle size={18} />
          Cancel Booking?
        </span>
      }
    >
      {/* Show summary */}
      <div className="p-3 rounded-lg bg-bg-surface2 border border-border-default mb-4">
        <p className="font-semibold text-sm text-text-primary font-sans line-clamp-1">{booking.title}</p>
        <p className="text-xs text-text-muted font-sans mt-0.5">
          {booking.showDate} · {booking.showTime}
        </p>
        <p className="text-xs text-text-muted font-sans">{booking.venueName}</p>
        <p className="text-xs font-mono text-text-muted mt-1">
          {booking.seats.map(s => s.label).join(', ')}
        </p>
      </div>

      {/* Refund breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm font-sans">
          <span className="text-text-secondary">Amount paid</span>
          <span className="text-text-primary">{formatCurrency(booking.amountPaid)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans">
          <span className="text-text-secondary">Convenience fee (non-refundable)</span>
          <span className="text-semantic-error">- {formatCurrency(convFee)}</span>
        </div>
        <div className="border-t border-border-default my-1" />
        <div className="flex justify-between font-sans">
          <span className="text-sm font-semibold text-text-primary">Estimated refund</span>
          <span className="text-base font-bold text-semantic-success">{formatCurrency(refundAmount)}</span>
        </div>
      </div>

      {/* Warning */}
      <div className="flex gap-2 p-3 rounded-lg bg-semantic-warning/08 border border-semantic-warning/25 mb-5">
        <AlertTriangle size={14} className="text-semantic-warning flex-shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary font-sans">
          <p>Refunds are processed in 7 business days.</p>
          <p className="mt-0.5 text-semantic-error">This action cannot be undone.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="destructive"
          fullWidth
          loading={isPending}
          onClick={onConfirm}
        >
          {isPending ? 'Cancelling...' : 'Yes, Cancel Booking'}
        </Button>
        <Button variant="ghost" fullWidth onClick={onClose} disabled={isPending}>
          Keep Booking
        </Button>
      </div>
    </Modal>
  );
}
