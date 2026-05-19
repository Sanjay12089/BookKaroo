import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Movie } from '@/shared/types';
import { ROUTES, TMDB_BACKDROP } from '@/shared/constants';
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
    return <Skeleton className="w-full h-[360px] md:h-[420px] rounded-none" />;
  }

  if (!movies.length) return null;

  const movie = movies[active];
  const backdropUrl = movie.backdropUrl ? TMDB_BACKDROP(movie.backdropUrl) : null;

  const goPrev = () => go((active - 1 + movies.length) % movies.length);
  const goNext = () => go((active + 1) % movies.length);

  return (
    <section className="relative overflow-hidden h-[360px] md:h-[420px] bg-[#1a1a2e] select-none">

      {/* ── Full-width backdrop image ──────────────────────────────────── */}
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={movie.title}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
            fading ? 'opacity-0' : 'opacity-100'
          )}
          loading="eager"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        /* Fallback placeholder when no backdrop */
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] flex items-center justify-center">
          <span className="text-7xl opacity-30">🎬</span>
        </div>
      )}

      {/* ── Bottom gradient — keeps CTA readable over any image ───────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

      {/* ── Movie info strip at bottom-left ───────────────────────────── */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 px-4 md:px-10 pb-8 transition-all duration-200',
          fading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        )}
      >
        <div className="max-w-xl">
          {/* Genre / certificate pill */}
          {(movie.certificate || movie.durationMin) && (
            <p className="text-xs text-white/65 mb-1.5 tracking-wide">
              {[
                movie.certificate,
                movie.durationMin ? `${Math.floor(movie.durationMin / 60)}h ${movie.durationMin % 60}m` : null,
                movie.languages?.[0],
              ].filter(Boolean).join(' · ')}
            </p>
          )}

          <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-3 line-clamp-2 drop-shadow-sm">
            {movie.title}
          </h2>

          <Link to={ROUTES.SHOWTIMES(movie.slug)}>
            <Button size="md">🎟 Book Tickets</Button>
          </Link>
        </div>
      </div>

      {/* ── LEFT arrow — vertically centered ──────────────────────────── */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full
                   bg-white/90 hover:bg-white
                   shadow-md hover:shadow-lg
                   flex items-center justify-center
                   text-[#2B3148] hover:text-accent-crimson
                   transition-all duration-150 hover:scale-105"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {/* ── RIGHT arrow — vertically centered ─────────────────────────── */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full
                   bg-white/90 hover:bg-white
                   shadow-md hover:shadow-lg
                   flex items-center justify-center
                   text-[#2B3148] hover:text-accent-crimson
                   transition-all duration-150 hover:scale-105"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      {/* ── Dots — bottom center ──────────────────────────────────────── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-250',
              i === active
                ? 'w-6 bg-white'
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>

    </section>
  );
}
