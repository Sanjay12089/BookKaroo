import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bell, Share2, Heart, ChevronRight } from 'lucide-react';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useMovieDetail } from '../api/useMovies';
import { usePassedViewport } from '@/shared/hooks/useScrollPosition';
import { ROUTES, TMDB_BACKDROP, TMDB_POSTER } from '@/shared/constants';
import { formatDuration } from '@/shared/lib/utils';

export default function MovieDetailPage() {
  const { slug = '' } = useParams();
  const { data: movie, isLoading } = useMovieDetail(slug);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const stickyVisible = usePassedViewport(heroCTARef);

  if (isLoading) return (
    <PublicLayout>
      <Skeleton className="h-[440px] w-full rounded-none" />
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-4">
        <Skeleton height={48} width="50%" />
        <Skeleton height={24} width="30%" />
        <div className="flex gap-2"><Skeleton height={28} width={80} /><Skeleton height={28} width={80} /></div>
      </div>
    </PublicLayout>
  );

  if (!movie) return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[60vh] text-text-muted font-sans">
        Movie not found.
      </div>
    </PublicLayout>
  );

  const backdropUrl = movie.backdropUrl ? TMDB_BACKDROP(movie.backdropUrl) : null;
  const posterUrl   = movie.posterUrl   ? TMDB_POSTER(movie.posterUrl)     : null;
  const isComingSoon = movie.category === 'ComingSoon';
  const showtimesHref = ROUTES.SHOWTIMES(movie.slug);

  return (
    <PublicLayout>
      {/* Backdrop */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        {backdropUrl && (
          <div className="absolute inset-0 bg-cover bg-center opacity-25"
               style={{ backgroundImage: `url(${backdropUrl})` }} />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_60%_30%,rgba(168,85,247,0.45),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/60 to-bg-base" />
      </div>

      <main className="max-w-[1280px] mx-auto px-6 pb-20">
        {/* Detail shell */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 -mt-52 relative z-10">
          {/* Left: poster + actions */}
          <aside className="flex flex-col gap-4">
            <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 bg-bg-surface2">
              {posterUrl
                ? <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-text-muted text-4xl">🎬</div>}
            </div>
            <Button variant="ghost" className="gap-2 w-full"><Heart size={16}/> Watchlist</Button>
            <Button variant="ghost" className="gap-2 w-full"><Share2 size={16}/> Share</Button>
          </aside>

          {/* Right: metadata */}
          <section className="pt-0 md:pt-16">
            <p className="text-[11px] font-semibold text-text-muted tracking-widest uppercase font-sans mb-3">
              {isComingSoon ? 'Coming Soon' : 'Now Showing'} · {movie.certificate} · {formatDuration(movie.durationMin)}
            </p>

            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-[1.05] mb-3">
              {movie.title}
            </h1>

            {movie.description && (
              <p className="text-text-secondary text-base leading-relaxed max-w-xl mb-5 font-sans line-clamp-3">
                {movie.description}
              </p>
            )}

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.imdbRating && <Badge color="warning">⭐ {movie.imdbRating} / 10</Badge>}
              {movie.genres?.map((g) => <Badge key={g}>{g}</Badge>)}
              {movie.formats?.slice(0, 3).map((f) => <Badge key={f} color="indigo">{f}</Badge>)}
              {movie.languages?.slice(0, 3).map((l) => <Badge key={l}>{l}</Badge>)}
            </div>

            {/* CTA */}
            <div ref={heroCTARef} className="flex gap-3 flex-wrap mb-8">
              {isComingSoon ? (
                <Button size="lg" variant="secondary" className="gap-2"><Bell size={18}/> Remind Me</Button>
              ) : (
                <Link to={showtimesHref}>
                  <Button size="lg">🎟 Book Tickets</Button>
                </Link>
              )}
              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="ghost">▶ Watch Trailer</Button>
                </a>
              )}
            </div>

            {/* Facts grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-bg-surface border border-border-default mb-8">
              {[
                { label: 'Duration',    value: formatDuration(movie.durationMin) },
                { label: 'Released',    value: movie.releaseDate ?? '—' },
                { label: 'Certificate', value: movie.certificate ?? '—' },
                { label: 'Language',    value: movie.languages?.[0] ?? '—' },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] font-semibold text-text-muted tracking-wider uppercase font-sans">{f.label}</p>
                  <p className="text-base font-semibold text-text-primary mt-1 font-sans">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Showtimes CTA */}
            {!isComingSoon && (
              <Link to={showtimesHref}
                className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-default hover:border-border-strong transition-colors group">
                <div>
                  <p className="font-semibold text-text-primary font-sans">View all showtimes</p>
                  <p className="text-sm text-text-muted font-sans">3 venues in Ahmedabad</p>
                </div>
                <ChevronRight size={20} className="text-text-muted group-hover:text-text-primary transition-colors" />
              </Link>
            )}
          </section>
        </div>
      </main>

      {/* Sticky Book Tickets bar */}
      {stickyVisible && !isComingSoon && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-3
          bg-bg-surface/90 backdrop-blur-xl border-t border-border-default shadow-lg md:bottom-0 mb-[56px] md:mb-0">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text-primary text-sm truncate">{movie.title}</p>
            <p className="text-xs text-text-muted font-sans font-mono">from ₹180 · 3 venues</p>
          </div>
          <Link to={showtimesHref}>
            <Button size="md">Pick a showtime →</Button>
          </Link>
        </div>
      )}
    </PublicLayout>
  );
}
