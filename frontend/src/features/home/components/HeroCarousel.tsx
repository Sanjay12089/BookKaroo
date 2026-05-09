import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import type { Movie } from '@/shared/types';
import { ROUTES, TMDB_BACKDROP, TMDB_POSTER } from '@/shared/constants';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';

interface HeroCarouselProps {
  movies: Movie[];
  isLoading?: boolean;
}

export function HeroCarousel({ movies, isLoading }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const go = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 200);
  }, []);

  useEffect(() => {
    if (!movies.length) return;
    const id = setInterval(() => go((active + 1) % movies.length), 4000);
    return () => clearInterval(id);
  }, [active, go, movies.length]);

  if (isLoading) {
    return <Skeleton className="w-full h-[520px] md:h-[620px] rounded-none" />;
  }

  if (!movies.length) return null;

  const movie = movies[active];
  const backdropUrl = movie.backdropUrl ? TMDB_BACKDROP(movie.backdropUrl) : null;
  const posterUrl = movie.posterUrl ? TMDB_POSTER(movie.posterUrl) : null;

  return (
    <section className="relative overflow-hidden min-h-[520px] md:min-h-[620px]">
      {/* Backdrop */}
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: `url(${backdropUrl})`, opacity: fading ? 0 : 0.25 }}
        />
      )}
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A0E1A_35%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#0A0E1A_10%,transparent_60%)]" />

      {/* Content */}
      <div
        className={cn(
          'relative max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10 items-center min-h-[520px] md:min-h-[620px] transition-all duration-200',
          fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        )}
      >
        <div className="space-y-5">
          <Badge color="crimson" className="gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-crimson animate-pulse-glow inline-block" />
            Now Showing
          </Badge>

          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-text-primary leading-[1.05] tracking-tight">
            {movie.title}
          </h1>

          {movie.description && (
            <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-lg line-clamp-2">
              {movie.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {movie.imdbRating && (
              <Badge color="warning">⭐ {movie.imdbRating} / 10</Badge>
            )}
            {movie.formats?.slice(0, 2).map((f) => <Badge key={f} color="indigo">{f}</Badge>)}
            {movie.languages?.slice(0, 2).map((l) => <Badge key={l}>{l}</Badge>)}
            {movie.certificate && <Badge>{movie.certificate} · {Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}m</Badge>}
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link to={ROUTES.SHOWTIMES(movie.slug)}>
              <Button size="lg">🎟 Book Tickets</Button>
            </Link>
            {movie.trailerUrl && (
              <Button variant="ghost" size="lg">▶ Watch Trailer</Button>
            )}
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1.5 pt-2">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  'h-1 rounded-full transition-all duration-200',
                  i === active ? 'w-8 bg-white' : 'w-2.5 bg-white/20'
                )}
              />
            ))}
          </div>
        </div>

        {/* Poster */}
        {posterUrl && (
          <div className="hidden md:block justify-self-end">
            <div
              className="relative w-[240px] aspect-[2/3] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/10"
              style={{ transform: 'rotate(-2deg)' }}
            >
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>

      {/* Arrows */}
      <div className="absolute right-6 bottom-6 flex gap-2">
        {['‹', '›'].map((arrow, i) => (
          <button
            key={arrow}
            onClick={() => go(i === 0 ? (active - 1 + movies.length) % movies.length : (active + 1) % movies.length)}
            className="w-10 h-10 rounded-full bg-black/40 border border-white/15 text-white backdrop-blur-md hover:bg-white/20 transition-colors text-lg flex items-center justify-center"
          >
            {arrow}
          </button>
        ))}
      </div>
    </section>
  );
}
