import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Film, CalendarDays, Trophy, User } from 'lucide-react';

const tabs = [
  { icon: Home,         label: 'Home',    path: '/' },
  { icon: Film,         label: 'Movies',  path: '/movies' },
  { icon: CalendarDays, label: 'Events',  path: '/events' },
  { icon: Trophy,       label: 'IPL',     path: '/ipl' },
  { icon: User,         label: 'Profile', path: '/profile' },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-page border-t border-border-l shadow-bottom-bar h-14 flex">
      {tabs.map(({ icon: Icon, label, path }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive(path) ? 'text-brand' : 'text-tx-muted'
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
