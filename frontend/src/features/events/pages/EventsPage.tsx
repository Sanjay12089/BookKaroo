import { useLocation } from 'react-router-dom';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { Chip } from '@/shared/components/ui/Chip';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EventCard } from '../components/EventCard';
import { useEvents } from '../api/useEvents';

const TYPE_MAP: Record<string, string> = {
  '/sports':     'Sport',
  '/plays':      'Play',
  '/activities': 'Activity',
};

const PAGE_TITLES: Record<string, { title: string; emoji: string; description: string }> = {
  '/sports':     { title: 'Sports',         emoji: '🏟️', description: 'Live cricket, football, kabaddi and more.' },
  '/plays':      { title: 'Theatre & Plays', emoji: '🎭', description: 'Productions, dramas, and musical shows.' },
  '/activities': { title: 'Activities',      emoji: '🎨', description: 'Workshops, exhibitions, and kids events.' },
  '/events':     { title: 'Live Events & Concerts', emoji: '🎵', description: 'Concerts, comedy shows, and live performances.' },
};

const FALLBACK_EVENTS = [
  { id: 'e1', title: 'Amit Trivedi Live', subtitle: 'Sabarmati Riverfront, Ahmedabad', type: 'Concert', emoji: '🎵', gradient: 'linear-gradient(135deg,#1a0a2e,#4c1d95)', price: '₹999', date: 'Sat, 17 May', slug: 'amit-trivedi-live' },
  { id: 'e2', title: 'Zakir Khan: Sunata Hai Kya', subtitle: 'Tagore Hall, Ahmedabad', type: 'Comedy', emoji: '🎤', gradient: 'linear-gradient(135deg,#0a2a1a,#064e3b)', price: '₹699', date: 'Sun, 18 May', slug: 'zakir-khan-sunata' },
  { id: 'e3', title: 'Broadway Nights: Chicago', subtitle: 'Natarani Amphitheatre', type: 'Theatre', emoji: '🎭', gradient: 'linear-gradient(135deg,#3a0a2a,#831843)', price: '₹1,200', date: 'Fri, 23 May', slug: 'broadway-chicago' },
  { id: 'e4', title: 'GT vs MI — IPL 2026', subtitle: 'Narendra Modi Stadium, Ahmedabad', type: 'Sport', emoji: '🏏', gradient: 'linear-gradient(135deg,#1B64A7,#003F8A)', price: '₹500', date: '16 May', slug: 'gt-vs-mi' },
  { id: 'e5', title: 'RCB vs KKR — IPL 2026', subtitle: 'M Chinnaswamy Stadium', type: 'Sport', emoji: '🏏', gradient: 'linear-gradient(135deg,#C41C1C,#3B215C)', price: '₹400', date: '18 May', slug: 'rcb-vs-kkr' },
  { id: 'e6', title: 'Pottery Workshop', subtitle: 'The Art House, Bodakdev', type: 'Activity', emoji: '🏺', gradient: 'linear-gradient(135deg,#2a1a0a,#713f12)', price: '₹800', date: '22 May', slug: 'pottery-workshop' },
];

export default function EventsPage() {
  const { pathname } = useLocation();
  const typeFilter = TYPE_MAP[pathname];
  const meta = PAGE_TITLES[pathname] ?? PAGE_TITLES['/events'];

  const { data, isLoading } = useEvents(typeFilter);
  const apiEvents = data?.items ?? [];

  // Use API events if available, otherwise show fallback
  const showFallback = !isLoading && apiEvents.length === 0;
  const displayEvents = showFallback
    ? FALLBACK_EVENTS.filter((e) => !typeFilter || e.type.toLowerCase().includes(typeFilter.toLowerCase()))
    : apiEvents.map((e) => ({
        id: e.id, title: e.title, subtitle: '', type: e.type,
        emoji: '🎬', gradient: 'linear-gradient(135deg,#1a0a2e,#4c1d95)',
        price: '₹499', date: e.eventDate ?? 'TBA', slug: e.slug,
      }));

  return (
    <PublicLayout>
      {/* Hero strip */}
      <div className="bg-gradient-to-b from-bg-surface2 to-bg-base border-b border-border-default">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{meta.emoji}</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">{meta.title}</h1>
          </div>
          <p className="text-text-secondary font-sans text-base mb-6">{meta.description}</p>

          {/* Category filter chips */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Concert', 'Comedy', 'Sport', 'Theatre', 'Activity', 'Workshop'].map((cat) => (
              <Chip key={cat} active={cat === 'All'}>{cat}</Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Events grid */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <Skeleton className="aspect-[4/3] rounded-none" />
                <div className="p-4 space-y-2"><Skeleton height={16} width="80%" /><Skeleton height={12} width="55%" /></div>
              </div>
            ))}
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">{meta.emoji}</span>
            <h3 className="font-display text-xl text-text-secondary mb-2">No events right now</h3>
            <p className="text-text-muted text-sm font-sans">Check back soon — more events are being added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}

        {showFallback && (
          <p className="text-center text-xs text-text-muted mt-8 font-sans">
            Showing sample events — real events will appear once added via Admin panel
          </p>
        )}
      </div>
    </PublicLayout>
  );
}
