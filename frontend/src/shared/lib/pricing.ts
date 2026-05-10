import type { PricingBreakdown } from '@/shared/types';

const CONV_FEE_PER_TICKET = 59;
const OFFER_FEE_BASE      = 15;
const COMPANY_STATE_CODE  = import.meta.env.VITE_COMPANY_STATE_CODE ?? '24';

export interface CouponInput {
  discount: number;
  hasOfferFee: boolean;
}

export function calculatePricing(
  qty: number,
  seatPrice: number,
  customerStateCode: string,
  coupon: CouponInput | null,
): PricingBreakdown {
  const isIntraState  = customerStateCode === COMPANY_STATE_CODE;
  const ticketAmount  = round(qty * seatPrice);
  const convFee       = round(qty * CONV_FEE_PER_TICKET);
  const offerFee      = coupon?.hasOfferFee ? OFFER_FEE_BASE : 0;
  const discount      = round(coupon?.discount ?? 0);
  const taxableAmount = round(convFee + offerFee);

  let cgst = 0, sgst = 0, igst = 0;
  if (isIntraState) {
    cgst = round(taxableAmount * 0.09);
    sgst = round(taxableAmount * 0.09);
  } else {
    igst = round(taxableAmount * 0.18);
  }

  const convFeeGst        = round(convFee * 0.18);
  const offerFeeGst       = offerFee > 0 ? round(offerFee * 0.18) : 0;
  const amountPaid        = round(
    Math.max(0, ticketAmount + convFee + offerFee + cgst + sgst + igst - discount)
  );

  return {
    ticketAmount,
    convenienceFee:        convFee,
    convenienceFeeGst:     convFeeGst,
    offerProcessingFee:    offerFee,
    offerProcessingFeeGst: offerFeeGst,
    taxableAmount,
    cgst,
    sgst,
    igst,
    discount,
    amountPaid,
    isIntraState,
  };
}

function round(v: number): number {
  return Math.round(v * 100) / 100;
}
