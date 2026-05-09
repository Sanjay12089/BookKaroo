import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, X, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ROUTES, CITIES } from '@/shared/constants';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';

const LOGO_TEXT = (
  <span className="font-display font-bold text-xl tracking-tight text-text-primary">
    Book<span className="text-accent-crimson">Karoo</span>
  </span>
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useLocalStorage<string>('bk-city', 'Ahmedabad');
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  function handleLogout() {
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
            {selectedCity}
            <ChevronDown size={13} />
          </button>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className={cn(
              'flex-1 transition-all duration-[220ms]',
              'hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface border font-sans text-sm',
              searchOpen
                ? 'border-accent-indigo ring-2 ring-accent-indigo/15'
                : 'border-border-default hover:border-border-strong cursor-pointer'
            )}
          >
            <Search size={15} className="text-text-muted flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
              placeholder="Search movies, events, venues…"
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-muted"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-text-muted">
                <X size={14} />
              </button>
            )}
          </form>

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

          <div className="ml-auto flex items-center gap-3">
            {/* Mobile search */}
            <button
              className="md:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={20} />
            </button>

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
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-surface border border-accent-indigo ring-2 ring-accent-indigo/15">
              <Search size={15} className="text-text-muted" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted font-sans"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <X size={14} className="text-text-muted" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* City selector modal */}
      <Modal open={cityModalOpen} onClose={() => { setCityModalOpen(false); setCitySearch(''); }} title="Choose your city">
        <div className="space-y-3">
          <input
            autoFocus
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search city…"
            className="w-full px-4 py-2.5 rounded-lg bg-bg-base border border-border-default text-text-primary text-sm font-sans outline-none focus:border-accent-indigo"
          />
          <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-1.5">
            {filteredCities.map((city) => (
              <button
                key={city.slug}
                onClick={() => {
                  setSelectedCity(city.name);
                  setCityModalOpen(false);
                  setCitySearch('');
                }}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-sans text-left transition-colors duration-150',
                  selectedCity === city.name
                    ? 'bg-accent-crimson/12 text-accent-crimson border border-accent-crimson/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface2'
                )}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
