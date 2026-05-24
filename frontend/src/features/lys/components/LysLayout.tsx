import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, User, Home, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/store/authStore';

const NAV = [
  { label: 'My Events',    icon: LayoutDashboard, href: '/list-your-show/my-events' },
  { label: 'Create Event', icon: PlusCircle,      href: '/list-your-show/create' },
  { label: 'My Profile',   icon: User,            href: '/list-your-show/profile' },
] as const;

export function LysLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-bg-surface font-sans">
      <aside
        className={cn(
          'flex flex-col flex-shrink-0 border-r border-border-default bg-bg-base transition-[width] duration-[220ms] relative z-[45]',
          collapsed ? 'w-[60px]' : 'w-[240px]',
        )}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border-default">
          {!collapsed && (
            <span className="font-display font-bold text-base text-text-primary truncate">
              Book<span className="text-accent-crimson">Karoo</span>
              <span className="text-accent-indigo text-xs ml-1.5 font-sans font-normal">LYS</span>
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
            const active = pathname.startsWith(href);
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
                  collapsed && 'justify-center px-2',
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && label}
              </Link>
            );
          })}

          <div className="border-t border-border-default my-1.5 mx-1" />

          <Link
            to="/"
            title="View Site"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface2 transition-colors',
              collapsed && 'justify-center px-2',
            )}
          >
            <Home size={16} className="flex-shrink-0" />
            {!collapsed && 'View Site'}
          </Link>
          <button
            onClick={handleLogout}
            title="Sign out"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-muted hover:text-semantic-error hover:bg-semantic-error/08 transition-colors w-full',
              collapsed && 'justify-center px-2',
            )}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && 'Sign out'}
          </button>
        </nav>

        <div className={cn('mt-auto pb-3 px-4', collapsed && 'px-2 flex justify-center')}>
          {!collapsed && (
            <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-bg-surface">
        <div className="border-b border-border-default bg-gradient-to-r from-accent-indigo/10 to-accent-purple/5 px-6 py-2.5 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-accent-indigo tracking-wide uppercase">
            🎭 ListYourShow — Organizer Portal
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
