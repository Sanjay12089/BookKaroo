import { useState } from 'react';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { cn } from '@/shared/lib/utils';

const FAQS = [
  {
    q: 'How do I book tickets on BookKaroo?',
    a: 'Browse movies or events → click "Book Tickets" → select your showtime → choose seats → fill in contact details → proceed to pay. Your ticket is emailed instantly after payment.'
  },
  {
    q: 'Can I cancel my booking?',
    a: 'Yes, you can cancel from My Bookings if the show is more than 2 hours away. The convenience fee is non-refundable. The ticket amount is refunded within 7 business days.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and BookKaroo Wallet. Razorpay integration is coming in Phase 1.5.'
  },
  {
    q: 'How does seat selection work?',
    a: 'Once you choose a showtime, you can pick individual seats on the seat grid. Your seats are held for 8 minutes while you complete payment. The seat grid shows real-time availability.'
  },
  {
    q: 'How do I receive my tickets?',
    a: 'Tickets are emailed to your registered email address with a QR code attached. You can also access them from My Bookings. Show the QR code at the entry counter.'
  },
  {
    q: 'Can I use a coupon code?',
    a: 'Yes! Enter your coupon code in the checkout page. Active demo codes: FIRSTBOOK (₹100 off), MOVIE20 (20% off), KGF450 (₹450 off), CHEAPTUE (15% off on Tuesdays), AHMDVIBE (₹60 off).'
  },
  {
    q: 'What is the convenience fee?',
    a: 'A convenience fee of ₹59 per ticket is charged by BookKaroo for booking services. This is subject to 18% GST. The fee is non-refundable on cancellations.'
  },
  {
    q: 'How do I get a GST invoice?',
    a: 'A GST-compliant invoice is automatically generated and attached to your booking confirmation email as a PDF. You can also download it from My Bookings.'
  },
  {
    q: 'What if a show is cancelled?',
    a: 'If a show is cancelled by the venue or organiser, you will receive a full refund including convenience fees. We will email you immediately with refund details.'
  },
  {
    q: 'How do I contact BookKaroo support?',
    a: 'Email us at support@bookkaroo.com or use the contact form. We aim to respond within 24 hours on business days.'
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('border border-border-default rounded-xl transition-colors', open ? 'bg-bg-surface' : 'bg-bg-surface hover:border-border-strong')}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-sm text-text-primary font-sans">{q}</span>
        <span className={cn('text-text-muted text-lg transition-transform', open && 'rotate-45')}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-text-secondary font-sans leading-relaxed border-t border-border-default pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <PublicLayout>
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-3">Help Centre</h1>
          <p className="text-text-secondary font-sans">Frequently asked questions about BookKaroo.</p>
        </div>

        <div className="space-y-3 mb-12">
          {FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>

        {/* Contact */}
        <div className="text-center p-8 rounded-2xl bg-bg-surface border border-border-default">
          <h3 className="font-display font-semibold text-xl mb-2">Still need help?</h3>
          <p className="text-text-muted text-sm font-sans mb-4">Our support team responds within 24 hours on business days.</p>
          <a href="mailto:support@bookkaroo.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold font-sans">
            ✉️ Email Support
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
