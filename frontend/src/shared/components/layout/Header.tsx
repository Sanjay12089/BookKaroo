import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, ChevronDown, LayoutDashboard, Building2 } from 'lucide-react';
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
      {/* ── Row 1: White main header (BMS-style) ───────────────────────── */}
      <header
        className={cn(
          'sticky top-0 z-40 h-16 bg-bg-surface border-b border-border-default transition-shadow duration-[220ms]',
          scrolled ? 'shadow-md' : 'shadow-sm'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-full flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex-shrink-0">
            <span className="font-display font-bold text-xl tracking-tight text-text-primary">
              Book<span className="text-accent-crimson">Karoo</span>
            </span>
          </Link>

          {/* City selector */}
          <button
            onClick={() => setCityModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-default text-text-secondary text-sm font-sans hover:border-accent-crimson hover:text-accent-crimson transition-colors duration-150 flex-shrink-0 bg-bg-surface2"
          >
            <MapPin size={13} className="text-accent-crimson flex-shrink-0" />
            <span className="max-w-[100px] truncate">{selectedCity?.name ?? 'Select City'}</span>
            <ChevronDown size={13} className="flex-shrink-0" />
          </button>

          {/* Search bar */}
          <SearchBar className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-crimson flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-text-secondary">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-bg-surface border border-border-default rounded-xl shadow-lg z-50 py-1 font-sans">
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
                      {(user.role === 'Partner' || user.isPartner) && (
                        <Link
                          to="/partner"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-accent-indigo hover:bg-accent-indigo/10 transition-colors"
                        >
                          <Building2 size={15} /> Partner Portal
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
      <nav className="sticky top-16 z-39 bg-bg-surface2 border-b border-border-default shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <ul className="flex items-center overflow-x-auto scroll-hide">
            {CATEGORY_LINKS.map(({ label, href }) => (
              <li key={label}>
                <NavLink
                  to={href}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150',
                      isActive
                        ? 'text-accent-crimson border-accent-crimson'
                        : 'text-text-secondary border-transparent hover:text-accent-crimson hover:border-accent-crimson/50'
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
