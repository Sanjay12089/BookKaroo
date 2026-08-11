import { useState, useEffect } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Logo } from '../Logo';
import { useTheme, ThemeToggle } from '../ThemeContext';
import Home from './Home';
import MoviesList from './MoviesList';
import MovieDetail from './MovieDetail';
import Showtimes from './Showtimes';
import SeatSelection from './SeatSelection';
import Checkout from './Checkout';
import Confirmation from './Confirmation';
import MyBookings from './MyBookings';
import AdminDashboard from './AdminDashboard';

// ─── Section config ────────────────────────────────────────────────────────────

interface Section {
  id: string;
  label: string;
  route: string;
  description: string;
  component: React.ComponentType;
  desktopWidth: number;
}

const SECTIONS: Section[] = [
  { id: 'home', label: 'Home', route: '/', description: 'Landing page with hero carousel, IPL strip, Now Showing & Coming Soon rails, Events grid.', component: Home, desktopWidth: 1440 },
  { id: 'movies', label: 'Movies Listing', route: '/movies', description: 'Filterable movie grid with sticky chip filter bar, sort, active filter chips, skeleton loading, pagination.', component: MoviesList, desktopWidth: 1440 },
  { id: 'detail', label: 'Movie Detail', route: '/movies/:slug', description: 'Full-bleed backdrop, tabbed content (About / Cast / Reviews / Photos), sticky "Pick a showtime" bar.', component: MovieDetail, desktopWidth: 1440 },
  { id: 'showtimes', label: 'Showtimes', route: '/movies/:slug/showtimes', description: '7-day date strip, venue cards with amenity badges, colour-coded time chips, sticky selection aside.', component: Showtimes, desktopWidth: 1440 },
  { id: 'seats', label: 'Seat Selection', route: '/booking/:showId/seats', description: 'Seat grid (12 rows, aisles, 3 categories), CountdownRing, quick-count picker, sticky bottom bar.', component: SeatSelection, desktopWidth: 1440 },
  { id: 'checkout', label: 'Checkout', route: '/checkout', description: 'Two-panel layout: contact form + T&C left, order summary with coupon (KGF450) right.', component: Checkout, desktopWidth: 1440 },
  { id: 'confirmation', label: 'Booking Confirmed', route: '/booking/confirmed', description: 'Celebratory screen: animated checkmark, confetti, ticket card with QR, stamp animation.', component: Confirmation, desktopWidth: 1440 },
  { id: 'bookings', label: 'My Bookings', route: '/profile/bookings', description: 'Profile header with stats, tabbed booking cards (Upcoming / Past), status badges, actions.', component: MyBookings, desktopWidth: 1440 },
  { id: 'admin', label: 'Admin Dashboard', route: '/admin', description: 'Collapsible sidebar, KPI cards with sparklines, bar chart, revenue by city, bookings table, activity log.', component: AdminDashboard, desktopWidth: 1440 },
];

// ─── Design token swatches ────────────────────────────────────────────────────

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ width: 56, height: 56, borderRadius: T.radius.md, background: value, border: `1px solid ${T.colors.border.default}` }} />
      <div style={{ fontSize: 10, color: T.colors.text.muted, fontFamily: T.fonts.mono }}>{value}</div>
      <div style={{ fontSize: 11, color: T.colors.text.secondary, fontFamily: T.fonts.body }}>{name}</div>
    </div>
  );
}

function DesignSystemSection() {
  return (
    <section id="design-system" style={{ marginBottom: 80 }}>
      <SectionLabel id="design-system" label="Design System" description="Tokens, typography, and component primitives." />

      <div style={{ padding: 32, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`, borderRadius: T.radius.xl }}>
        <h3 style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 600, margin: '0 0 20px', letterSpacing: '-0.02em' }}>Colors</h3>

        <div style={{ display: 'grid', gap: 24 }}>
          {[
            {
              title: 'Background (current theme — toggle ☀️/🌙 above)', items: [
                { name: 'bg.base', value: T.colors.bg.base },
                { name: 'bg.surface', value: T.colors.bg.surface },
                { name: 'bg.surface2', value: T.colors.bg.surface2 },
                { name: 'bg.surface3', value: T.colors.bg.surface3 },
              ]
            },
            {
              title: 'Dark palette (fixed)', items: [
                { name: '#0A0E1A', value: '#0A0E1A' },
                { name: '#131826', value: '#131826' },
                { name: '#1A2138', value: '#1A2138' },
                { name: '#232C44', value: '#232C44' },
              ]
            },
            {
              title: 'Light palette (fixed)', items: [
                { name: '#FAFAFA', value: '#FAFAFA' },
                { name: '#FFFFFF', value: '#FFFFFF' },
                { name: '#F4F4F5', value: '#F4F4F5' },
                { name: '#E4E4E7', value: '#E4E4E7' },
              ]
            },
            {
              title: 'Accent', items: [
                { name: 'crimson', value: T.colors.accent.crimson },
                { name: 'indigo', value: T.colors.accent.indigo },
                { name: 'purple', value: T.colors.accent.purple },
                { name: 'success', value: T.colors.semantic.success },
                { name: 'warning', value: T.colors.semantic.warning },
                { name: 'error', value: T.colors.semantic.error },
              ]
            },
            {
              title: 'Seat Categories', items: [
                { name: 'recliner', value: T.colors.seat.recliner },
                { name: 'executive', value: T.colors.seat.executive },
                { name: 'normal', value: T.colors.seat.normal },
                { name: 'booked', value: T.colors.seat.booked },
                { name: 'locked', value: T.colors.seat.locked },
              ]
            },
          ].map((group) => (
            <div key={group.title}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.colors.text.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>{group.title}</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {group.items.map((item) => <ColorSwatch key={item.name} name={item.name} value={item.value} />)}
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 600, margin: '32px 0 16px', letterSpacing: '-0.02em' }}>Typography</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          {[
            { label: 'Playfair Display · 48px · Display', style: { fontFamily: T.fonts.display, fontSize: 48, fontWeight: 700, letterSpacing: '-0.025em' }, text: 'Book the moment.' },
            { label: 'Playfair Display · 28px · Title', style: { fontFamily: T.fonts.display, fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }, text: 'KGF: Chapter 2' },
            { label: 'Sora · 16px · Body', style: { fontFamily: T.fonts.body, fontSize: 16, fontWeight: 400 }, text: 'Karo it now. 312 films · 3 cinemas in Ahmedabad.' },
            { label: 'Sora · 13px · UI', style: { fontFamily: T.fonts.body, fontSize: 13, fontWeight: 500 }, text: 'Book Tickets · Sort · Language · Genre · Format' },
            { label: 'JetBrains Mono · Codes', style: { fontFamily: T.fonts.mono, fontSize: 13 }, text: 'BK-20260509-WS22Q · H12, H13 · EXECUTIVE' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
              <span style={{ fontSize: 10, color: T.colors.text.muted, fontFamily: T.fonts.mono, flex: '0 0 240px', flexShrink: 0 }}>{item.label}</span>
              <span style={{ ...item.style, color: T.colors.text.primary }}>{item.text}</span>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 600, margin: '32px 0 16px', letterSpacing: '-0.02em' }}>Logo variants</h3>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          {([
            ['full-horizontal', 'dark', true],
            ['icon-only', 'dark', false],
            ['wordmark-only', 'dark', false],
            ['full-stacked', 'dark', true],
          ] as const).map(([variant, theme, glow]) => (
            <div key={variant} style={{ textAlign: 'center' }}>
              <Logo variant={variant} theme={theme} glow={glow} size={40} />
              <div style={{ fontSize: 10, color: T.colors.text.muted, marginTop: 8, fontFamily: T.fonts.mono }}>{variant}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Device Frame ─────────────────────────────────────────────────────────────

function DesktopFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <div style={{
        background: T.colors.bg.surface3, borderRadius: `${T.radius.xl} ${T.radius.xl} 0 0`,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
        border: `1px solid ${T.colors.border.default}`,
        borderBottom: 'none',
      }}>
        {[T.colors.semantic.error, T.colors.semantic.warning, T.colors.semantic.success].map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
        ))}
        <span style={{
          flex: 1, margin: '0 8px', padding: '3px 10px', borderRadius: T.radius.full,
          background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
          fontSize: 11, color: T.colors.text.muted, fontFamily: T.fonts.mono, textAlign: 'center',
        }}>
          bookkaroo.in{label}
        </span>
      </div>
      <div style={{
        border: `1px solid ${T.colors.border.default}`,
        borderRadius: `0 0 ${T.radius.xl} ${T.radius.xl}`,
        overflow: 'hidden',
        height: 600, overflowY: 'auto',
      }}>
        <div style={{ transformOrigin: 'top left', transform: 'scale(0.6)', width: `${100 / 0.6}%` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ id, label, description }: { id: string; label: string; description: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.muted, letterSpacing: '0.1em' }}>#{id}</span>
        <h2 style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
          {label}
        </h2>
      </div>
      <p style={{ color: T.colors.text.secondary, fontSize: 14, margin: 0, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

// ─── Floating nav ─────────────────────────────────────────────────────────────

function FloatingNav({ sections, activeId }: { sections: Section[]; activeId: string }) {
  return (
    <div style={{
      position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)',
      zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4,
      padding: 10, borderRadius: T.radius.xl,
      background: `rgba(var(--bk-bg-surface-rgb), 0.9)`,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${T.colors.border.default}`,
      boxShadow: T.shadows.lg,
    }}>
      <div style={{ fontSize: 9, color: T.colors.text.muted, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 4px 6px', fontFamily: T.fonts.mono }}>
        Screens
      </div>
      {[{ id: 'design-system', label: 'Design System' }, ...sections].map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          style={{
            display: 'block', padding: '6px 10px', borderRadius: T.radius.md,
            fontSize: 12, fontWeight: s.id === activeId ? 600 : 400,
            background: s.id === activeId ? 'rgba(225, 29, 116,0.12)' : 'transparent',
            color: s.id === activeId ? T.colors.accent.crimson : T.colors.text.muted,
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: `all ${T.motion.duration.fast}`,
            borderLeft: `2px solid ${s.id === activeId ? T.colors.accent.crimson : 'transparent'}`,
          }}
          onMouseEnter={(e) => { if (s.id !== activeId) { e.currentTarget.style.color = T.colors.text.secondary; e.currentTarget.style.background = T.colors.bg.surface2; } }}
          onMouseLeave={(e) => { if (s.id !== activeId) { e.currentTarget.style.color = T.colors.text.muted; e.currentTarget.style.background = 'transparent'; } }}
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────

export default function Preview() {
  const [activeId, setActiveId] = useState('design-system');
  const { theme } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    document.querySelectorAll('[data-preview-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const logoTheme = theme === 'light' ? 'light' : 'dark';

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      <FloatingNav sections={SECTIONS} activeId={activeId} />

      {/* Top header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 32px',
        background: `rgba(var(--bk-bg-surface-rgb), 0.9)`, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.colors.border.default}`,
      }}>
        <Logo size={32} theme={logoTheme} glow={theme === 'dark'} />
        <span style={{
          padding: '3px 12px', borderRadius: T.radius.full,
          background: 'rgba(225, 29, 116,0.12)', border: '1px solid rgba(225, 29, 116,0.25)',
          fontSize: 11, fontWeight: 600, color: T.colors.accent.crimson, fontFamily: T.fonts.body,
        }}>
          Design Preview
        </span>
        <span style={{ fontFamily: T.fonts.display, fontStyle: 'italic', fontSize: 14, color: T.colors.text.muted, marginLeft: 4 }}>
          Book the moment. Karo it now.
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeToggle />
          <span style={{ fontSize: 12, color: T.colors.text.muted }}>{SECTIONS.length + 1} screens · feat/design-system</span>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 80px' }}>
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h1 style={{ fontFamily: T.fonts.display, fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            BookKaroo Design System
          </h1>
          <p style={{ color: T.colors.text.secondary, fontSize: 18, maxWidth: 560, margin: '0 auto 32px' }}>
            All screens, tokens, and components in one scrollable reference. Use the sidebar to jump to any section.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '🎨', label: '1 token file', desc: 'tokens.ts' },
              { icon: '🪄', label: '13 components', desc: 'DesignSystem.tsx' },
              { icon: '🖼', label: '9 screens', desc: 'screens/*.tsx' },
              { icon: '🔤', label: '3 typefaces', desc: 'Sora + Playfair + JetBrains' },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: '14px 20px', borderRadius: T.radius.lg,
                background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
                textAlign: 'center', minWidth: 140,
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: T.colors.text.primary }}>{stat.label}</div>
                <div style={{ fontSize: 11, color: T.colors.text.muted, fontFamily: T.fonts.mono, marginTop: 2 }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Design System section */}
        <div id="design-system" data-preview-section>
          <DesignSystemSection />
        </div>

        {/* Screen sections */}
        {SECTIONS.map((section) => {
          const Component = section.component;
          return (
            <section key={section.id} id={section.id} data-preview-section style={{ marginBottom: 80 }}>
              <SectionLabel id={section.id} label={section.label} description={section.description} />

              <div style={{ marginBottom: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: T.radius.full,
                  background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
                  fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.muted,
                }}>
                  {section.route}
                </span>
                <span style={{
                  padding: '3px 10px', borderRadius: T.radius.full,
                  background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
                  fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.muted,
                }}>
                  {section.desktopWidth}px desktop frame
                </span>
              </div>

              <DesktopFrame label={section.route}>
                <Component />
              </DesktopFrame>
            </section>
          );
        })}

        {/* Footer */}
        <div style={{
          paddingTop: 48, borderTop: `1px solid ${T.colors.border.default}`,
          textAlign: 'center',
        }}>
          <Logo size={32} style={{ justifyContent: 'center', marginBottom: 12 }} />
          <p style={{ color: T.colors.text.muted, fontSize: 14, margin: '0 0 4px' }}>
            Book the moment. Karo it now.
          </p>
          <p style={{ color: T.colors.text.muted, fontSize: 12, margin: 0 }}>
            © 2026 BookKaroo Pvt Ltd · feat/design-system · claude-sonnet-4-6
          </p>
        </div>
      </main>
    </div>
  );
}
