export type { Booking, BookingSeat, Payment, SeatCell, SeatRow, PricingBreakdown } from '@/shared/types';
export type { SeatState } from '@/shared/types';

// ── Screen layout (from /api/shows/{showId}/seats) ────────────────────────────

export interface SeatCategory {
  name:           string;
  rows:           string[];
  price:          number;
  color:          string;
}

export interface ScreenLayout {
  rows:           number;
  cols:           number;
  categories:     SeatCategory[];
  blockedSeats:   string[];
  aisleAfterCols: number[];
}

export interface ShowInfo {
  movieTitle:  string;
  format:      string;
  language:    string;
  showDate:    string;
  showTime:    string;
  venueName:   string;
  screenName:  string;
}

export interface ShowSeatsData {
  showId:       string;
  screenLayout: ScreenLayout | null;
  bookedSeats:  string[];
  lockedSeats:  string[];
  show?:        ShowInfo;
}

// ── Seat lock API ─────────────────────────────────────────────────────────────

export interface LockSeatsRequest {
  showId: string;
  seats:  string[];
}

export interface SeatLockResponse {
  lockId:      string;
  expiresAt:   string;
  lockedSeats: string[];
}

// ── Checkout / Payment ────────────────────────────────────────────────────────

export interface CreateOrderRequest {
  showId:         string;
  seats:          string[];
  idempotencyKey: string;
  couponCode?:    string;
}

export interface CreateOrderResponse {
  orderId:         string;
  bookingRef:      string;
  providerOrderId: string;
  provider:        string;
  amount:          number;
  currency:        string;
  breakdown:       import('@/shared/types').PricingBreakdown;
}

export interface ValidateCouponRequest {
  code:         string;
  showId:       string;
  userId?:      string;
  ticketAmount: number;
}

export interface CouponValidation {
  valid:       boolean;
  couponId:    string;
  code:        string;
  discount:    number;
  description: string;
}
