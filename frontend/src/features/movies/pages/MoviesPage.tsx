import { useState } from 'react';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { MovieCard } from '../components/MovieCard';
import { Chip } from '@/shared/components/ui/Chip';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useMovies } from '../api/useMovies';
import { LANGUAGES, GENRES, FORMATS } from '@/shared/constants';

const CATEGORIES = ['Now Showing', 'Coming Soon', 'Exclusive', 'Premieres'] as const;
const CATEGORY_MAP: Record<string, string> = {
  'Now Showing': 'NowShowing', 'Coming Soon': 'ComingSoon',
  'Exclusive': 'Exclusive', 'Premieres': 'Premiere',
};
const SORTS = ['Popularity', 'Rating', 'Release Date', 'A–Z'] as const;
const SORT_MAP: Record<string, string> = {
  'Popularity': '', 'Rating': 'rating', 'Release Date': 'release', 'A–Z': 'az',
};

export default function MoviesPage() {
  const [lang, setLang]     = useState('');
  const [genre, setGenre]   = useState('');
  const [format, setFormat] = useState('');
  const [category, setCategory] = useState('Now Showing');
  const [sort, setSort]     = useState('Popularity');
  const [page, setPage]     = useState(1);

  const { data, isLoading } = useMovies({
    language: lang || undefined,
    genre:    genre || undefined,
    format:   format || undefined,
    category: CATEGORY_MAP[category],
    sort:     SORT_MAP[sort] || undefined,
    page,
    pageSize: 20,
  });

  const movies     = data?.items ?? [];
  const total      = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);
  const coming     = category === 'Coming Soon';

  const activeFilters = [
    lang   && { label: lang,   clear: () => setLang('') },
    genre  && { label: genre,  clear: () => setGenre('') },
    format && { label: format, clear: () => setFormat('') },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  function clearAll() { setLang(''); setGenre(''); setFormat(''); setPage(1); }

  return (
    <PublicLayout>
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-bg-base/95 backdrop-blur-md border-b border-border-default">
        <div className="max-w-[1280px] mx-auto px-6 py-3 space-y-2">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onToggle={() => { setCategory(c); setPage(1); }}>{c}</Chip>
            ))}
          </div>
          {(['Language', 'Genre', 'Format'] as const).map((type, ti) => {
            const opts  = [LANGUAGES, GENRES, FORMATS][ti] as readonly string[];
            const value = [lang, genre, format][ti];
            const set   = [setLang, setGenre, setFormat][ti];
            return (
              <div key={type} className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-text-muted tracking-wider uppercase w-16 shrink-0 font-sans">{type}</span>
                {opts.map((o) => (
                  <Chip key={o} active={value === o} onToggle={() => { set(value === o ? '' : o); setPage(1); }}>{o}</Chip>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-text-muted tracking-widest uppercase font-sans mb-1">Movies · Ahmedabad</p>
          <h1 className="font-display font-semibold text-3xl md:text-4xl tracking-tight">What's on this week</h1>
          <p className="text-text-secondary text-sm mt-2 font-sans">{isLoading ? 'Loading…' : `${total} films`}</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {activeFilters.map((f) => (
              <button key={f.label} onClick={f.clear}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-sans bg-accent-purple/14 text-[#C4A0FF] border border-accent-purple/28 hover:bg-accent-purple/22 transition-colors">
                {f.label} ✕
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="text-xs text-text-muted underline font-sans">Clear all</button>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface border border-border-default text-sm font-sans">
            <span className="text-text-muted">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-text-primary outline-none cursor-pointer">
              {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] rounded-lg" />
                <Skeleton width="80%" height={14} />
                <Skeleton width="55%" height={11} />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🎬</span>
            <h3 className="font-display text-xl text-text-secondary mb-2">No movies match your filters</h3>
            <p className="text-text-muted text-sm font-sans mb-6">Try removing some filters to see more results.</p>
            <button onClick={clearAll}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold font-sans">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map((m) => <MovieCard key={m.id} movie={m} coming={coming} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {['←', ...Array.from({ length: Math.min(totalPages, 7) }, (_, i) => String(i + 1)), '→'].map((p, idx) => {
              const isNum = !isNaN(Number(p));
              const isActive = isNum && Number(p) === page;
              const isDisabled = (p === '←' && page === 1) || (p === '→' && page === totalPages);
              return (
                <button key={idx} disabled={isDisabled}
                  onClick={() => {
                    if (p === '←') setPage((v) => v - 1);
                    else if (p === '→') setPage((v) => v + 1);
                    else setPage(Number(p));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-md text-sm font-sans transition-colors ${
                    isActive ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white'
                    : isDisabled ? 'text-text-muted cursor-default bg-bg-surface'
                    : 'bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default'}`}>
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
