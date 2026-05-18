import { memo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import type { Movie } from '@/shared/types';
import { ROUTES, TMDB_POSTER } from '@/shared/constants';

interface MovieCardProps {
  movie: Movie;
  coming?: boolean;
}

function MovieCardComponent({ movie, coming = false }: MovieCardProps) {
  const posterUrl = movie.posterUrl ? TMDB_POSTER(movie.posterUrl) : null;

  return (
    <Link
      to={ROUTES.MOVIE_DETAIL(movie.slug)}
      className="group cursor-pointer block"
    >
      {/* Poster */}
      <div
        className={cn(
          'relative aspect-[2/3] rounded-lg overflow-hidden bg-section shadow-card group-hover:shadow-card-hover transition-all duration-200 group-hover:-translate-y-1 isolate'
        )}
      >
        {posterUrl ? (
          <img
            src={posterUrl} alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Hide broken image, reveal the fallback beneath it
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        {/* Fallback always rendered behind the image */}
        <div className="absolute inset-0 bg-gradient-to-br from-section to-border-l flex flex-col items-center justify-center gap-2 -z-10">
          <span className="text-3xl">🎬</span>
          <span className="text-[10px] text-tx-muted text-center px-2 font-sans leading-snug">{movie.title}</span>
        </div>

        {/* Rating badge */}
        {movie.imdbRating && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            ⭐ {movie.imdbRating}
          </div>
        )}

        {/* Coming soon date badge */}
        {coming && movie.releaseDate && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        )}
      </div>

      {/* Meta below poster */}
      <div className="pt-2 pb-1 px-0.5">
        <p className="text-sm font-semibold text-tx-primary line-clamp-2 leading-tight mb-1">
          {movie.title}
        </p>
        <p className="text-[11px] text-tx-muted mb-1.5 line-clamp-1">
          {movie.genres?.slice(0, 2).join(' · ')}
        </p>

        {/* Hover Book Now */}
        <button
          type="button"
          tabIndex={-1}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-full bg-brand text-white text-xs font-semibold py-2 rounded text-center cursor-pointer hover:bg-brand-dark"
        >
          {coming ? '🔔 Remind Me' : '🎟 Book Now'}
        </button>
      </div>
    </Link>
  );
}

export const MovieCard = memo(MovieCardComponent);
