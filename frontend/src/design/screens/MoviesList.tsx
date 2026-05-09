import { useState, useMemo } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Chip, Skeleton } from '../DesignSystem';
import { MOVIES, COMING_SOON } from './mockData';

const TMDB = 'https://image.tmdb.org/t/p/w300';

const LANGUAGES = ['Hindi', 'English', 'Kannada', 'Telugu', 'Tamil', 'Marathi', 'Punjabi', 'Bengali', 'Malayalam', 'Gujarati'];
const GENRES = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Sci-Fi', 'Animation', 'Horror'];
const FORMATS = ['2D', '3D', 'IMAX', '4DX', 'Dolby', 'EPIQ'];
const CATEGORIES = ['Now Showing', 'Coming Soon', 'Exclusive', 'Premieres'] as const;
type Category = typeof CATEGORIES[number];
const SORTS = ['Popularity', 'Rating', 'Release Date', 'A–Z'] as const;
type Sort = typeof SORTS[number];

interface ActiveFilter {
  type: string;
  value: string;
}

// ─── Filter Chip Row ──────────────────────────────────────────────────────────

interface FilterRowProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}

function FilterRow({ label, options, selected, onToggle }: FilterRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.colors.text.muted, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {options.map((opt) => (
        <Chip key={opt} active={selected.includes(opt)} onToggle={() => onToggle(opt)}>
          {opt}
        </Chip>
      ))}
    </div>
  );
}

// ─── Movie Card ───────────────────────────────────────────────────────────────

function MovieCard({ movie }: { movie: typeof MOVIES[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a href={`/movies/${movie.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          position: 'relative', aspectRatio: '2/3',
          borderRadius: T.radius.lg, overflow: 'hidden',
          background: T.gradients.posterCard,
          border: `1px solid ${hovered ? T.colors.border.strong : T.colors.border.default}`,
          transition: `all ${T.motion.duration.base}`,
          transform: hovered ? 'translateY(-3px) scale(1.02)' : 'none',
          boxShadow: hovered ? `${T.shadows.md}, ${T.shadows.glowCrimson}` : T.shadows.sm,
          isolation: 'isolate',
        }}>
          <img
            src={`${TMDB}${movie.posterPath}`}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Format badge */}
          <div style={{
            position: 'absolute', top: 8, left: 8,
            padding: '3px 8px', borderRadius: T.radius.full,
            background: 'rgba(99,102,241,0.85)', backdropFilter: 'blur(8px)',
            fontSize: 11, fontWeight: 600, color: T.colors.tint.white, fontFamily: T.fonts.body,
          }}>
            {movie.formats[0]}
          </div>

          {/* Rating */}
          <div style={{
            position: 'absolute', top: 8, right: 8,
            padding: '3px 8px', borderRadius: T.radius.full,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            fontSize: 12, fontWeight: 600, color: T.colors.tint.warningText, fontFamily: T.fonts.body,
          }}>
            ⭐ {movie.rating}
          </div>

          {/* Hover CTA */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.3) 50%, transparent 100%)',
            opacity: hovered ? 1 : 0,
            transition: `opacity ${T.motion.duration.base}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 12,
          }}>
            <button style={{
              width: '100%', padding: '8px 0', borderRadius: T.radius.full,
              background: `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`,
              color: T.colors.tint.white, border: 'none', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: T.fonts.body,
            }}>
              Book Now
            </button>
          </div>
        </div>

        <div>
          <h3 style={{
            margin: 0, fontSize: 14, fontWeight: 600,
            color: T.colors.text.primary, fontFamily: T.fonts.display,
          }}>
            {movie.title}
          </h3>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 4,
            fontSize: 12, color: T.colors.text.muted,
          }}>
            {movie.genres.slice(0, 2).join(' · ')}
            <span style={{ color: T.colors.border.strong }}>·</span>
            {movie.certificate}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {movie.languages.slice(0, 3).map((l) => (
              <span key={l} style={{
                padding: '2px 6px', borderRadius: T.radius.sm,
                background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
                fontSize: 10, color: T.colors.text.secondary, fontFamily: T.fonts.body,
              }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '80px 0', color: T.colors.text.muted, textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
      <h3 style={{ margin: '0 0 8px', fontSize: 20, fontFamily: T.fonts.display, color: T.colors.text.secondary }}>
        No movies match your filters
      </h3>
      <p style={{ margin: '0 0 24px', fontSize: 14 }}>
        Try removing some filters to see more results.
      </p>
      <button
        onClick={onClear}
        style={{
          padding: '10px 24px', borderRadius: T.radius.full,
          background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
          color: T.colors.tint.white, border: 'none', fontWeight: 600, fontSize: 14,
          cursor: 'pointer', fontFamily: T.fonts.body,
        }}
      >
        Clear all filters
      </button>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  const visible = Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '32px 0' }}>
      {['‹', ...visible.map(String), '›'].map((p, idx) => {
        const isNum = !isNaN(Number(p));
        const num = Number(p);
        const isActive = isNum && num === page;
        const isDisabled = (p === '‹' && page === 1) || (p === '›' && page === pages);
        return (
          <button
            key={idx}
            disabled={isDisabled}
            onClick={() => {
              if (p === '‹') onChange(page - 1);
              else if (p === '›') onChange(page + 1);
              else onChange(num);
            }}
            style={{
              width: 36, height: 36, borderRadius: T.radius.md,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: isActive ? 700 : 400, cursor: isDisabled ? 'default' : 'pointer',
              background: isActive
                ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`
                : T.colors.bg.surface,
              border: `1px solid ${isActive ? 'transparent' : T.colors.border.default}`,
              color: isActive ? T.colors.tint.white : isDisabled ? T.colors.text.muted : T.colors.text.secondary,
              fontFamily: T.fonts.body,
              opacity: isDisabled ? 0.4 : 1,
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

// ─── MoviesList ───────────────────────────────────────────────────────────────

export default function MoviesList() {
  const [category, setCategory] = useState<Category>('Now Showing');
  const [sort, setSort] = useState<Sort>('Popularity');
  const [langs, setLangs] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const PER_PAGE = 8;

  const allMovies = category === 'Coming Soon'
    ? COMING_SOON.map((m) => ({ ...m, rating: 0, reviewCount: '', duration: '', certificate: '', formats: [], director: '', cast: [], synopsis: '', fromPrice: 0, status: 'coming-soon' as const }))
    : MOVIES;

  const filtered = useMemo(() => {
    let list = [...allMovies] as typeof MOVIES;
    if (langs.length) list = list.filter((m) => m.languages.some((l) => langs.includes(l)));
    if (genres.length) list = list.filter((m) => m.genres.some((g) => genres.includes(g)));
    if (formats.length) list = list.filter((m) => m.formats.some((f) => formats.includes(f)));
    if (sort === 'Rating') list = list.sort((a, b) => b.rating - a.rating);
    if (sort === 'A–Z') list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [allMovies, langs, genres, formats, sort, category]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeFilters: ActiveFilter[] = [
    ...langs.map((v) => ({ type: 'Language', value: v })),
    ...genres.map((v) => ({ type: 'Genre', value: v })),
    ...formats.map((v) => ({ type: 'Format', value: v })),
  ];

  function removeFilter(f: ActiveFilter) {
    if (f.type === 'Language') setLangs((prev) => prev.filter((v) => v !== f.value));
    if (f.type === 'Genre') setGenres((prev) => prev.filter((v) => v !== f.value));
    if (f.type === 'Format') setFormats((prev) => prev.filter((v) => v !== f.value));
  }

  function clearAll() { setLangs([]); setGenres([]); setFormats([]); setPage(1); }

  function toggle(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    return (v: string) => {
      setter((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
      setPage(1);
    };
  }

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      {/* Sticky filter bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: `color-mix(in srgb, ${T.colors.bg.base} 92%, transparent)`,
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.colors.border.default}`,
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 0', display: 'grid', gap: 10 }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '4px', background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`, borderRadius: T.radius.full, width: 'fit-content' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                style={{
                  padding: '6px 16px', borderRadius: T.radius.full, fontSize: 13, fontWeight: 500,
                  background: category === cat ? T.colors.bg.surface3 : 'transparent',
                  color: category === cat ? T.colors.text.primary : T.colors.text.muted,
                  border: 'none', cursor: 'pointer', fontFamily: T.fonts.body,
                  boxShadow: category === cat ? T.shadows.sm : 'none',
                  transition: `all ${T.motion.duration.fast}`,
                }}>
                {cat}
              </button>
            ))}
          </div>

          <FilterRow label="Language" options={LANGUAGES} selected={langs} onToggle={toggle(setLangs)} />
          <FilterRow label="Genre" options={GENRES} selected={genres} onToggle={toggle(setGenres)} />
          <FilterRow label="Format" options={FORMATS} selected={formats} onToggle={toggle(setFormats)} />
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 80px' }}>
        {/* Page header */}
        <header style={{ marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 13, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Movies · Ahmedabad
          </p>
          <h1 style={{ fontFamily: T.fonts.display, fontSize: 'clamp(28px, 4vw, 48px)', margin: '4px 0 8px', fontWeight: 600, letterSpacing: '-0.02em' }}>
            What's on this week
          </h1>
          <p style={{ color: T.colors.text.secondary, margin: 0, fontSize: 14 }}>
            {filtered.length} films · 3 cinemas in Ahmedabad
          </p>
        </header>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: T.colors.text.secondary }}>
            <strong style={{ color: T.colors.text.primary }}>{filtered.length}</strong> films match
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: T.radius.full, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`, fontSize: 13 }}>
            <span style={{ color: T.colors.text.muted }}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              style={{ background: 'transparent', border: 0, color: T.colors.text.primary, fontFamily: T.fonts.body, fontSize: 13, cursor: 'pointer', outline: 'none' }}
            >
              {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {activeFilters.map((f) => (
              <button
                key={f.type + f.value}
                onClick={() => removeFilter(f)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: T.radius.full,
                  background: 'rgba(168,85,247,0.14)', color: T.colors.tint.purpleText,
                  border: '1px solid rgba(168,85,247,0.28)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: T.fonts.body,
                }}>
                {f.value} ✕
              </button>
            ))}
            <button onClick={clearAll} style={{ fontSize: 12, color: T.colors.text.muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: T.fonts.body }}>
              Clear all
            </button>
          </div>
        )}

        {/* Grid */}
        {paged.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px 20px' }}>
              {paged.map((m) => <MovieCard key={m.id} movie={m as typeof MOVIES[0]} />)}
            </div>
            <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
          </>
        )}

        {/* Skeleton loading demo row */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.colors.text.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            Loading state · skeleton
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px 20px' }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Skeleton height={0} style={{ aspectRatio: '2/3', height: 'auto', borderRadius: T.radius.lg }} />
                <Skeleton width="80%" height={14} />
                <Skeleton width="55%" height={11} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
