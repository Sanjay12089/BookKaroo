import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Monitor, Users, LayoutGrid } from 'lucide-react';
import { PartnerLayout } from '../components/PartnerLayout';
import { usePartnerVenueDetail } from '../api/usePartner';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import type { PartnerScreenInfo } from '../types';

function SeatLayoutPreview({ layout, totalSeats }: { layout: string | null; totalSeats: number }) {
  if (!layout) {
    return (
      <div className="rounded-lg bg-bg-surface2 border border-border-default/50 p-4 flex flex-col items-center justify-center gap-2 h-28">
        <LayoutGrid size={20} className="text-text-muted" />
        <p className="text-xs text-text-muted">No layout defined</p>
        <p className="text-xs text-text-muted">{totalSeats} seats total</p>
      </div>
    );
  }

  let parsed: Array<{ row: string; seats: number; category: string }> = [];
  try {
    const obj = JSON.parse(layout) as { rows?: Array<{ row: string; seats: number; category: string }> };
    parsed = obj.rows ?? [];
  } catch {
    return (
      <div className="rounded-lg bg-bg-surface2 border border-border-default/50 p-4 text-xs text-text-muted text-center h-28 flex items-center justify-center">
        {totalSeats} seats
      </div>
    );
  }

  const CATEGORY_COLORS: Record<string, string> = {
    recliner:  'bg-accent-indigo',
    executive: 'bg-accent-crimson',
    normal:    'bg-text-muted',
  };

  return (
    <div className="rounded-lg bg-bg-surface2 border border-border-default/50 p-3 space-y-1 max-h-40 overflow-y-auto">
      {parsed.map((r) => {
        const color = CATEGORY_COLORS[r.category] ?? 'bg-text-muted';
        return (
          <div key={r.row} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted w-4 flex-shrink-0">{r.row}</span>
            <div className="flex gap-0.5 flex-wrap">
              {Array.from({ length: Math.min(r.seats, 30) }, (_, i) => (
                <span key={i} className={`w-2.5 h-2.5 rounded-sm ${color} opacity-70`} />
              ))}
              {r.seats > 30 && <span className="text-[9px] text-text-muted ml-1">+{r.seats - 30}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScreenCard({ screen }: { screen: PartnerScreenInfo }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-base p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Monitor size={16} className="text-accent-indigo flex-shrink-0" />
          <h3 className="font-semibold text-text-primary text-sm">{screen.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Users size={12} />
          <span>{screen.totalSeats} seats</span>
        </div>
      </div>

      <SeatLayoutPreview layout={screen.layout} totalSeats={screen.totalSeats} />

      <div className="flex flex-wrap gap-1.5 pt-1">
        {['Recliner', 'Executive', 'Normal'].map((cat) => (
          <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-surface2 text-text-muted border border-border-default/50">
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PartnerVenueDetailPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const { data: venue, isLoading, isError, refetch } = usePartnerVenueDetail(venueId);

  return (
    <PartnerLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-6">
        <div>
          <Link
            to="/partner/venues"
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Venues
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton height={80} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={220} />)}
            </div>
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-semantic-error/30 bg-semantic-error/08 p-4 text-sm text-semantic-error flex items-center justify-between">
            <span>Failed to load venue details.</span>
            <button onClick={() => refetch()} className="underline hover:opacity-80">Retry</button>
          </div>
        )}

        {venue && (
          <>
            <div className="rounded-xl border border-border-default bg-bg-base p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-display font-bold text-text-primary">{venue.name}</h1>
                  {venue.chain && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-bg-surface2 text-text-muted mt-1">{venue.chain}</span>
                  )}
                  <p className="text-sm text-text-secondary mt-2">{venue.address}</p>
                  <p className="text-sm text-text-muted">{venue.cityName}</p>
                  <div className="flex items-center gap-3 mt-3 text-sm text-text-secondary">
                    {venue.contactPhone && <span>{venue.contactPhone}</span>}
                    {venue.contactEmail && <span>{venue.contactEmail}</span>}
                  </div>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${venue.isActive ? 'bg-semantic-success/15 text-semantic-success' : 'bg-bg-surface3 text-text-muted'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${venue.isActive ? 'bg-semantic-success' : 'bg-text-muted'}`} />
                  {venue.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {venue.amenities && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border-default">
                  {(() => {
                    let items: string[] = [];
                    try { items = JSON.parse(venue.amenities) as string[]; }
                    catch { items = venue.amenities.split(',').map((s) => s.trim()).filter(Boolean); }
                    return items.map((a) => (
                      <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-bg-surface2 text-text-secondary">{a}</span>
                    ));
                  })()}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-display font-bold text-text-primary mb-4">
                Screens ({venue.screens.length})
              </h2>
              {venue.screens.length === 0 ? (
                <div className="rounded-lg border border-border-default bg-bg-base p-8 text-center text-sm text-text-muted">
                  No screens configured for this venue yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {venue.screens.map((screen) => (
                    <ScreenCard key={screen.id} screen={screen} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PartnerLayout>
  );
}
