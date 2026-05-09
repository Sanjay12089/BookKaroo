import { PublicLayout } from '@/shared/components/layout/PublicLayout';
export default function ShowtimesPage() {
  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🚧</p>
          <p className="text-text-muted text-lg font-sans">Showtimes — Coming in next sprint</p>
        </div>
      </div>
    </PublicLayout>
  );
}
