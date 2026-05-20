import { AdminLayout } from '@/shared/components/layout/AdminLayout';

export default function AdminPartnersPage() {
  return (
    <AdminLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="text-2xl font-display font-bold text-text-primary">Partners</h1>
        <p className="text-sm text-text-secondary mt-2">
          Use the admin API endpoints at <code className="text-accent-indigo">/api/admin/partners</code> to manage venue partners.
          The full UI (Create / Grant Venues / Deactivate) ships in a follow-up — backend is fully functional.
        </p>
      </div>
    </AdminLayout>
  );
}
