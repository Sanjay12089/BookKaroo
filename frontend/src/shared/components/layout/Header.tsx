import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCityStore } from '@/shared/store/cityStore';
import { useCities } from '@/features/cities/api/useCities';
import { CityModal } from '@/shared/components/CityModal';
import { SearchBar } from '@/shared/components/SearchBar';
import { Button } from '@/shared/components/ui/Button';
import { ThemeToggle } from '@/design/ThemeContext';
import { api } from '@/shared/lib/api';

const LOGO_TEXT = (
  <span className="font-display font-bold text-xl tracking-tight text-text-primary">
    Book<span className="text-accent-crimson">Karoo</span>
  </span>
);

export function Header() {
  const [scrolled, setScrolled]         = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);

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
      <header
        className={cn(
          'sticky top-0 z-40 h-16 border-b transition-all duration-[220ms]',
          scrolled
            ? 'bg-bg-surface/90 backdrop-blur-md border-border-default'
            : 'bg-transparent border-transparent'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center gap-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex-shrink-0">
            {LOGO_TEXT}
          </Link>

          {/* City pill */}
          <button
            onClick={() => setCityModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface border border-border-default text-text-secondary text-sm font-sans hover:border-border-strong transition-colors duration-150 flex-shrink-0"
          >
            <MapPin size={13} className="text-accent-crimson" />
            {selectedCity?.name ?? 'Select City'}
            <ChevronDown size={13} />
          </button>

          {/* Search bar — handles desktop form + mobile icon internally */}
          <SearchBar className="flex-1" />

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              ['Movies', ROUTES.MOVIES],
              ['Events', ROUTES.EVENTS],
              ['Sports', ROUTES.SPORTS],
              ['Plays', ROUTES.PLAYS],
            ].map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className="px-3 py-2 rounded-md text-sm font-medium font-sans text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-white text-sm font-semibold">
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

      {/* City Modal */}
      <CityModal open={cityModalOpen} onClose={() => setCityModalOpen(false)} />
    </>
  );
}
