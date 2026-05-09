import { AdminLayout } from '@/shared/components/layout/AdminLayout';
export default function AdminEventsPage() {
  return (
    <AdminLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🚧</p>
          <p className="text-text-muted text-lg font-sans">Events — Coming in next sprint</p>
        </div>
      </div>
    </AdminLayout>
  );
}
