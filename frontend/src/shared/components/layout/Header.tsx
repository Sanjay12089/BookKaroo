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
import { Logo } from '@/design/Logo';
import { api } from '@/shared/lib/api';

const CATEGORY_LINKS: Array<[string, string]> = [
  ['Movies', ROUTES.MOVIES],
  ['Events', ROUTES.EVENTS],
  ['Plays', ROUTES.PLAYS],
  ['Sports', ROUTES.SPORTS],
  ['Activities', ROUTES.ACTIVITIES],
  ['IPL 2026', ROUTES.IPL ?? '/ipl'],
];

export function Header() {
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
      <header className="sticky top-0 z-40">
        {/* Row 1: dark navbar */}
        <div className="h-14 bg-nav shadow-nav">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center gap-4">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex-shrink-0">
              <Logo size={30} onDark variant="full-horizontal" />
            </Link>

            {/* City selector */}
            <button
              onClick={() => setCityModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-nav-hover rounded-full border border-white/20 text-nav-text text-sm cursor-pointer hover:bg-white/15 transition-colors flex-shrink-0"
            >
              <MapPin size={13} />
              {selectedCity?.name ?? 'Select City'}
              <ChevronDown size={13} />
            </button>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <SearchBar className="w-full" />
            </div>

            <div className="ml-auto flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-nav-text hover:opacity-90 transition-opacity"
                  >
                    <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={14} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border-l rounded-xl shadow-modal z-50 py-1 font-sans">
                        <div className="px-4 py-3 border-b border-border-l">
                          <p className="text-sm font-semibold text-tx-primary truncate">{user.name}</p>
                          <p className="text-xs text-tx-muted truncate">{user.email}</p>
                        </div>
                        <Link
                          to={ROUTES.MY_BOOKINGS}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-tx-secondary hover:text-brand hover:bg-brand-light transition-colors"
                        >
                          <User size={15} /> My Bookings
                        </Link>
                        <Link
                          to={ROUTES.PROFILE}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-tx-secondary hover:text-brand hover:bg-brand-light transition-colors"
                        >
                          <User size={15} /> My Profile
                        </Link>
                        {user.role === 'Admin' && (
                          <Link
                            to={ROUTES.ADMIN}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-tx-secondary hover:text-brand hover:bg-brand-light transition-colors"
                          >
                            <LayoutDashboard size={15} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error-bg transition-colors w-full"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="px-5 py-1.5 rounded-full border border-white text-white text-sm font-medium hover:bg-white hover:text-nav transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: category nav */}
        <div className="h-10 bg-page border-b border-border-l">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full overflow-x-auto scroll-hide">
            <nav className="flex items-center h-full gap-0">
              {CATEGORY_LINKS.map(([label, href]) => (
                <NavLink
                  key={label}
                  to={href}
                  className={({ isActive }) =>
                    cn(
                      'px-4 h-10 flex items-center text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                      isActive
                        ? 'text-brand border-brand'
                        : 'text-tx-secondary border-transparent hover:text-brand hover:border-brand/50'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* City Modal */}
      <CityModal open={cityModalOpen} onClose={() => setCityModalOpen(false)} />
    </>
  );
}
