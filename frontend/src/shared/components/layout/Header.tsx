import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCityStore } from '@/shared/store/cityStore';
import { useCities } from '@/features/cities/api/useCities';
import { CityModal } from '@/shared/components/CityModal';
import { SearchBar } from '@/shared/components/SearchBar';
import { Button } from '@/shared/components/ui/Button';
import { api } from '@/shared/lib/api';

const CATEGORY_LINKS = [
  { label: 'Movies',     href: ROUTES.MOVIES },
  { label: 'Events',     href: ROUTES.EVENTS },
  { label: 'Plays',      href: ROUTES.PLAYS },
  { label: 'Sports',     href: ROUTES.SPORTS },
  { label: 'Activities', href: ROUTES.ACTIVITIES },
  { label: 'IPL 2026',   href: ROUTES.IPL },
] as const;

export function Header() {
  const [scrolled, setScrolled]           = useState(false);
  const [cityModalOpen, setCityModalOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen]    = useState(false);

  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { selectedCity } = useCityStore();
  const { data: cities } = useCities();
  const navigate = useNavigate();

  // Auto-open city modal on first visit (no city persisted)
  useEffect(() => {
    if (cities && cities.length > 0 && !selectedCity) {
      setCityModalOpen(true);
    }
  }, [cities, selectedCity]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  async function handleLogout() {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore — clear locally regardless
    }
    clearAuth();
    setUserMenuOpen(false);
    navigate(ROUTES.HOME);
  }

  return (
    <>
      {/* ── Row 1: Dark navbar ──────────────────────────────────────────── */}
      <header
        className={cn(
          'sticky top-0 z-40 h-16 bg-bg-nav transition-shadow duration-[220ms]',
          scrolled ? 'shadow-md' : 'shadow-none'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center gap-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex-shrink-0">
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Book<span className="text-accent-crimson">Karoo</span>
            </span>
          </Link>

          {/* City pill */}
          <button
            onClick={() => setCityModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white/80 text-sm font-sans hover:bg-white/10 hover:text-white transition-colors duration-150 flex-shrink-0"
          >
            <MapPin size={13} className="text-accent-crimson" />
            {selectedCity?.name ?? 'Select City'}
            <ChevronDown size={13} />
          </button>

          {/* Search bar */}
          <SearchBar className="flex-1" />

          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-crimson flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-bg-surface border border-border-default rounded-xl shadow-lg z-50 py-1 font-sans">
                      <div className="px-4 py-3 border-b border-border-default">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      <Link
                        to={ROUTES.MY_BOOKINGS}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface2 transition-colors"
                      >
                        <User size={15} /> My Bookings
                      </Link>
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface2 transition-colors"
                      >
                        <User size={15} /> My Profile
                      </Link>
                      {user.role === 'Admin' && (
                        <Link
                          to={ROUTES.ADMIN}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface2 transition-colors"
                        >
                          <LayoutDashboard size={15} /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-semantic-error hover:bg-semantic-error/10 transition-colors w-full"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ── Row 2: Category nav strip ───────────────────────────────────── */}
      <nav className="sticky top-16 z-39 bg-bg-surface border-b border-border-default shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6">
          <ul className="flex items-center overflow-x-auto scroll-hide gap-0">
            {CATEGORY_LINKS.map(({ label, href }) => (
              <li key={label}>
                <NavLink
                  to={href}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150',
                      isActive
                        ? 'text-accent-crimson border-accent-crimson'
                        : 'text-text-secondary border-transparent hover:text-accent-crimson hover:border-accent-crimson/40'
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* City Modal */}
      <CityModal open={cityModalOpen} onClose={() => setCityModalOpen(false)} />
    </>
  );
}
