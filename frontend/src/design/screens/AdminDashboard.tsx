import { useState } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Logo } from '../Logo';

// ─── Nav items ────────────────────────────────────────────────────────────────

interface NavItem { label: string; icon: string; key: string; count?: number }

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: '⊞', key: 'dashboard' },
  { label: 'Movies', icon: '🎬', key: 'movies', count: 312 },
  { label: 'Events', icon: '📅', key: 'events', count: 48 },
  { label: 'Venues', icon: '📍', key: 'venues', count: 86 },
  { label: 'Shows', icon: '🕐', key: 'shows', count: 4200 },
  { label: 'Bookings', icon: '🎟', key: 'bookings', count: 247 },
  { label: 'Users', icon: '👥', key: 'users', count: 1204 },
  { label: 'Reports', icon: '📊', key: 'reports' },
  { label: 'CMS', icon: '🖼', key: 'cms' },
  { label: 'Settings', icon: '⚙', key: 'settings' },
];

// ─── KPI data ─────────────────────────────────────────────────────────────────

const KPI = [
  { label: "Today's Bookings", value: '247', delta: '+12%', up: true, spark: [40, 55, 48, 72, 65, 80, 95] },
  { label: 'Revenue Today', value: '₹1,82,450', delta: '+8%', up: true, spark: [60, 45, 70, 55, 80, 68, 90] },
  { label: 'Active Users', value: '1,204', delta: 'live now', up: true, spark: [30, 50, 40, 60, 55, 70, 85] },
  { label: 'Top Movie', value: 'KGF: Ch2', sub: '94 bookings today', spark: [80, 70, 85, 75, 90, 80, 94] },
];

// ─── Weekly bookings ──────────────────────────────────────────────────────────

const WEEKLY = [
  { day: 'Mon', count: 180 },
  { day: 'Tue', count: 210 },
  { day: 'Wed', count: 165 },
  { day: 'Thu', count: 240 },
  { day: 'Fri', count: 310 },
  { day: 'Sat', count: 380 },
  { day: 'Sun', count: 247 },
];
const MAX_WEEKLY = Math.max(...WEEKLY.map((d) => d.count));

// ─── City revenue data ────────────────────────────────────────────────────────

const CITIES = [
  { name: 'Ahmedabad', revenue: 182450, pct: 100 },
  { name: 'Mumbai', revenue: 342800, pct: 88 },
  { name: 'Bangalore', revenue: 198300, pct: 64 },
  { name: 'Delhi', revenue: 156700, pct: 52 },
  { name: 'Hyderabad', revenue: 124500, pct: 40 },
];

// ─── Recent bookings ──────────────────────────────────────────────────────────

type BStatus = 'confirmed' | 'cancelled' | 'pending';

interface AdminBooking {
  id: string;
  user: string;
  movie: string;
  showTime: string;
  amount: string;
  status: BStatus;
}

const RECENT_BOOKINGS: AdminBooking[] = [
  { id: 'BK-20260509-WS22Q', user: 'Aarav Rastogi', movie: 'Chhaava', showTime: '9 May · 7:45 PM', amount: '₹897', status: 'confirmed' },
  { id: 'BK-20260509-RT91K', user: 'Priya Mehta', movie: 'Pushpa 2', showTime: '9 May · 4:30 PM', amount: '₹1,260', status: 'confirmed' },
  { id: 'BK-20260509-MN44X', user: 'Rohit Sharma', movie: 'KGF: Chapter 2', showTime: '9 May · 10:00 AM', amount: '₹480', status: 'pending' },
  { id: 'BK-20260509-XQ77T', user: 'Sneha Patel', movie: 'RRR', showTime: '9 May · 1:15 PM', amount: '₹640', status: 'confirmed' },
  { id: 'BK-20260509-LM23P', user: 'Vikram Joshi', movie: 'Stree 2', showTime: '9 May · 7:15 PM', amount: '₹360', status: 'cancelled' },
  { id: 'BK-20260509-AB99C', user: 'Kavita Nair', movie: 'Jawan', showTime: '9 May · 9:00 PM', amount: '₹720', status: 'confirmed' },
];

const STATUS_CHIP: Record<BStatus, { bg: string; color: string; label: string }> = {
  confirmed: { bg: 'rgba(16,185,129,0.14)', color: T.colors.tint.successText, label: 'Confirmed' },
  pending: { bg: 'rgba(245,158,11,0.14)', color: T.colors.tint.warningText, label: 'Pending' },
  cancelled: { bg: 'rgba(229,9,20,0.14)', color: T.colors.tint.errorText, label: 'Cancelled' },
};

// ─── Activity log ─────────────────────────────────────────────────────────────

const ACTIVITY = [
  { time: '18:12', text: 'New booking · BK-20260509-AB99C · Jawan' },
  { time: '18:08', text: 'Show added · Chhaava IMAX · 10:45 PM' },
  { time: '17:55', text: 'Booking cancelled · BK-20260509-LM23P' },
  { time: '17:40', text: 'Venue updated · PVR Acropolis · capacity ↑' },
  { time: '17:22', text: 'Admin login · admin@bookkaroo.in' },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ activeKey, onNav, collapsed }: { activeKey: string; onNav: (k: string) => void; collapsed: boolean }) {
  return (
    <aside style={{
      width: collapsed ? 60 : 240, minHeight: '100vh',
      background: T.colors.bg.base, borderRight: `1px solid ${T.colors.border.default}`,
      padding: collapsed ? '16px 8px' : '16px 12px',
      display: 'flex', flexDirection: 'column',
      transition: `width ${T.motion.duration.base}`,
      flexShrink: 0,
    }}>
      {!collapsed && (
        <div style={{ padding: '4px 8px 20px' }}>
          <Logo size={32} />
        </div>
      )}

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', color: T.colors.text.muted, margin: '4px 8px 6px', textTransform: 'uppercase', fontWeight: 600, display: collapsed ? 'none' : 'block' }}>
          Main
        </div>
        {NAV_ITEMS.slice(0, 7).map((item) => (
          <button key={item.key} onClick={() => onNav(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px' : '8px 12px', borderRadius: T.radius.md,
            width: '100%', fontSize: 13, cursor: 'pointer',
            background: activeKey === item.key ? 'rgba(229,9,20,0.12)' : 'transparent',
            border: `1px solid ${activeKey === item.key ? 'rgba(229,9,20,0.25)' : 'transparent'}`,
            color: activeKey === item.key ? T.colors.accent.crimson : T.colors.text.secondary,
            fontFamily: T.fonts.body, marginBottom: 2,
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: `background ${T.motion.duration.fast}, color ${T.motion.duration.fast}`,
          }}
            onMouseEnter={(e) => { if (activeKey !== item.key) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = T.colors.text.primary; } }}
            onMouseLeave={(e) => { if (activeKey !== item.key) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.colors.text.secondary; } }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && (
              <>
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.count && (
                  <span style={{ fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.muted, padding: '1px 6px', background: T.colors.bg.surface, borderRadius: T.radius.full }}>
                    {item.count.toLocaleString()}
                  </span>
                )}
              </>
            )}
          </button>
        ))}

        {!collapsed && <div style={{ fontSize: 10, letterSpacing: '0.18em', color: T.colors.text.muted, margin: '18px 8px 6px', textTransform: 'uppercase', fontWeight: 600 }}>Config</div>}
        {NAV_ITEMS.slice(7).map((item) => (
          <button key={item.key} onClick={() => onNav(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px' : '8px 12px', borderRadius: T.radius.md,
            width: '100%', fontSize: 13, cursor: 'pointer',
            background: activeKey === item.key ? 'rgba(229,9,20,0.12)' : 'transparent',
            border: `1px solid ${activeKey === item.key ? 'rgba(229,9,20,0.25)' : 'transparent'}`,
            color: activeKey === item.key ? T.colors.accent.crimson : T.colors.text.secondary,
            fontFamily: T.fonts.body, marginBottom: 2,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div style={{ borderTop: `1px solid ${T.colors.border.default}`, paddingTop: 14, marginTop: 14 }}>
          <div style={{ fontSize: 12, color: T.colors.text.muted, marginBottom: 8 }}>
            Logged in as <strong style={{ color: T.colors.text.secondary }}>Admin</strong>
          </div>
          <button style={{
            width: '100%', padding: '8px 0', borderRadius: T.radius.full,
            background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
            color: T.colors.text.muted, fontSize: 12, cursor: 'pointer', fontFamily: T.fonts.body,
          }}>
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KPICard({ kpi }: { kpi: typeof KPI[0] }) {
  return (
    <div style={{
      padding: 20, borderRadius: T.radius.lg,
      background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 11, color: T.colors.text.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{kpi.label}</div>
      <div style={{
        fontFamily: T.fonts.display, fontSize: 'clamp(24px, 2.5vw, 36px)',
        fontWeight: 600, lineHeight: 1, marginTop: 10, letterSpacing: '-0.02em',
        color: T.colors.text.primary,
      }}>
        {kpi.value}
      </div>
      {'delta' in kpi && (
        <div style={{ fontSize: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: (kpi as { up?: boolean }).up ? T.colors.semantic.success : T.colors.semantic.error }}>
          {(kpi as { up?: boolean }).up ? '↑' : '↓'} {kpi.delta}
        </div>
      )}
      {'sub' in kpi && kpi.sub && (
        <div style={{ fontSize: 12, marginTop: 6, color: T.colors.text.muted }}>{kpi.sub}</div>
      )}
      {/* Sparkline */}
      <div style={{
        position: 'absolute', right: 16, bottom: 16,
        display: 'flex', gap: 3, alignItems: 'flex-end', height: 36, width: 80,
      }}>
        {kpi.spark.map((v, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${(v / Math.max(...kpi.spark)) * 100}%`,
            minHeight: 3,
            background: `linear-gradient(to top, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
            borderRadius: '1px 1px 0 0', opacity: 0.7,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function BarChart() {
  const [tooltip, setTooltip] = useState<{ day: string; count: number } | null>(null);

  return (
    <div style={{ padding: 22, borderRadius: T.radius.lg, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Bookings This Week</h3>
        <span style={{ fontSize: 12, color: T.colors.text.muted }}>Mon–Sun</span>
      </div>
      <div style={{ height: 180, display: 'flex', gap: 8, alignItems: 'flex-end', padding: '0 0 24px', borderBottom: `1px solid ${T.colors.border.default}`, position: 'relative' }}>
        {WEEKLY.map((d) => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, height: '100%', justifyContent: 'flex-end', cursor: 'pointer' }}
            onMouseEnter={() => setTooltip(d)} onMouseLeave={() => setTooltip(null)}>
            <div style={{
              width: '100%', maxWidth: 28,
              height: `${(d.count / MAX_WEEKLY) * 100}%`, minHeight: 4,
              background: d.day === 'Sat' || d.day === 'Sun'
                ? `linear-gradient(to top, ${T.colors.accent.crimson}, ${T.colors.accent.crimsonLight})`
                : `linear-gradient(to top, ${T.colors.accent.indigo}99, ${T.colors.accent.purple}99)`,
              borderRadius: '4px 4px 0 0',
              transition: `filter ${T.motion.duration.fast}`,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
            />
            <div style={{ fontFamily: T.fonts.mono, fontSize: 10, color: T.colors.text.muted, marginTop: 6 }}>{d.day}</div>
          </div>
        ))}
        {tooltip && (
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            padding: '6px 12px', borderRadius: T.radius.md,
            background: T.colors.bg.surface3, border: `1px solid ${T.colors.border.strong}`,
            fontSize: 12, color: T.colors.text.primary, fontFamily: T.fonts.mono,
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>
            {tooltip.day}: {tooltip.count} bookings
          </div>
        )}
      </div>
    </div>
  );
}

// ─── City bars ────────────────────────────────────────────────────────────────

function CityRevenue() {
  return (
    <div style={{ padding: 22, borderRadius: T.radius.lg, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}` }}>
      <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 600 }}>Revenue by City</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {CITIES.map((city) => (
          <div key={city.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, flex: '0 0 110px', color: T.colors.text.secondary }}>{city.name}</span>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: T.colors.bg.surface3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${city.pct}%`,
                background: `linear-gradient(90deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
                borderRadius: 4,
                transition: 'width 1s ease',
              }} />
            </div>
            <span style={{ fontFamily: T.fonts.mono, fontSize: 11, color: T.colors.text.primary, flex: '0 0 80px', textAlign: 'right' }}>
              ₹{(city.revenue / 1000).toFixed(0)}K
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent bookings table ─────────────────────────────────────────────────────

function BookingsTable() {
  return (
    <div style={{ padding: 22, borderRadius: T.radius.lg, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Recent Bookings</h3>
        <a href="#" style={{ fontSize: 12, color: T.colors.accent.indigo, textDecoration: 'none' }}>View all 247 →</a>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {['Booking ID', 'User', 'Movie', 'Show Time', 'Amount', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{
                  textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', color: T.colors.text.muted,
                  padding: '6px 12px', fontWeight: 500, textTransform: 'uppercase',
                  borderBottom: `1px solid ${T.colors.border.default}`,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_BOOKINGS.map((b, i) => {
              const chip = STATUS_CHIP[b.status];
              return (
                <tr key={b.id} style={{ background: i % 2 === 0 ? 'transparent' : T.colors.bg.surface2 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = T.colors.bg.surface3)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : T.colors.bg.surface2)}
                >
                  <td style={{ padding: '12px', fontSize: 12, borderBottom: `1px solid ${T.colors.border.subtle}`, fontFamily: T.fonts.mono, color: T.colors.text.muted }}>{b.id}</td>
                  <td style={{ padding: '12px', fontSize: 13, borderBottom: `1px solid ${T.colors.border.subtle}`, color: T.colors.text.secondary }}>{b.user}</td>
                  <td style={{ padding: '12px', fontSize: 13, borderBottom: `1px solid ${T.colors.border.subtle}`, color: T.colors.text.primary, fontWeight: 500 }}>{b.movie}</td>
                  <td style={{ padding: '12px', fontSize: 12, borderBottom: `1px solid ${T.colors.border.subtle}`, color: T.colors.text.muted, fontFamily: T.fonts.mono }}>{b.showTime}</td>
                  <td style={{ padding: '12px', fontSize: 13, borderBottom: `1px solid ${T.colors.border.subtle}`, color: T.colors.text.primary, fontWeight: 600 }}>{b.amount}</td>
                  <td style={{ padding: '12px', borderBottom: `1px solid ${T.colors.border.subtle}` }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: T.radius.full,
                      fontSize: 11, fontWeight: 500, background: chip.bg, color: chip.color,
                    }}>
                      {chip.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: `1px solid ${T.colors.border.subtle}` }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href="#" style={{ fontSize: 12, color: T.colors.accent.indigo, textDecoration: 'none' }}>View</a>
                      {b.status !== 'cancelled' && (
                        <a href="#" style={{ fontSize: 12, color: T.colors.semantic.error, textDecoration: 'none' }}>Cancel</a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: 12, color: T.colors.text.muted }}>
        <span>Showing 1–6 of 247 bookings</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['←', '1', '2', '3', '→'].map((p) => (
            <button key={p} style={{
              width: 30, height: 30, borderRadius: T.radius.md,
              background: p === '1' ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})` : T.colors.bg.surface2,
              border: `1px solid ${p === '1' ? 'transparent' : T.colors.border.default}`,
              color: p === '1' ? T.colors.tint.white : T.colors.text.muted,
              fontSize: 12, cursor: 'pointer', fontFamily: T.fonts.body,
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeKey, setActiveKey] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const today = new Date('2026-05-09').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.colors.bg.surface, color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      <Sidebar activeKey={activeKey} onNav={setActiveKey} collapsed={collapsed} />

      <main style={{ flex: 1, padding: '28px 32px', background: T.colors.bg.surface, overflowX: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <button onClick={() => setCollapsed((c) => !c)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: T.colors.text.muted }}>☰</button>
              <h1 style={{ fontFamily: T.fonts.display, fontSize: 32, margin: 0, fontWeight: 600, letterSpacing: '-0.02em' }}>Dashboard</h1>
            </div>
            <p style={{ color: T.colors.text.muted, margin: 0, fontSize: 13 }}>{today} · Welcome back, Admin 👋</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', padding: 4, background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`, borderRadius: T.radius.full }}>
              {['Today', '7d', '30d', '90d'].map((r, i) => (
                <button key={r} style={{
                  padding: '6px 14px', borderRadius: T.radius.full, fontSize: 12,
                  background: i === 0 ? T.colors.bg.surface3 : 'transparent',
                  color: i === 0 ? T.colors.text.primary : T.colors.text.muted,
                  border: 'none', cursor: 'pointer', fontFamily: T.fonts.body,
                }}>
                  {r}
                </button>
              ))}
            </div>
            <button style={{
              padding: '8px 16px', borderRadius: T.radius.full,
              background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
              color: T.colors.tint.white, border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: T.fonts.body,
            }}>
              + Add Show
            </button>
          </div>
        </div>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {KPI.map((kpi) => <KPICard key={kpi.label} kpi={kpi} />)}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
          <BarChart />
          <CityRevenue />
        </div>

        {/* Table */}
        <BookingsTable />

        {/* Activity log */}
        <div style={{ padding: 22, borderRadius: T.radius.lg, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}` }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 600 }}>Recent Activity</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {ACTIVITY.map((a) => (
              <div key={a.time} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12 }}>
                <span style={{ fontFamily: T.fonts.mono, color: T.colors.text.muted, flexShrink: 0 }}>{a.time}</span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.colors.accent.indigo, flexShrink: 0 }} />
                <span style={{ color: T.colors.text.secondary }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
