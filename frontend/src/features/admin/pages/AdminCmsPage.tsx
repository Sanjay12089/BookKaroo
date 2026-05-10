import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';

interface CmsBanner {
  id: string;
  title: string;
  page: string;
  type: string;
  isActive: boolean;
  order: number;
  imageUrl?: string;
}

type ApiError = { response?: { status?: number }; statusCode?: number };

export default function AdminCmsPage() {
  const [localBanners, setLocalBanners] = useState<CmsBanner[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'cms', 'banners'],
    queryFn: () =>
      api.get<CmsBanner[]>('/api/admin/cms/banners').then((r) => r.data),
    retry: false,
  });

  const is501 =
    (error as ApiError | null)?.response?.status === 501 ||
    (error as ApiError | null)?.statusCode === 501;

  const apiBanners: CmsBanner[] = Array.isArray(data) ? data : [];
  const banners: CmsBanner[] = [...apiBanners, ...localBanners];

  const showEmpty = is501 && localBanners.length === 0;
  const showError = !isLoading && !!error && !is501 && localBanners.length === 0;

  function handleToggle(id: string) {
    setLocalBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">CMS — Banners</h1>
            <p className="text-text-muted text-sm font-sans">Manage homepage and page-level promotional banners.</p>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            + Add Banner
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64 text-text-muted text-sm font-sans">
            Loading banners…
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-4xl">🖼</p>
            <p className="text-text-secondary font-sans text-base">No banners yet. Add your first banner.</p>
            <button
              disabled
              className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              + Add Banner
            </button>
          </div>
        )}

        {showError && (
          <div className="flex items-center justify-center h-64 text-semantic-error text-sm font-sans">
            Failed to load banners. Please try again.
          </div>
        )}

        {!isLoading && !showEmpty && !showError && (
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full text-sm font-sans">
              <thead className="bg-bg-surface2 border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Page</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Active</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-text-muted font-sans">
                      No banners found.
                    </td>
                  </tr>
                )}
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{banner.title}</td>
                    <td className="px-4 py-3 text-text-secondary">{banner.page}</td>
                    <td className="px-4 py-3 text-text-secondary">{banner.type}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(banner.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          banner.isActive ? 'bg-semantic-success' : 'bg-bg-surface3'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            banner.isActive ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{banner.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button disabled className="text-xs text-accent-indigo opacity-40 cursor-not-allowed font-semibold">Edit</button>
                        <button disabled className="text-xs text-semantic-error opacity-40 cursor-not-allowed font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
