import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { ROUTES, TMDB_POSTER } from '@/shared/constants';
import type { EventListItem, EventKind } from '../types';

interface EventCardProps {
  event: EventListItem;
  size?: 'sm' | 'md';
}

const TYPE_CONFIG: Record<EventKind, { label: string; emoji: string }> = {
  LiveEvent: { label: 'Concert',  emoji: '🎵' },
  Play:      { label: 'Play',     emoji: '🎭' },
  Sport:     { label: 'Sport',    emoji: '🏏' },
  Ipl:       { label: 'IPL',      emoji: '🏏' },
  Comedy:    { label: 'Comedy',   emoji: '😂' },
  Activity:  { label: 'Activity', emoji: '⚡' },
};

export function EventCard({ event: e }: EventCardProps) {
  const cfg     = TYPE_CONFIG[e.type] ?? TYPE_CONFIG.LiveEvent;
  const poster  = e.posterUrl ? TMDB_POSTER(e.posterUrl, 'w342') : null;
  const artists = e.artists.slice(0, 2).map((a) => a.name).join(', ');

  return (
    <Link
      to={ROUTES.EVENT_DETAIL(e.slug)}
      className="group cursor-pointer block"
    >
      {/* Poster */}
      <div
        className={cn(
          'relative aspect-[3/4] rounded-lg overflow-hidden bg-section shadow-card group-hover:shadow-card-hover transition-all duration-200 group-hover:-translate-y-1 isolate'
        )}
      >
        {poster ? (
          <img
            src={poster}
            alt={e.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}

        {/* Fallback gradient behind image */}
        <div className="absolute inset-0 bg-gradient-to-br from-section to-border-l flex flex-col items-center justify-center -z-10">
          <span className="text-4xl">{cfg.emoji}</span>
        </div>

        {/* Type badge top-left */}
        <div className="absolute top-2 left-2 bg-brand text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          {cfg.emoji} {cfg.label}
        </div>

        {/* Age restriction top-right */}
        {e.ageRestriction > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {e.ageRestriction}+
          </div>
        )}

        {/* Date chip bottom-left */}
        <div className="absolute bottom-2 left-2 bg-black/65 text-white text-[11px] px-2 py-0.5 rounded">
          {e.eventDateLabel}
        </div>
      </div>

      {/* Meta below poster */}
      <div className="pt-2 pb-1 px-0.5">
        <p className="text-sm font-semibold text-tx-primary line-clamp-2 leading-tight mb-1">
          {e.title}
        </p>
        <p className="text-[11px] text-tx-muted line-clamp-1 mb-1">
          {e.venueName}
        </p>
        {e.lowestPrice > 0 ? (
          <p className="text-xs text-success font-medium">
            from ₹{e.lowestPrice.toLocaleString('en-IN')}
          </p>
        ) : (
          <p className="text-xs text-tx-muted">Free</p>
        )}
        {artists && (
          <p className="text-[11px] text-tx-muted line-clamp-1 mt-0.5">{artists}</p>
        )}
      </div>
    </Link>
  );
}
