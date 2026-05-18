import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/utils';
import type { TierAvailability } from '../types';

type AvailabilityStatus = 'green' | 'orange' | 'red' | 'sold_out';

function getAvailabilityStatus(pct: number): AvailabilityStatus {
  if (pct === 0) return 'sold_out';
  if (pct > 40)  return 'green';
  if (pct > 15)  return 'orange';
  return 'red';
}

const STATUS_TEXT: Record<AvailabilityStatus, (n: number) => string> = {
  green:    (n) => `${n} tickets available`,
  orange:   (n) => `Filling fast — ${n} left`,
  red:      (n) => `Almost sold out — ${n} left`,
  sold_out: ()  => 'Sold Out',
};

const STATUS_COLOR_CLASS: Record<AvailabilityStatus, string> = {
  green:    'text-success',
  orange:   'text-warning',
  red:      'text-brand',
  sold_out: 'text-tx-muted',
};

const BAR_COLOR_CLASS: Record<AvailabilityStatus, string> = {
  green:    'bg-success-bg',
  orange:   'bg-warning-bg',
  red:      'bg-brand',
  sold_out: 'bg-border-default',
};

interface TierSelectorProps {
  tiers:           TierAvailability[];
  selectedTier:    TierAvailability | null;
  selectedQty:     number;
  onSelectTier:    (tier: TierAvailability) => void;
  onSelectQty:     (qty: number) => void;
  unitPrice?:      number;
  tierPrices?:     Record<string, number>; // price per tier name (lowercase key)
}

export function TierSelector({
  tiers,
  selectedTier,
  selectedQty,
  onSelectTier,
  onSelectQty,
  unitPrice = 0,
  tierPrices = {},
}: TierSelectorProps) {
  if (tiers.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-card border border-border-l">
        <p className="text-sm text-tx-muted font-sans text-center">
          No ticket tiers available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tier cards */}
      <div className="space-y-3">
        {tiers.map((tier) => {
          const status    = getAvailabilityStatus(tier.availabilityPct);
          const isSoldOut = status === 'sold_out';
          const isSelected = selectedTier?.tierName === tier.tierName;

          return (
            <button
              key={tier.tierName}
              type="button"
              disabled={isSoldOut}
              onClick={() => !isSoldOut && onSelectTier(tier)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all',
                isSelected
                  ? 'border-brand bg-brand/5'
                  : isSoldOut
                    ? 'border-border-l bg-card opacity-60 cursor-not-allowed'
                    : 'border-border-l bg-card hover:border-border-m cursor-pointer',
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                {/* Color dot */}
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: tier.color }}
                />
                <span className="font-semibold text-sm text-tx-primary font-sans flex-1">
                  {tier.tierName}
                </span>
                <span className="font-display font-bold text-base text-brand">
                  {formatCurrency(tierPrices[tier.tierName.toLowerCase()] ?? unitPrice)}
                </span>
              </div>

              {/* Availability bar */}
              <div className="w-full h-1.5 rounded-full bg-section mb-1.5 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', BAR_COLOR_CLASS[status])}
                  style={{ width: `${Math.min(100, tier.availabilityPct)}%` }}
                />
              </div>

              {/* Availability text */}
              <p className={cn('text-[11px] font-sans', STATUS_COLOR_CLASS[status])}>
                {STATUS_TEXT[status](tier.available)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quantity selector */}
      {selectedTier && (
        <div className="p-4 rounded-xl bg-card border border-border-l">
          <p className="text-xs font-semibold text-tx-muted font-sans uppercase tracking-wider mb-3">
            Number of Tickets
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(10, selectedTier.available) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onSelectQty(n)}
                disabled={n > selectedTier.available}
                className={cn(
                  'w-10 h-10 rounded-lg text-sm font-bold font-sans transition-all',
                  selectedQty === n
                    ? 'bg-brand text-white shadow-[0_0_0_2px_rgba(229,9,20,0.35)] scale-105'
                    : n > selectedTier.available
                      ? 'bg-section text-tx-muted border-2 border-border-l cursor-not-allowed opacity-30'
                      : 'bg-section text-tx-primary border-2 border-border-m hover:border-brand hover:text-brand',
                )}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Pricing preview */}
          {selectedQty > 0 && unitPrice > 0 && (
            <div className="mt-4 pt-3 border-t border-border-l">
              <div className="flex justify-between items-center">
                <span className="text-sm text-tx-muted font-sans">
                  {selectedQty} × {formatCurrency(unitPrice)}
                </span>
                <span className="font-display font-bold text-base text-brand">
                  {formatCurrency(selectedQty * unitPrice)}
                </span>
              </div>
              <p className="text-[10px] text-tx-muted font-sans mt-1">
                + convenience fee & taxes applicable
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
