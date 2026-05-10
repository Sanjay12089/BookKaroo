import { useState } from 'react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';

interface GeneralSettings {
  siteName: string;
  supportEmail: string;
  contactPhone: string;
}

interface PaymentSettings {
  razorpayMode: 'sandbox' | 'live';
}

interface EmailSettings {
  fromEmail: string;
  replyTo: string;
}

interface LimitSettings {
  maxSeatsPerBooking: number;
  seatLockDurationMin: number;
}

function SectionCard({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  const [saved, setSaved] = useState(false);
  function handleSave() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <div className="p-6 rounded-xl bg-bg-surface border border-border-default mb-5">
      <h2 className="font-display font-semibold text-base text-text-primary mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold font-sans hover:-translate-y-0.5 transition-all"
        >
          Save
        </button>
        {saved && <span className="text-sm text-semantic-success font-sans">Saved!</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] items-center gap-4">
      <label className="text-sm text-text-secondary font-sans">{label}</label>
      <div>{children}</div>
    </div>
  );
}

const INPUT = 'w-full px-3 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm font-sans focus:outline-none focus:border-accent-indigo transition-colors';

export default function AdminSettingsPage() {
  const [general, setGeneral] = useState<GeneralSettings>({
    siteName: 'BookKaroo',
    supportEmail: 'support@bookkaroo.in',
    contactPhone: '+91-9000000000',
  });

  const [payment, setPayment] = useState<PaymentSettings>({ razorpayMode: 'sandbox' });

  const [email, setEmail] = useState<EmailSettings>({
    fromEmail: 'noreply@bookkaroo.in',
    replyTo: 'support@bookkaroo.in',
  });

  const [limits, setLimits] = useState<LimitSettings>({
    maxSeatsPerBooking: 10,
    seatLockDurationMin: 10,
  });

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Settings</h1>
          <p className="text-text-muted text-sm font-sans">Configure platform-wide settings.</p>
        </div>

        {/* General */}
        <SectionCard title="General" onSave={() => {}}>
          <Field label="Site Name">
            <input
              type="text"
              value={general.siteName}
              onChange={(e) => setGeneral((g) => ({ ...g, siteName: e.target.value }))}
              className={INPUT}
            />
          </Field>
          <Field label="Support Email">
            <input
              type="email"
              value={general.supportEmail}
              onChange={(e) => setGeneral((g) => ({ ...g, supportEmail: e.target.value }))}
              className={INPUT}
            />
          </Field>
          <Field label="Contact Phone">
            <input
              type="text"
              value={general.contactPhone}
              onChange={(e) => setGeneral((g) => ({ ...g, contactPhone: e.target.value }))}
              className={INPUT}
            />
          </Field>
        </SectionCard>

        {/* Payment */}
        <SectionCard title="Payment" onSave={() => {}}>
          <Field label="Razorpay Mode">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-surface2 border border-border-default w-fit">
              {(['sandbox', 'live'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPayment({ razorpayMode: mode })}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold font-sans capitalize transition-colors ${
                    payment.razorpayMode === mode
                      ? 'bg-accent-indigo text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </Field>
          {payment.razorpayMode === 'live' && (
            <div className="col-span-2 px-4 py-3 rounded-lg bg-semantic-error/10 border border-semantic-error/20 text-semantic-error text-sm font-sans">
              Warning: Live mode will process real payments. Ensure your Razorpay credentials are configured.
            </div>
          )}
        </SectionCard>

        {/* Email */}
        <SectionCard title="Email" onSave={() => {}}>
          <Field label="From Email">
            <input
              type="email"
              value={email.fromEmail}
              onChange={(e) => setEmail((em) => ({ ...em, fromEmail: e.target.value }))}
              className={INPUT}
            />
          </Field>
          <Field label="Reply-To">
            <input
              type="email"
              value={email.replyTo}
              onChange={(e) => setEmail((em) => ({ ...em, replyTo: e.target.value }))}
              className={INPUT}
            />
          </Field>
        </SectionCard>

        {/* Limits */}
        <SectionCard title="Limits" onSave={() => {}}>
          <Field label="Max Seats per Booking">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={20}
                value={limits.maxSeatsPerBooking}
                onChange={(e) => setLimits((l) => ({ ...l, maxSeatsPerBooking: Number(e.target.value) }))}
                className="flex-1 accent-accent-indigo"
              />
              <input
                type="number"
                min={1}
                max={20}
                value={limits.maxSeatsPerBooking}
                onChange={(e) => setLimits((l) => ({ ...l, maxSeatsPerBooking: Number(e.target.value) }))}
                className="w-16 px-2 py-1.5 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm font-sans text-center focus:outline-none focus:border-accent-indigo"
              />
            </div>
          </Field>
          <Field label="Seat Lock Duration (min)">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={2}
                max={30}
                value={limits.seatLockDurationMin}
                onChange={(e) => setLimits((l) => ({ ...l, seatLockDurationMin: Number(e.target.value) }))}
                className="flex-1 accent-accent-indigo"
              />
              <input
                type="number"
                min={2}
                max={30}
                value={limits.seatLockDurationMin}
                onChange={(e) => setLimits((l) => ({ ...l, seatLockDurationMin: Number(e.target.value) }))}
                className="w-16 px-2 py-1.5 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm font-sans text-center focus:outline-none focus:border-accent-indigo"
              />
            </div>
          </Field>
        </SectionCard>
      </div>
    </AdminLayout>
  );
}
