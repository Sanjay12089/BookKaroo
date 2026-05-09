import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { HeroCarousel } from '../components/HeroCarousel';
import { MovieRail } from '../components/MovieRail';
import { IplStrip } from '../components/IplStrip';
import { EventGrid } from '../components/EventGrid';
import { useNowShowing, useComingSoon, useEvents } from '../api/useHome';
import { ROUTES } from '@/shared/constants';

// Trust band stats
const STATS = [
  { num: '4,200+', label: 'screens nationwide' },
  { num: '98%', label: 'on-time entry' },
  { num: '2.1M', label: 'tickets monthly' },
  { num: '4.8★', label: 'average app rating' },
];

export default function HomePage() {
  const nowShowing = useNowShowing();
  const comingSoon = useComingSoon();
  const events = useEvents();

  // Use first 3 movies for hero (or empty array while loading)
  const heroMovies = nowShowing.data?.items.slice(0, 3) ?? [];

  return (
    <PublicLayout>
      {/* Hero */}
      <HeroCarousel movies={heroMovies} isLoading={nowShowing.isLoading} />

      <div className="max-w-[1280px] mx-auto px-6 pt-12">
        {/* Now Showing */}
        <MovieRail
          title="Now Showing"
          eyebrow="In cinemas now"
          movies={nowShowing.data?.items}
          isLoading={nowShowing.isLoading}
          seeAllHref={ROUTES.MOVIES}
          seeAllLabel={`View all ${nowShowing.data?.total ?? 0} →`}
        />

        {/* IPL Strip */}
        <IplStrip />

        {/* Coming Soon */}
        <MovieRail
          title="Mark Your Calendar"
          eyebrow="Coming soon"
          movies={comingSoon.data?.items}
          isLoading={comingSoon.isLoading}
          coming
          seeAllHref={`${ROUTES.MOVIES}?category=ComingSoon`}
          seeAllLabel="Set reminders →"
        />

        {/* Events */}
        <EventGrid isLoading={events.isLoading} />

        {/* Trust band */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-border-default mb-0">
          {STATS.map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-semibold text-3xl text-text-primary">{num}</div>
              <div className="text-xs text-text-muted uppercase tracking-wider mt-1 font-sans">{label}</div>
            </div>
          ))}
        </section>
      </div>
    </PublicLayout>
  );
}
