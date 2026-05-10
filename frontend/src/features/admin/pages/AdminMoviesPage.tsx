import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';
import { TMDB_POSTER } from '@/shared/constants';
import type { Movie, PaginatedResponse, MovieStatus, MovieCategory } from '@/shared/types';

const PAGE_SIZE = 10;

const STATUS_BADGE: Record<MovieStatus, string> = {
  Published: 'bg-semantic-success/15 text-semantic-success',
  Draft: 'bg-accent-indigo/12 text-[#A5B4FC]',
  Archived: 'bg-bg-surface3 text-text-muted',
};

const CATEGORY_BADGE: Record<MovieCategory, string> = {
  NowShowing: 'bg-accent-crimson/12 text-accent-crimson',
  ComingSoon: 'bg-accent-indigo/12 text-[#A5B4FC]',
  Exclusive: 'bg-accent-purple/12 text-accent-purple',
  Premiere: 'bg-bg-surface3 text-text-muted',
};

const CATEGORY_LABEL: Record<MovieCategory, string> = {
  NowShowing: 'Now Showing',
  ComingSoon: 'Coming Soon',
  Exclusive: 'Exclusive',
  Premiere: 'Premiere',
};

export default function AdminMoviesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'movies', page],
    queryFn: () =>
      api.get<PaginatedResponse<Movie>>(`/api/movies?page=${page}&pageSize=${PAGE_SIZE}`).then((r) => r.data),
    retry: false,
  });

  const movies = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Movies</h1>
            <p className="text-text-muted text-sm font-sans">
              {total > 0 ? `${total} movies in the catalogue` : 'Manage your movie catalogue'}
            </p>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            + Add Movie
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-64 text-text-muted text-sm font-sans">
            Loading movies…
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex items-center justify-center h-64 text-semantic-error text-sm font-sans">
            Failed to load movies. Please try again.
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full text-sm font-sans">
                <thead className="bg-bg-surface2 border-b border-border-default">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Poster</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Languages</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-text-muted font-sans">
                        No movies found.
                      </td>
                    </tr>
                  )}
                  {movies.map((movie) => (
                    <tr key={movie.id} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                      <td className="px-4 py-3">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl.startsWith('/') ? TMDB_POSTER(movie.posterUrl, 'w92') : movie.posterUrl}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-bg-surface3 rounded flex items-center justify-center text-text-muted text-xs">
                            ?
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-text-primary">{movie.title}</span>
                        {movie.certificate && (
                          <span className="ml-2 text-[10px] text-text-muted border border-border-default rounded px-1">
                            {movie.certificate}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_BADGE[movie.status]}`}>
                          {movie.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${CATEGORY_BADGE[movie.category]}`}>
                          {CATEGORY_LABEL[movie.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{movie.languages.join(', ') || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{movie.durationMin} min</td>
                      <td className="px-4 py-3 text-text-secondary">{movie.imdbRating ?? '—'}</td>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm font-sans">
                <span className="text-text-muted">
                  Page {page} of {totalPages} &bull; {total} total
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 rounded-lg border border-border-default text-text-secondary hover:bg-bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border-default text-text-secondary hover:bg-bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
