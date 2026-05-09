import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants';

interface EventCardData {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  emoji: string;
  gradient: string;
  price: string;
  date: string;
  slug: string;
}

export function EventCard({ event: e }: { event: EventCardData }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={ROUTES.EVENT_DETAIL(e.slug)}
      className={cn('block rounded-xl overflow-hidden bg-bg-surface border transition-all duration-[220ms]',
        hovered ? 'border-border-strong -translate-y-1 shadow-lg' : 'border-border-default')}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div className="aspect-[4/3] relative flex items-center justify-center" style={{ background: e.gradient }}>
        <span className="text-5xl">{e.emoji}</span>
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent-indigo/85 text-white text-[11px] font-semibold font-sans">
          {e.type}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-base text-text-primary leading-snug">{e.title}</h4>
        <p className="text-xs text-text-muted mt-1 font-sans">{e.subtitle}</p>
        <div className="flex justify-between mt-3 text-xs font-sans">
          <span className="text-text-secondary">{e.date}</span>
          <span className="text-semantic-success font-semibold">{e.price} onwards</span>
        </div>
      </div>
    </Link>
  );
}
