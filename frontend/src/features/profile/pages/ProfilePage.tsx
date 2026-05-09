import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useUpdateProfile } from '../api/useProfile';
import { CITIES } from '@/shared/constants';
import { toast } from '@/shared/components/ui/Toast';

const schema = z.object({
  name:   z.string().min(2, 'Name required'),
  mobile: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid mobile'),
  gender: z.string().optional(),
  cityId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { mutate: update, isPending } = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', mobile: user?.mobile ?? '', gender: user?.gender ?? '', cityId: user?.cityId ?? '' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, mobile: user.mobile, gender: user.gender ?? '', cityId: user.cityId ?? '' });
  }, [user, reset]);

  function onSubmit(data: FormValues) {
    update(data, { onSuccess: () => toast('Profile updated!', 'success') });
  }

  return (
    <PublicLayout>
      <div className="max-w-[560px] mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-white font-display font-bold text-2xl">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <h1 className="font-display font-semibold text-2xl tracking-tight">{user?.name}</h1>
            <p className="text-text-muted text-sm font-sans">{user?.email}</p>
          </div>
        </div>

        <div className="p-7 rounded-2xl bg-bg-surface border border-border-default">
          <h2 className="font-semibold text-lg mb-5 font-sans">Edit Profile</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-sans">Email</label>
              <div className="px-3.5 py-3 rounded-md bg-bg-surface2 border border-border-default text-text-muted text-sm font-sans">
                {user?.email} <span className="text-[10px] bg-accent-indigo/12 text-[#A5B4FC] px-1.5 py-0.5 rounded-full ml-2">Cannot change</span>
              </div>
            </div>

            <Input label="Full Name" error={errors.name?.message} {...register('name')} />
            <Input label="Mobile Number" error={errors.mobile?.message} {...register('mobile')} />

            {/* Gender */}
            <div>
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-sans">Gender</label>
              <select
                {...register('gender')}
                className="w-full px-3.5 py-3 rounded-md bg-bg-surface border border-border-default text-text-primary text-sm font-sans outline-none focus:border-accent-indigo"
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-sans">City</label>
              <select
                {...register('cityId')}
                className="w-full px-3.5 py-3 rounded-md bg-bg-surface border border-border-default text-text-primary text-sm font-sans outline-none focus:border-accent-indigo"
              >
                <option value="">Select city</option>
                {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            <Button type="submit" fullWidth size="lg" loading={isPending} className="mt-2">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change password card */}
        <div className="p-5 rounded-xl bg-bg-surface border border-border-default mt-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-text-primary font-sans">Password</p>
            <p className="text-xs text-text-muted font-sans mt-0.5">Last changed: never</p>
          </div>
          <button className="px-4 py-2 rounded-full bg-bg-surface2 border border-border-default text-sm text-text-secondary hover:text-text-primary transition-colors font-sans">
            Change Password
          </button>
        </div>

        {/* Danger zone */}
        <div className="p-5 rounded-xl bg-semantic-error/05 border border-semantic-error/20 mt-4">
          <p className="font-semibold text-sm text-semantic-error font-sans mb-1">Danger Zone</p>
          <p className="text-xs text-text-muted font-sans mb-3">Deleting your account is permanent and cannot be undone.</p>
          <button className="text-xs text-semantic-error underline font-sans">Delete my account</button>
        </div>
      </div>
    </PublicLayout>
  );
}
