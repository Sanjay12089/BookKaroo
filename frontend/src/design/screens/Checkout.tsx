import { useState, Fragment } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Logo } from '../Logo';
import { CountdownRing, GlassCard, Input } from '../DesignSystem';
import { MOVIES } from './mockData';

const MOVIE = MOVIES[1]; // Chhaava
const TMDB = 'https://image.tmdb.org/t/p/w300';

const SEAT_DATA = { seats: ['H12', 'H13'], category: 'Executive', priceEach: 420 };
const CONV_FEE_EACH = 59;
const VALID_COUPON = 'KGF450';
const COUPON_DISCOUNT = 450;
const OFFER_PROC_FEE = 17.70;

type CouponState = 'idle' | 'applied' | 'error';

// ─── Steps indicator ──────────────────────────────────────────────────────────

function Steps() {
  const steps = [
    { label: 'Seats', done: true },
    { label: 'Checkout', active: true },
    { label: 'Confirmation' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, padding: '24px 0 8px', alignItems: 'center', fontSize: 12 }}>
      {steps.map((s, i) => (
        <Fragment key={s.label}>
          {i > 0 && <span style={{ flex: '0 0 28px', height: 1, background: T.colors.border.default }} />}
          <span style={{
            display: 'inline-flex', gap: 8, alignItems: 'center',
            padding: '6px 12px', borderRadius: T.radius.full, fontSize: 12,
            background: s.done
              ? 'rgba(16,185,129,0.12)'
              : s.active
              ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`
              : T.colors.bg.surface,
            border: `1px solid ${s.done ? 'rgba(16,185,129,0.28)' : s.active ? 'transparent' : T.colors.border.default}`,
            color: s.done ? T.colors.tint.successText : s.active ? T.colors.tint.white : T.colors.text.muted,
            boxShadow: s.active ? T.shadows.glowIndigo : 'none',
            fontFamily: T.fonts.body,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: T.radius.full,
              background: s.done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.15)',
              display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600,
            }}>
              {s.done ? '✓' : i + 1}
            </span>
            {s.label}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

// ─── Order Summary panel ──────────────────────────────────────────────────────

interface OrderSummaryProps {
  coupon: CouponState;
  couponCode: string;
  setCouponCode: (v: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  termsChecked: boolean;
  totalSeconds: number;
  remainingSeconds: number;
}

function OrderSummary({ coupon, couponCode, setCouponCode, onApplyCoupon, onRemoveCoupon, termsChecked, totalSeconds, remainingSeconds }: OrderSummaryProps) {
  const qty = SEAT_DATA.seats.length;
  const ticketAmount = qty * SEAT_DATA.priceEach;
  const convBase = qty * CONV_FEE_EACH;
  const convGST = Math.round(convBase * 0.18);
  const totalConv = convBase + convGST;
  const offerFee = coupon === 'applied' ? OFFER_PROC_FEE : 0;
  const discount = coupon === 'applied' ? COUPON_DISCOUNT : 0;
  const payable = ticketAmount + totalConv + offerFee - discount;

  return (
    <GlassCard padding={22} style={{ position: 'sticky', top: 90 }}>
      {/* Movie mini */}
      <div style={{
        display: 'flex', gap: 12, paddingBottom: 16,
        borderBottom: `1px dashed ${T.colors.border.default}`, marginBottom: 16,
      }}>
        <div style={{
          width: 52, aspectRatio: '2/3', borderRadius: T.radius.md, overflow: 'hidden', flexShrink: 0,
          background: 'linear-gradient(135deg, #2a1a3d, #4c1d95)',
        }}>
          <img src={`${TMDB}${MOVIE.posterPath}`} alt={MOVIE.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: T.colors.text.primary }}>{MOVIE.title}</div>
          <div style={{ fontSize: 12, color: T.colors.text.muted, marginTop: 2 }}>IMAX · {MOVIE.certificate} · {MOVIE.duration}</div>
          <div style={{ fontSize: 12, color: T.colors.text.secondary, marginTop: 2 }}>PVR Acropolis · Audi 3 · 7:45 PM · Today</div>
        </div>
      </div>

      {/* CountdownRing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', borderRadius: T.radius.md, background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}` }}>
        <CountdownRing totalSeconds={totalSeconds} remainingSeconds={remainingSeconds} size={48} strokeWidth={4} showLabel />
        <div>
          <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Seats held for</div>
          <div style={{ fontSize: 12, color: T.colors.text.secondary }}>{SEAT_DATA.seats.join(', ')} · {SEAT_DATA.category}</div>
        </div>
      </div>

      {/* Heading */}
      <div style={{ fontFamily: T.fonts.mono, fontSize: 10, letterSpacing: '0.18em', color: T.colors.text.muted, textTransform: 'uppercase', marginBottom: 14 }}>
        Order Summary
      </div>

      {/* Ticket amount */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: T.colors.text.muted, marginBottom: 6, fontWeight: 600 }}>Ticket Amount <span style={{ fontWeight: 400, color: T.colors.text.muted, fontSize: 10 }}>(payable to venue)</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: T.colors.text.secondary, padding: '4px 0' }}>
          <span>{qty} × {SEAT_DATA.category} ({SEAT_DATA.seats.join(', ')})</span>
          <strong style={{ color: T.colors.text.primary }}>₹{ticketAmount}</strong>
        </div>
      </div>

      {/* Convenience fees */}
      <div style={{ borderTop: `1px solid ${T.colors.border.subtle}`, paddingTop: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: T.colors.text.muted, marginBottom: 6, fontWeight: 600 }}>Convenience Fees</div>
        {[
          { label: `Base fee (${qty} × ₹${CONV_FEE_EACH})`, val: `₹${convBase}` },
          { label: 'CGST 9%', val: `₹${Math.round(convBase * 0.09)}` },
          { label: 'SGST 9%', val: `₹${Math.round(convBase * 0.09)}` },
        ].map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.colors.text.muted, padding: '3px 0' }}>
            <span>{r.label}</span><span>{r.val}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.colors.text.secondary, padding: '4px 0', borderTop: `1px solid ${T.colors.border.subtle}`, marginTop: 4 }}>
          <span>Total conv. fee</span><strong style={{ color: T.colors.text.primary }}>₹{totalConv}</strong>
        </div>
      </div>

      {/* Coupon */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center',
        padding: '10px 12px', borderRadius: T.radius.md,
        background: coupon === 'applied' ? 'rgba(16,185,129,0.06)' : T.colors.bg.surface2,
        border: `1px ${coupon === 'applied' ? 'solid' : coupon === 'error' ? 'solid' : 'dashed'} ${coupon === 'applied' ? 'rgba(16,185,129,0.3)' : coupon === 'error' ? T.colors.semantic.error : 'rgba(16,185,129,0.3)'}`,
        marginBottom: 14,
      }}>
        {coupon === 'applied' && <span style={{ color: T.colors.semantic.success, fontWeight: 700, flexShrink: 0 }}>✓</span>}
        <input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          disabled={coupon === 'applied'}
          placeholder="ENTER COUPON CODE"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: T.fonts.mono, fontSize: 13, letterSpacing: '0.06em',
            color: coupon === 'applied' ? T.colors.semantic.success : coupon === 'error' ? T.colors.semantic.error : T.colors.text.primary,
          }}
        />
        {coupon === 'applied' ? (
          <button onClick={onRemoveCoupon} style={{ fontSize: 12, color: T.colors.semantic.success, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.fonts.body, whiteSpace: 'nowrap' }}>Remove</button>
        ) : (
          <button onClick={onApplyCoupon} style={{
            padding: '4px 12px', borderRadius: T.radius.full, fontSize: 12, fontWeight: 600,
            background: T.colors.bg.surface3, border: `1px solid ${T.colors.border.strong}`,
            color: T.colors.text.primary, cursor: 'pointer', fontFamily: T.fonts.body, whiteSpace: 'nowrap',
          }}>
            APPLY
          </button>
        )}
      </div>
      {coupon === 'error' && (
        <div style={{ fontSize: 12, color: T.colors.semantic.error, marginTop: -10, marginBottom: 10 }}>Invalid or expired coupon code.</div>
      )}

      {/* Offer processing fee (only when coupon applied) */}
      {coupon === 'applied' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.colors.text.secondary, padding: '3px 0', marginBottom: 4 }}>
          <span>Offer processing fee</span><span>₹{OFFER_PROC_FEE.toFixed(2)}</span>
        </div>
      )}

      {/* Discount line */}
      {coupon === 'applied' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', color: T.colors.semantic.success }}>
          <span>Promo · {VALID_COUPON}</span><strong>− ₹{COUPON_DISCOUNT}</strong>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 3, background: T.colors.bg.surface3, borderRadius: 2, margin: '14px 0' }} />

      {/* Amount payable */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <span style={{ fontSize: 13, color: T.colors.text.secondary }}>Amount Payable</span>
        <span style={{
          fontFamily: T.fonts.display, fontSize: 32, fontWeight: 700,
          color: T.colors.accent.crimson,
        }}>
          ₹{Math.round(payable)}
        </span>
      </div>

      {/* Pay button */}
      <button
        disabled={!termsChecked}
        style={{
          width: '100%', padding: '14px 0', borderRadius: T.radius.full,
          background: termsChecked
            ? `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`
            : T.colors.bg.surface3,
          color: termsChecked ? T.colors.tint.white : T.colors.text.muted,
          border: 'none', fontWeight: 700, fontSize: 16, cursor: termsChecked ? 'pointer' : 'not-allowed',
          fontFamily: T.fonts.body,
          boxShadow: termsChecked ? T.shadows.glowCrimson : 'none',
          transition: `all ${T.motion.duration.base}`,
        }}
      >
        🔒 Proceed to Pay (Test Mode)
      </button>

      {/* Payment icons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        {['💳 Visa', '💳 MC', '📱 UPI', '🏦 NetBanking'].map((m) => (
          <span key={m} style={{
            padding: '3px 8px', borderRadius: T.radius.sm,
            background: T.colors.bg.surface3, border: `1px solid ${T.colors.border.default}`,
            fontSize: 11, color: T.colors.text.muted, fontFamily: T.fonts.body,
          }}>
            {m}
          </span>
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 11, color: T.colors.text.muted, margin: '10px 0 0' }}>
        (Test Mode — No real payment)
      </p>
    </GlassCard>
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export default function Checkout() {
  const [name, setName] = useState('Aarav Rastogi');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [email, setEmail] = useState('aarav@bookkaroo.in');
  const [termsChecked, setTermsChecked] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponState, setCouponState] = useState<CouponState>('idle');
  const [remaining] = useState(480);

  function handleApply() {
    if (couponCode.trim().toUpperCase() === VALID_COUPON) {
      setCouponState('applied');
    } else {
      setCouponState('error');
    }
  }

  function handleRemoveCoupon() {
    setCouponState('idle');
    setCouponCode('');
  }

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      {/* Mini nav */}
      <nav style={{
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: `1px solid ${T.colors.border.default}`,
        background: `color-mix(in srgb, ${T.colors.bg.surface} 90%, transparent)`,
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <Logo size={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.colors.text.muted }}>
          <span style={{ color: T.colors.semantic.success, fontSize: 14 }}>🔒</span>
          Secured by BookKaroo · 256-bit TLS
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <Steps />
        <h1 style={{ fontFamily: T.fonts.display, fontSize: 'clamp(24px, 4vw, 36px)', margin: '8px 0 4px', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Almost there.
        </h1>
        <p style={{ color: T.colors.text.secondary, margin: '0 0 28px', fontSize: 14 }}>
          {SEAT_DATA.seats.length} seats held · Free reschedule until 3:45 PM
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28 }}>
          {/* LEFT */}
          <section>
            {/* Step 1: Contact */}
            <div style={{ padding: 22, borderRadius: T.radius.xl, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`, marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: T.radius.full,
                  background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
                  display: 'grid', placeItems: 'center', fontSize: 11, color: T.colors.tint.white, fontWeight: 600, flexShrink: 0,
                }}>1</span>
                Contact & ticket delivery
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                <div style={{ gridColumn: '1/-1' }}>
                  <Input label="Email (QR ticket delivered here)" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, fontSize: 13, color: T.colors.text.secondary, cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: T.colors.accent.indigo, width: 16, height: 16 }} />
                Send tickets to WhatsApp too
              </label>
            </div>

            {/* Step 2: T&C */}
            <div style={{ padding: 22, borderRadius: T.radius.xl, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`, marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: T.radius.full,
                  background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
                  display: 'grid', placeItems: 'center', fontSize: 11, color: T.colors.tint.white, fontWeight: 600, flexShrink: 0,
                }}>2</span>
                Terms & conditions
              </h3>
              <div style={{
                padding: 14, borderRadius: T.radius.md,
                background: T.colors.bg.base, border: `1px solid ${T.colors.border.default}`,
                fontSize: 12, color: T.colors.text.muted, lineHeight: 1.6, marginBottom: 14,
                maxHeight: 120, overflowY: 'auto',
              }}>
                <strong style={{ color: T.colors.text.secondary }}>Cancellation Policy:</strong> Full refund if cancelled 24h before show. 50% refund up to 4h before show. No refund within 4h of show. Convenience fees are non-refundable. By proceeding you agree to BookKaroo's Terms of Service and Privacy Policy.
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.colors.text.secondary, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  style={{ accentColor: T.colors.accent.crimson, width: 18, height: 18, marginTop: 1, flexShrink: 0 }}
                />
                I agree to the Terms & Conditions and Cancellation Policy <span style={{ color: T.colors.accent.crimson }}>*</span>
              </label>
            </div>

            {/* Secure note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: T.radius.md, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 12, color: T.colors.text.secondary }}>
              <span style={{
                width: 28, height: 28, borderRadius: T.radius.full,
                background: 'rgba(16,185,129,0.16)', color: T.colors.tint.successText,
                display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0,
              }}>
                🔒
              </span>
              256-bit TLS · PCI DSS · BookKaroo never stores your payment details
            </div>
          </section>

          {/* RIGHT */}
          <aside>
            <OrderSummary
              coupon={couponState}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onApplyCoupon={handleApply}
              onRemoveCoupon={handleRemoveCoupon}
              termsChecked={termsChecked}
              totalSeconds={600}
              remainingSeconds={remaining}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
