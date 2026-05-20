import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, ChevronRight, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PartnerLayout } from '../components/PartnerLayout';
import { usePartnerVenues, useUpdatePartnerVenue } from '../api/usePartner';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Modal } from '@/shared/components/ui/Modal';
import type { PartnerVenueListItem } from '../types';

const editSchema = z.object({
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email('Invalid email').or(z.literal('')).optional(),
  amenities:    z.string().max(500).optional(),
});
type EditForm = z.infer<typeof editSchema>;

interface EditVenueModalProps {
  venue:   PartnerVenueListItem;
  onClose: () => void;
}

function EditVenueModal({ venue, onClose }: EditVenueModalProps) {
  const update = useUpdatePartnerVenue(venue.id);
  const { register, handleSubmit, formState: { errors } } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      contactPhone: venue.contactPhone ?? '',
      contactEmail: venue.contactEmail ?? '',
      amenities: '',
    },
  });

  function onSubmit(data: EditForm) {
    update.mutate(
      {
        contactPhone: data.contactPhone || undefined,
        contactEmail: data.contactEmail || undefined,
        amenities:    data.amenities    || undefined,
      },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal open onClose={onClose} maxWidth="max-w-md">
      <h2 className="font-display font-bold text-xl text-text-primary mb-4">Edit Venue Contact</h2>
      <p className="text-sm text-text-secondary mb-5">{venue.name}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
            Contact Phone
          </label>
          <input
            {...register('contactPhone')}
            className="w-full px-3 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo"
            placeholder="+91 99999 99999"
          />
          {errors.contactPhone && <p className="text-xs text-semantic-error mt-1">{errors.contactPhone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
            Contact Email
          </label>
          <input
            {...register('contactEmail')}
            className="w-full px-3 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo"
            placeholder="venue@example.com"
          />
          {errors.contactEmail && <p className="text-xs text-semantic-error mt-1">{errors.contactEmail.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
            Amenities (comma-separated or JSON array)
          </label>
          <input
            {...register('amenities')}
            className="w-full px-3 py-2 rounded-lg bg-bg-surface2 border border-border-default text-text-primary text-sm focus:outline-none focus:border-accent-indigo"
            placeholder='["Parking","Food Court","IMAX"]'
          />
        </div>

        {update.isError && (
          <p className="text-xs text-semantic-error">Failed to update venue. Please try again.</p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border-default text-text-secondary text-sm hover:bg-bg-surface2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={update.isPending}
            className="flex-1 py-2 rounded-lg bg-accent-indigo text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {update.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function PartnerVenuesPage() {
  const { data: venues, isLoading, isError, refetch } = usePartnerVenues();
  const [editingVenue, setEditingVenue] = useState<PartnerVenueListItem | null>(null);

  return (
    <PartnerLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-text-primary">My Venues</h1>
          <p className="text-sm text-text-secondary mt-1">Venues assigned to your partner account.</p>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={160} />)}
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-semantic-error/30 bg-semantic-error/08 p-4 text-sm text-semantic-error flex items-center justify-between">
            <span>Failed to load venues.</span>
            <button onClick={() => refetch()} className="underline hover:opacity-80">Retry</button>
          </div>
        )}

        {venues && venues.length === 0 && (
          <div className="rounded-lg border border-border-default bg-bg-base p-8 text-center">
            <Building2 size={32} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-muted text-sm">No venues assigned to your account yet.</p>
            <p className="text-text-muted text-xs mt-1">Contact your admin to grant venue access.</p>
          </div>
        )}

        {venues && venues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue) => (
              <div key={venue.id} className="rounded-xl border border-border-default bg-bg-base p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{venue.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{venue.address}</p>
                    <p className="text-xs text-text-secondary">{venue.cityName}</p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${venue.isActive ? 'bg-semantic-success/15 text-semantic-success' : 'bg-bg-surface3 text-text-muted'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${venue.isActive ? 'bg-semantic-success' : 'bg-text-muted'}`} />
                    {venue.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="text-xs text-text-secondary space-y-1">
                  <p className="font-medium text-text-muted">{venue.screenCount} screen{venue.screenCount !== 1 ? 's' : ''}</p>
                  {venue.contactPhone && (
                    <p className="flex items-center gap-1.5"><Phone size={11} className="flex-shrink-0" /> {venue.contactPhone}</p>
                  )}
                  {venue.contactEmail && (
                    <p className="flex items-center gap-1.5"><Mail size={11} className="flex-shrink-0" /> {venue.contactEmail}</p>
                  )}
                </div>

                <div className="flex gap-2 mt-auto pt-1">
                  <button
                    onClick={() => setEditingVenue(venue)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default text-text-secondary text-xs hover:text-accent-indigo hover:border-accent-indigo transition-colors"
                  >
                    <Pencil size={12} /> Edit Contact
                  </button>
                  <Link
                    to={`/partner/venues/${venue.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-indigo/12 text-accent-indigo text-xs hover:bg-accent-indigo/20 transition-colors"
                  >
                    View Screens <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          onClose={() => setEditingVenue(null)}
        />
      )}
    </PartnerLayout>
  );
}
