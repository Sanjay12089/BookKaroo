import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSeatStore } from '../store/seatStore';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useShowSeats, useCreateOrder, useValidateCoupon, useReleaseSeats } from '../api/useBooking';
import { calculatePricing } from '@/shared/lib/pricing';
import { OrderSummaryPanel } from '../components/OrderSummaryPanel';
import { CountdownRing } from '@/shared/components/ui/CountdownRing';
import { toast } from '@/shared/components/ui/Toast';
import { ROUTES } from '@/shared/constants';
import type { CouponValidation } from '../types';
import type { ApiError } from '@/shared/types';

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { showId, selectedSeats, lockExpiresAt, clearSeats } = useSeatStore();
  const { user }                                              = useAuthStore();
  const checkoutStore                                         = useCheckoutStore();

  // Guard: no seats → back to home
  useEffect(() => {
    if (selectedSeats.length === 0) navigate('/');
  }, [selectedSeats.length]);

  const { data: seatsData } = useShowSeats(showId ?? '');
  const createOrderMutation = useCreateOrder();
  const validateCoupon      = useValidateCoupon();
  const releaseMutation     = useReleaseSeats();

  // Idempotency key — stable for the lifetime of this checkout session
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  // Contact fields
  const [mobile, setMobile] = useState(user?.mobile ?? '');
  const [email,  setEmail]  = useState(user?.email  ?? '');

  // Coupon state
  const [couponInput,  setCouponInput]  = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [couponError,  setCouponError]  = useState<string | null>(null);

  // T&C
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Countdown
  const [remaining, setRemaining] = useState(8 * 60);
  const expiredRef = useRef(false);

  useEffect(() => {
    expiredRef.current = false;
    if (!lockExpiresAt) { setRemaining(8 * 60); return; }
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(lockExpiresAt).getTime() - Date.now()) / 1000));
      setRemaining(diff);
      if (diff === 0 && !expiredRef.current) {
        expiredRef.current = true;
        toast('Your seat hold expired. Please reselect.', 'error');
        void releaseMutation.mutateAsync(showId ?? '').catch(() => {});
        clearSeats(showId ?? undefined);
        navigate(ROUTES.MOVIES);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockExpiresAt, showId]);

  // ── Pricing ───────────────────────────────────────────────────────────────
  const layout    = seatsData?.screenLayout;
  const stateCode = user?.stateCode ?? '27'; // default Maharashtra if not set

  function getSeatPrice(label: string): number {
    if (!layout) return 260;
    const row = label[0] ?? 'G';
    const cat = layout.categories.find((c) => c.rows.includes(row));
    return cat?.price ?? 260;
  }

  const avgPrice = selectedSeats.length > 0
    ? selectedSeats.reduce((s, l) => s + getSeatPrice(l), 0) / selectedSeats.length
    : 260;

  const breakdown = calculatePricing(
    selectedSeats.length,
    avgPrice,
    stateCode,
    appliedCoupon ? { discount: appliedCoupon.discount, hasOfferFee: true } : null,
  );

  // ── Coupon handlers ───────────────────────────────────────────────────────
  async function handleApplyCoupon() {
    if (!couponInput) return;
    setCouponError(null);
    try {
      const result = await validateCoupon.mutateAsync({
        code:         couponInput,
        showId:       showId ?? '',
        userId:       user?.id,
        ticketAmount: breakdown.ticketAmount,
      });
      setAppliedCoupon(result);
      toast(`${result.code} applied! ₹${result.discount} off.`, 'success');
    } catch (err: unknown) {
      const msg = (err as ApiError)?.message ?? 'Invalid coupon.';
      setCouponError(msg);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  }

  // ── Pay handler ───────────────────────────────────────────────────────────
  async function handlePay() {
    if (!mobile || !email) {
      toast('Please fill in your contact details.', 'error');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast('Enter a valid 10-digit mobile number.', 'error');
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        showId:         showId!,
        seats:          selectedSeats,
        idempotencyKey,
        couponCode:     appliedCoupon?.code,
      });

      checkoutStore.setOrder(result);
      checkoutStore.setContact(mobile, email);
      if (appliedCoupon) checkoutStore.setCoupon(appliedCoupon.code, appliedCoupon);

      navigate(ROUTES.CONFIRMATION);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr?.statusCode === 409) {
        toast('Seats no longer available. Please reselect.', 'error');
        clearSeats(showId ?? undefined);
        navigate(ROUTES.MOVIES);
      } else {
        toast(apiErr?.message ?? 'Payment failed. Please try again.', 'error');
      }
    }
  }

  // ── Seat group labels ─────────────────────────────────────────────────────
  const seatGroups = (() => {
    if (!layout) return [{ category: 'Seats', seats: selectedSeats }];
    const map = new Map<string, string[]>();
    for (const label of selectedSeats) {
      const row = label[0] ?? 'G';
      const catName = layout.categories.find((c) => c.rows.includes(row))?.name ?? 'Seats';
      map.set(catName, [...(map.get(catName) ?? []), label]);
    }
    return Array.from(map.entries()).map(([category, seats]) => ({ category, seats }));
  })();

  const show = seatsData?.show;

  if (selectedSeats.length === 0) return null;

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans pb-10">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 flex items-center gap-3 px-4 md:px-6 bg-bg-surface/90 backdrop-blur-md border-b border-border-default">
        <Link to={-1 as never}>
          <button className="px-3 py-1.5 rounded-full bg-bg-surface2 border border-border-default text-text-secondary text-sm">← Back</button>
        </Link>
        <span className="font-semibold text-sm text-text-primary flex-1">Checkout</span>
        {lockExpiresAt && (
          <CountdownRing totalSeconds={8 * 60} remainingSeconds={remaining} size={44} strokeWidth={4} />
        )}
      </header>

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 pt-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* ── LEFT PANEL ── */}
        <div className="space-y-4">
          {/* Movie card */}
          <div className="p-5 rounded-xl bg-bg-surface border border-border-default flex gap-4">
            <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden bg-bg-surface2 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-accent-indigo/20 to-accent-purple/20" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-lg leading-tight truncate">
                {show?.movieTitle ?? 'Loading…'}
              </p>
              <p className="text-sm text-text-secondary font-sans mt-0.5">
                {show?.format} · {show?.language}
              </p>
              <p className="text-sm text-text-secondary font-sans">
                {show?.showDate} · {show?.showTime}
              </p>
              <p className="text-sm text-text-muted font-sans mt-1">{show?.venueName}</p>

              {/* Seat groups */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {seatGroups.map(({ category, seats }) => (
                  <span key={category} className="text-xs bg-bg-surface2 border border-border-default rounded px-2 py-0.5 font-mono text-text-secondary uppercase tracking-wide">
                    {category} — {seats.join(', ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="p-5 rounded-xl bg-bg-surface border border-border-default">
            <h3 className="font-semibold text-sm mb-1 font-sans">Contact Details</h3>
            <p className="text-xs text-text-muted font-sans mb-4">Booking confirmation will be sent here</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted font-sans mb-1">Mobile number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2.5 rounded-lg bg-bg-base border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-indigo font-sans"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted font-sans mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-bg-base border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-indigo font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <OrderSummaryPanel
          breakdown={breakdown}
          coupon={appliedCoupon}
          couponInput={couponInput}
          couponError={couponError}
          couponLoading={validateCoupon.isPending}
          agreedToTerms={agreedToTerms}
          payLoading={createOrderMutation.isPending}
          onCouponChange={setCouponInput}
          onApplyCoupon={() => void handleApplyCoupon()}
          onRemoveCoupon={handleRemoveCoupon}
          onTermsChange={setAgreedToTerms}
          onPay={() => void handlePay()}
        />
      </div>
    </div>
  );
}
