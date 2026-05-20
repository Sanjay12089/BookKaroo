import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Clock, Ticket, BarChart2, Star,
  LogOut, Menu, X, Home,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/store/authStore';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/partner' },
  { label: 'My Venues', icon: Building2,       href: '/partner/venues' },
  { label: 'Shows',     icon: Clock,           href: '/partner/shows' },
  { label: 'Bookings',  icon: Ticket,          href: '/partner/bookings' },
  { label: 'Reports',   icon: BarChart2,       href: '/partner/reports' },
  { label: 'Reviews',   icon: Star,            href: '/partner/reviews' },
] as const;

export function PartnerLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  const venueNames = user?.partnerVenueNames ?? [];

  return (
    <div className="flex min-h-screen bg-bg-surface font-sans">
      <aside
        className={cn(
          'flex flex-col flex-shrink-0 border-r border-border-default bg-bg-base transition-[width] duration-[220ms]',
          collapsed ? 'w-[60px]' : 'w-[240px]'
        )}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border-default">
          {!collapsed && (
            <span className="font-display font-bold text-base text-text-primary truncate">
              Book<span className="text-accent-crimson">Karoo</span>
              <span className="text-accent-indigo text-xs ml-1.5 font-sans font-normal">Partner</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="ml-auto text-text-muted hover:text-text-primary p-1 rounded flex-shrink-0"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav className="py-3 px-2 space-y-0.5">
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = href === '/partner' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150',
                  active
                    ? 'bg-accent-indigo/12 text-accent-indigo border border-accent-indigo/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface2',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>

        <div className={cn('border-t border-border-default mx-2 mt-1 pt-2 pb-3 space-y-0.5', collapsed && 'flex flex-col items-center mx-0 px-2')}>
          <Link
            to="/"
            title="View Site"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface2 transition-colors w-full',
              collapsed && 'justify-center w-auto px-2'
            )}
          >
            <Home size={16} className="flex-shrink-0" />
            {!collapsed && <span className="font-sans">View Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            title="Sign out"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-muted hover:text-semantic-error hover:bg-semantic-error/08 transition-colors w-full',
              collapsed && 'justify-center w-auto px-2'
            )}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span className="font-sans">Sign out</span>}
          </button>
          {!collapsed && (
            <p className="text-[11px] text-text-muted truncate px-3 pt-1">{user?.email}</p>
          )}
        </div>

        <div className="flex-1" />
      </aside>

      <main className="flex-1 overflow-auto bg-bg-surface">
        {venueNames.length > 0 && (
          <div className="bg-accent-indigo/12 border-b border-accent-indigo/25 px-6 py-2 text-xs text-accent-indigo">
            <span className="font-medium">Partner Portal</span>
            <span className="text-text-secondary ml-2">Managing: {venueNames.join(', ')}</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
