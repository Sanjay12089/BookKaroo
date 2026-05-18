import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateBanner, useUpdateBanner } from '../api/useAdmin';
import type { AdminBanner } from '../types';

const schema = z.object({
  title:    z.string().min(3, 'Min 3 chars').max(200),
  imageUrl: z.string().url('Must be a valid URL'),
  linkUrl:  z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean(),
  startsAt: z.string().optional(),
  endsAt:   z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  mode:      'create' | 'edit';
  banner?:   AdminBanner;
  onClose:   () => void;
  onSuccess: () => void;
}

export function BannerFormModal({ mode, banner, onClose, onSuccess }: Props) {
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const isPending    = createBanner.isPending || updateBanner.isPending;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:    banner?.title    ?? '',
      imageUrl: banner?.imageUrl ?? '',
      linkUrl:  banner?.linkUrl  ?? '',
      isActive: banner?.isActive ?? true,
      startsAt: banner?.startsAt ? banner.startsAt.slice(0, 16) : '',
      endsAt:   banner?.endsAt   ? banner.endsAt.slice(0, 16) : '',
    },
  });

  const imageUrl = watch('imageUrl');
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [imageUrl]);

  const isValidUrl = (url: string) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      title:    data.title,
      imageUrl: data.imageUrl,
      linkUrl:  data.linkUrl || undefined,
      isActive: data.isActive,
      position: banner?.position ?? 0,
      startsAt: data.startsAt || undefined,
      endsAt:   data.endsAt   || undefined,
    };

    if (mode === 'create') {
      await createBanner.mutateAsync(payload);
    } else if (banner) {
      await updateBanner.mutateAsync({ id: banner.id, data: payload });
    }
    onSuccess();
    onClose();
  };

  const INPUT = 'w-full px-3 py-2 rounded-lg bg-section border border-border-l text-tx-primary text-sm font-sans focus:outline-none focus:border-brand transition-colors';
  const ERR   = 'text-xs text-error font-sans mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl bg-card rounded-2xl border border-border-l shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-l">
          <h2 className="font-display font-bold text-lg text-tx-primary">
            {mode === 'create' ? 'Add Banner' : 'Edit Banner'}
          </h2>
          <button onClick={onClose} className="text-tx-muted hover:text-tx-primary transition-colors text-xl leading-none">×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-tx-secondary font-sans block mb-1">
              Title <span className="text-brand">*</span>
            </label>
            <input {...register('title')} className={INPUT} placeholder="Summer Sale 2026" />
            {errors.title && <p className={ERR}>{errors.title.message}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-semibold text-tx-secondary font-sans block mb-1">
              Image URL <span className="text-brand">*</span>
            </label>
            <input {...register('imageUrl')} className={INPUT} placeholder="https://example.com/banner.jpg" />
            {errors.imageUrl && <p className={ERR}>{errors.imageUrl.message}</p>}
            {/* Image preview */}
            <div className="mt-2 rounded-lg overflow-hidden bg-section border border-border-l" style={{ height: 128 }}>
              {imageUrl && isValidUrl(imageUrl) && !imgError ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-tx-muted text-sm font-sans gap-2">
                  <span className="text-2xl">🖼</span>
                  <span>Image preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Link URL */}
          <div>
            <label className="text-sm font-semibold text-tx-secondary font-sans block mb-1">
              Link URL <span className="text-tx-muted font-normal">(optional)</span>
            </label>
            <input {...register('linkUrl')} className={INPUT} placeholder="https://bookkaroo.com/movies" />
            {errors.linkUrl && <p className={ERR}>{errors.linkUrl.message}</p>}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-tx-secondary font-sans">Status</label>
            <label className="relative inline-flex items-center cursor-pointer gap-2">
              <input type="checkbox" {...register('isActive')} className="sr-only peer" />
              <div className="w-9 h-5 bg-section peer-focus:outline-none rounded-full peer peer-checked:bg-success-bg transition-colors" />
              <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4" />
              <span className="text-sm font-sans text-tx-secondary">{watch('isActive') ? 'Active' : 'Inactive'}</span>
            </label>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-tx-secondary font-sans block mb-1">Show From</label>
              <input type="datetime-local" {...register('startsAt')} className={INPUT} />
            </div>
            <div>
              <label className="text-sm font-semibold text-tx-secondary font-sans block mb-1">Show Until</label>
              <input type="datetime-local" {...register('endsAt')} className={INPUT} />
            </div>
          </div>
          <p className="text-xs text-tx-muted font-sans">Leave blank to always show (when active)</p>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-l bg-section">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-full border border-border-l text-sm font-semibold font-sans hover:bg-section transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="px-5 py-2 rounded-full bg-brand text-white text-sm font-semibold font-sans hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {isPending ? 'Saving…' : mode === 'create' ? 'Create Banner' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
