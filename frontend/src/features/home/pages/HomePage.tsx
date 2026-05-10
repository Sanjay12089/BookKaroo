import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { HeroCarousel } from '../components/HeroCarousel';
import { MovieRail } from '../components/MovieRail';
import { IplStrip } from '../components/IplStrip';
import { EventRail } from '../components/EventRail';
import { useHomeData } from '../api/useHome';
import { useCityStore } from '@/shared/store/cityStore';
import { ROUTES } from '@/shared/constants';

const STATS = [
  { num: '4,200+', label: 'screens nationwide' },
  { num: '98%',   label: 'on-time entry' },
  { num: '2.1M',  label: 'tickets monthly' },
  { num: '4.8★',  label: 'average app rating' },
];

export default function HomePage() {
  const { selectedCity } = useCityStore();
  const cityId = selectedCity?.id ?? null;

  const { data, isLoading } = useHomeData(cityId);

  const heroMovies = data?.nowShowing?.slice(0, 3) ?? [];

  return (
    <PublicLayout>
      {/* Hero */}
      <HeroCarousel movies={heroMovies} isLoading={isLoading} />

      <div className="max-w-[1280px] mx-auto px-6 pt-12">
        {/* Now Showing */}
        <MovieRail
          title="Now Showing"
          eyebrow="In cinemas now"
          movies={data?.nowShowing}
          isLoading={isLoading}
          seeAllHref={ROUTES.MOVIES}
          seeAllLabel={`View all ${data?.nowShowing?.length ?? 0}+ →`}
        />

        {/* IPL Strip */}
        <IplStrip matches={data?.iplMatches} />

        {/* Coming Soon */}
        <MovieRail
          title="Mark Your Calendar"
          eyebrow="Coming soon"
          movies={data?.comingSoon}
          isLoading={isLoading}
          coming
          seeAllHref={`${ROUTES.MOVIES}?category=ComingSoon`}
          seeAllLabel="Set reminders →"
        />

        {/* Live Events */}
        <EventRail
          title="Live Events & Concerts"
          eyebrow="Happening near you"
          events={data?.liveEvents}
          isLoading={isLoading}
          seeAllHref={ROUTES.EVENTS}
          seeAllLabel="All events →"
        />

        {/* Plays */}
        <EventRail
          title="Plays & Theatre"
          eyebrow="Stage performances"
          events={data?.plays}
          isLoading={isLoading}
          seeAllHref={ROUTES.PLAYS}
          seeAllLabel="All plays →"
        />

        {/* Stand-Up Comedy */}
        <EventRail
          title="Stand-Up Comedy"
          eyebrow="Laugh out loud"
          events={data?.comedy}
          isLoading={isLoading}
          seeAllHref={ROUTES.EVENTS + '?type=comedy'}
          seeAllLabel="All shows →"
        />

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
