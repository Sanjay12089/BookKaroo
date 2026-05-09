import { useState } from 'react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';
import { toast } from '@/shared/components/ui/Toast';

export default function AdminDashboardPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  async function handleSyncTmdb() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const { data } = await api.post<{ updated: number; message: string }>('/api/admin/sync-tmdb');
      setSyncResult(data.message);
      toast(data.message, 'success');
    } catch {
      const msg = 'Sync failed — check TMDB_BEARER in launchSettings.json';
      setSyncResult(msg);
      toast(msg, 'error');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        <h1 className="font-display font-bold text-3xl mb-2 tracking-tight">Admin Dashboard</h1>
        <p className="text-text-muted text-sm font-sans mb-8">Manage BookKaroo content and settings.</p>

        {/* TMDB Sync Card */}
        <div className="p-6 rounded-xl bg-bg-surface border border-border-default mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-2xl flex-shrink-0">
              🎬
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">Sync Movie Posters from TMDB</h3>
              <p className="text-sm text-text-muted font-sans mb-3">
                Fetches correct poster images, backdrops, and trailer URLs from The Movie Database API for all seeded movies.
                Requires a real <code className="font-mono text-accent-indigo">TMDB_BEARER</code> token in <code className="font-mono text-accent-indigo">launchSettings.json</code>.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleSyncTmdb}
                  disabled={syncing}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold font-sans disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
                >
                  {syncing ? '⏳ Syncing…' : '🔄 Sync TMDB Posters'}
                </button>
                {syncResult && (
                  <span className="text-sm font-sans text-semantic-success">{syncResult}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-5 rounded-xl bg-accent-indigo/08 border border-accent-indigo/20 font-sans text-sm">
          <p className="font-semibold text-text-primary mb-2">📋 Setup Instructions for TMDB Posters</p>
          <ol className="space-y-1 text-text-secondary list-decimal ml-4">
            <li>Go to <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-accent-indigo underline">tmdb.org/settings/api</a> and create a free account</li>
            <li>Copy your <strong>API Read Access Token (Bearer)</strong></li>
            <li>In <code className="font-mono bg-bg-surface3 px-1 rounded">backend/src/BookKaroo.Api/Properties/launchSettings.json</code>, set <code className="font-mono bg-bg-surface3 px-1 rounded">TMDB_BEARER</code> to your real token</li>
            <li>Restart the API (<code className="font-mono bg-bg-surface3 px-1 rounded">dotnet run</code>)</li>
            <li>Click "Sync TMDB Posters" above — it will update all 11 movies automatically</li>
          </ol>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎬', label: 'Movies', count: '11', href: '/admin/movies' },
            { icon: '🎟', label: 'Bookings', count: '0', href: '/admin/bookings' },
            { icon: '👥', label: 'Users', count: '0', href: '/admin/users' },
            { icon: '📍', label: 'Venues', count: '3', href: '/admin/venues' },
          ].map((card) => (
            <a key={card.label} href={card.href}
              className="p-5 rounded-xl bg-bg-surface border border-border-default hover:border-border-strong transition-colors text-center">
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="font-display font-semibold text-2xl text-text-primary">{card.count}</div>
              <div className="text-xs text-text-muted font-sans mt-1 uppercase tracking-wider">{card.label}</div>
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
