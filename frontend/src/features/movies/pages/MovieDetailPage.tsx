import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bell, X, Star, ThumbsUp, ThumbsDown, BadgeCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useMovieDetail, useMovieReviews, useCreateReview, useRemindMe } from '../api/useMovies';
import { usePassedViewport } from '@/shared/hooks/useScrollPosition';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ROUTES, TMDB_BACKDROP, TMDB_POSTER, TMDB_IMAGE_BASE } from '@/shared/constants';
import { formatDuration, cn } from '@/shared/lib/utils';
import type { MovieDetail, Review } from '../types';

type Tab = 'about' | 'cast' | 'reviews';

export default function MovieDetailPage() {
  const { slug = '' } = useParams();
  const { data: movie, isLoading } = useMovieDetail(slug);
  const heroCTARef    = useRef<HTMLDivElement>(null);
  const stickyVisible = usePassedViewport(heroCTARef);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeTab, setActiveTab]     = useState<Tab>('about');

  if (isLoading) return (
    <PublicLayout>
      <Skeleton className="h-[440px] w-full rounded-none" />
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-4">
        <Skeleton height={48} width="50%" />
        <Skeleton height={24} width="30%" />
      </div>
    </PublicLayout>
  );

  if (!movie) return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[60vh] text-text-muted font-sans">Movie not found.</div>
    </PublicLayout>
  );

  const backdropUrl   = movie.backdropUrl ? TMDB_BACKDROP(movie.backdropUrl) : null;
  const posterUrl     = movie.posterUrl   ? TMDB_POSTER(movie.posterUrl)     : null;
  const isComingSoon  = movie.category === 'ComingSoon';
  const showtimesHref = ROUTES.SHOWTIMES(movie.slug);

  return (
    <PublicLayout>
      <Helmet><title>{movie.title} | BookKaroo</title></Helmet>
      {/* ── HERO BACKDROP ──────────────────────────────────────────────── */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {backdropUrl && (
          <div className="absolute inset-0 bg-cover bg-center scale-105"
               style={{ backgroundImage: `url(${backdropUrl})`, filter: 'blur(2px) brightness(0.28)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(65%_55%_at_60%_25%,rgba(168,85,247,0.22),transparent)]" />
      </div>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-28">
        {/* ── DETAIL SHELL ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 -mt-40 md:-mt-48 relative z-10">
          {/* Poster */}
          <div className="flex justify-center md:block">
            <div className="w-32 md:w-full aspect-[2/3] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.65)] border border-white/10 bg-bg-surface2">
              {posterUrl
                ? <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-text-muted text-4xl">🎬</div>}
            </div>
          </div>

          {/* Metadata */}
          <section className="pt-0 md:pt-10">
            <p className="text-[11px] font-semibold text-text-muted tracking-widest uppercase font-sans mb-2">
              {isComingSoon ? 'Coming Soon' : 'Now Showing'}
              {movie.certificate && ` · ${movie.certificate}`}
              {` · ${formatDuration(movie.durationMin)}`}
            </p>

            <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-[1.08] mb-4">
              {movie.title}
            </h1>

            {/* Ratings row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-sans">
              {movie.averageRating > 0 && (
                <span className="flex items-center gap-1 font-semibold text-[#FCD34D]">
                  <Star size={14} fill="currentColor" /> {movie.averageRating.toFixed(1)}
                  <span className="text-text-muted font-normal text-xs">/10 · {movie.totalReviews} reviews</span>
                </span>
              )}
              {movie.imdbRating && (
                <span className="text-text-muted text-xs">IMDb {movie.imdbRating}</span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.slice(0, 3).map((g) => <Badge key={g}>{g}</Badge>)}
              {movie.formats?.slice(0, 3).map((f) => <Badge key={f} color="indigo">{f}</Badge>)}
              {movie.languages?.slice(0, 2).map((l) => <Badge key={l}>{l}</Badge>)}
            </div>

            {movie.description && (
              <p className="text-text-secondary text-sm leading-relaxed max-w-xl mb-6 font-sans line-clamp-3">
                {movie.description}
              </p>
            )}

            {/* CTAs */}
            <div ref={heroCTARef} className="flex gap-3 flex-wrap">
              {isComingSoon ? (
                <RemindMeButton movieId={movie.id} />
              ) : (
                <Link to={showtimesHref}><Button size="lg">🎟 Book Tickets</Button></Link>
              )}
              {movie.trailerUrl && (
                <Button size="lg" variant="ghost" onClick={() => setTrailerOpen(true)}>▶ Watch Trailer</Button>
              )}
            </div>
          </section>
        </div>

        {/* ── TABS ─────────────────────────────────────────────────────── */}
        <div className="mt-14 border-b border-border-default">
          <div className="flex gap-1">
            {(['about', 'cast', 'reviews'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  'px-5 py-3 text-sm font-semibold font-sans capitalize border-b-2 -mb-px transition-colors',
                  activeTab === t
                    ? 'border-accent-crimson text-text-primary'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                )}
              >
                {t === 'reviews' ? `Reviews (${movie.totalReviews})` : t === 'cast' ? 'Cast & Crew' : 'About'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {activeTab === 'about'   && <AboutTab   movie={movie} onTrailer={() => setTrailerOpen(true)} />}
          {activeTab === 'cast'    && <CastTab    movie={movie} />}
          {activeTab === 'reviews' && <ReviewsTab movie={movie} />}
        </div>

        {/* ── RELATED ──────────────────────────────────────────────────── */}
        {movie.related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display font-semibold text-2xl mb-6">More like this</h2>
            <div className="grid grid-cols-3 gap-4">
              {movie.related.map((r) => (
                <Link key={r.id} to={ROUTES.MOVIE_DETAIL(r.slug)} className="group block">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-bg-surface2 mb-2">
                    {r.posterUrl
                      ? <img src={TMDB_POSTER(r.posterUrl)} alt={r.title}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      : <div className="flex items-center justify-center h-full text-2xl">🎬</div>}
                  </div>
                  <p className="text-sm font-semibold text-text-primary line-clamp-1 font-display">{r.title}</p>
                  <p className="text-xs text-text-muted font-sans">{r.genres?.slice(0, 2).join(' · ')}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── STICKY BAR ───────────────────────────────────────────────────── */}
      {stickyVisible && !isComingSoon && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-3
          bg-bg-surface/95 backdrop-blur-xl border-t border-border-default shadow-lg mb-[56px] md:mb-0">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text-primary text-sm truncate font-sans">{movie.title}</p>
            <p className="text-xs text-text-muted font-sans">from ₹180</p>
          </div>
          <Link to={showtimesHref}><Button size="md">Pick a showtime →</Button></Link>
        </div>
      )}

      {/* ── TRAILER MODAL ────────────────────────────────────────────────── */}
      {trailerOpen && movie.trailerUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
             onClick={() => setTrailerOpen(false)}>
          <div className="w-full max-w-3xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setTrailerOpen(false)}
                    className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1 text-sm font-sans">
              <X size={18} /> Close
            </button>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={(() => {
                  const match = movie.trailerUrl!.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : movie.trailerUrl!;
                })()}
                className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen
                title={`${movie.title} — Trailer`}
              />
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

// ─── About Tab ────────────────────────────────────────────────────────────────
function AboutTab({ movie, onTrailer }: { movie: MovieDetail; onTrailer: () => void }) {
  return (
    <div className="space-y-8 max-w-3xl">
      {movie.trailerUrl && (
        <div>
          <h3 className="font-display font-semibold text-xl mb-4">Trailer</h3>
          <button onClick={onTrailer}
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-bg-surface2 border border-border-default group">
            {movie.backdropUrl && (
              <img src={`${TMDB_IMAGE_BASE}/w780${movie.backdropUrl}`} alt="Trailer thumbnail"
                   className="w-full h-full object-cover brightness-50 group-hover:brightness-40 transition-all" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {movie.description && (
        <div>
          <h3 className="font-display font-semibold text-xl mb-3">Synopsis</h3>
          <p className="text-text-secondary leading-relaxed font-sans">{movie.description}</p>
        </div>
      )}

      <div>
        <h3 className="font-display font-semibold text-xl mb-4">Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-xl bg-bg-surface border border-border-default">
          {[
            { label: 'Duration',    value: formatDuration(movie.durationMin) },
            { label: 'Released',    value: movie.releaseDate ?? '—' },
            { label: 'Certificate', value: movie.certificate ?? '—' },
            { label: 'Language',    value: movie.languages?.[0] ?? '—' },
            { label: 'Formats',     value: movie.formats?.join(', ') || '—' },
            { label: 'Genre',       value: movie.genres?.slice(0, 2).join(', ') || '—' },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[10px] font-semibold text-text-muted tracking-wider uppercase font-sans">{f.label}</p>
              <p className="text-sm font-semibold text-text-primary mt-1 font-sans">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cast & Crew Tab ──────────────────────────────────────────────────────────
function CastTab({ movie }: { movie: MovieDetail }) {
  return (
    <div className="space-y-10">
      {movie.cast.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-xl mb-5">Cast</h3>
          <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none">
            {movie.cast.map((m, i) => (
              <div key={i} className="flex-shrink-0 w-20 text-center">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-accent-indigo to-accent-purple mb-2 flex items-center justify-center">
                  {m.photo
                    ? <img
                        src={m.photo.startsWith('http') ? m.photo : `${TMDB_IMAGE_BASE}/w185${m.photo}`}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    : <span className="text-white font-bold text-xl">{m.name.charAt(0)}</span>}
                </div>
                <p className="text-xs font-semibold text-text-primary font-sans line-clamp-1">{m.name}</p>
                <p className="text-[11px] text-text-muted font-sans line-clamp-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {movie.crew.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-xl mb-4">Crew</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {movie.crew.map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-surface border border-border-default">
                <p className="text-sm font-semibold text-text-primary font-sans">{m.name}</p>
                <p className="text-xs text-text-muted font-sans mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {movie.cast.length === 0 && movie.crew.length === 0 && (
        <p className="text-text-muted font-sans text-sm">Cast & crew info not available yet.</p>
      )}
    </div>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────
function ReviewsTab({ movie }: { movie: MovieDetail }) {
  const { isAuthenticated } = useAuthStore();
  const [sort, setSort]   = useState('recent');
  const [page, setPage]   = useState(1);
  const { data: reviewsData, isLoading } = useMovieReviews(movie.id, sort, page);
  const { mutate: createReview, isPending: isSubmitting } = useCreateReview(movie.id, movie.slug);

  const [rating, setRating]     = useState(0);
  const [title, setTitle]       = useState('');
  const [body, setBody]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (rating === 0) return;
    createReview(
      { rating, title: title || undefined, body: body || undefined },
      { onSuccess: () => { setSubmitted(true); setRating(0); setTitle(''); setBody(''); } }
    );
  }

  const maxCount = Math.max(1, ...Object.values(movie.ratingDistribution));

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Rating distribution card */}
      <div className="flex gap-8 p-6 rounded-xl bg-bg-surface border border-border-default items-center">
        <div className="text-center flex-shrink-0">
          <p className="text-[60px] font-black leading-none text-[#FCD34D] font-display">
            {movie.averageRating > 0 ? movie.averageRating.toFixed(1) : '—'}
          </p>
          <p className="text-xs text-text-muted font-sans">/10 · {movie.totalReviews} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {Array.from({ length: 10 }, (_, i) => 10 - i).map((r) => {
            const count = movie.ratingDistribution[r] ?? 0;
            return (
              <div key={r} className="flex items-center gap-2 text-xs font-sans">
                <span className="w-4 text-right text-text-muted">{r}</span>
                <div className="flex-1 h-1.5 rounded-full bg-border-default overflow-hidden">
                  <div className="h-full rounded-full bg-[#FCD34D] transition-all"
                       style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
                <span className="w-4 text-text-muted">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review */}
      {!isAuthenticated ? (
        <div className="p-5 rounded-xl bg-bg-surface border border-border-default text-center">
          <p className="text-text-muted text-sm font-sans mb-3">Sign in to write a review</p>
          <Link to={ROUTES.LOGIN}><Button size="sm" variant="ghost">Sign In</Button></Link>
        </div>
      ) : movie.canReview && !submitted ? (
        <div className="p-6 rounded-xl bg-bg-surface border border-border-default space-y-4">
          <h3 className="font-semibold text-text-primary font-sans">Rate this movie</h3>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setRating(n)}
                className={cn(
                  'w-9 h-9 rounded-md text-sm font-bold font-sans border transition-all',
                  n <= rating
                    ? rating >= 8 ? 'bg-green-500 border-green-500 text-white'
                      : rating >= 5 ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-red-500 border-red-500 text-white'
                    : 'border-border-default text-text-muted hover:border-border-strong'
                )}>{n}</button>
            ))}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title (optional)"
            className="w-full px-3.5 py-2.5 rounded-md bg-bg-base border border-border-default text-sm font-sans text-text-primary placeholder:text-text-muted outline-none focus:border-accent-indigo" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts… (optional)" rows={4}
            className="w-full px-3.5 py-2.5 rounded-md bg-bg-base border border-border-default text-sm font-sans text-text-primary placeholder:text-text-muted outline-none focus:border-accent-indigo resize-none" />
          <Button onClick={handleSubmit} loading={isSubmitting} disabled={rating === 0}>Submit Review</Button>
        </div>
      ) : isAuthenticated && !movie.canReview && (
        <p className="text-text-muted text-sm font-sans p-5 bg-bg-surface border border-border-default rounded-xl text-center">
          {movie.category === 'ComingSoon' ? 'Reviews open after release.' : 'Book this movie to write a verified review.'}
        </p>
      )}

      {/* Sort bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {[{ label: 'Most Recent', value: 'recent' }, { label: 'Most Helpful', value: 'helpful' },
          { label: 'Highest', value: 'highest' }, { label: 'Lowest', value: 'lowest' }].map((s) => (
          <button key={s.value} onClick={() => { setSort(s.value); setPage(1); }}
            className={cn('px-3 py-1.5 rounded-full text-xs font-semibold font-sans border transition-colors',
              sort === s.value ? 'bg-accent-indigo/15 border-accent-indigo text-accent-indigo'
                              : 'border-border-default text-text-muted hover:text-text-primary')}>
            {s.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-xl bg-bg-surface border border-border-default space-y-2">
              <Skeleton height={16} width="30%" /><Skeleton height={14} width="80%" />
            </div>
          ))}
        </div>
      ) : !reviewsData?.items?.length ? (
        <p className="text-text-muted font-sans text-sm text-center py-8">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviewsData.items.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      )}

      {/* Pagination */}
      {(reviewsData?.totalPages ?? 0) > 1 && (
        <div className="flex gap-2 justify-center">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-bg-surface border border-border-default text-sm font-sans disabled:opacity-40">← Prev</button>
          <span className="px-4 py-2 text-sm font-sans text-text-muted">{page} / {reviewsData?.totalPages}</span>
          <button disabled={page === reviewsData?.totalPages} onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-bg-surface border border-border-default text-sm font-sans disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const ratingColor = review.rating >= 8 ? 'text-green-400' : review.rating >= 5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="p-5 rounded-xl bg-bg-surface border border-border-default space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {review.userAvatarInitial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text-primary font-sans">{review.userName}</p>
              {review.isVerifiedBooking && (
                <span className="flex items-center gap-0.5 text-[11px] text-green-400 font-sans">
                  <BadgeCheck size={13} /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted font-sans">
              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <span className={cn('text-sm font-bold font-sans flex items-center gap-1', ratingColor)}>
          <Star size={13} fill="currentColor" /> {review.rating}/10
        </span>
      </div>
      {review.title && <p className="font-semibold text-sm text-text-primary font-sans">{review.title}</p>}
      {review.body  && <p className="text-sm text-text-secondary leading-relaxed font-sans">{review.body}</p>}
      <div className="flex items-center gap-4 text-xs text-text-muted font-sans">
        <button className="flex items-center gap-1 hover:text-text-secondary"><ThumbsUp size={13} /> {review.thumbsUp}</button>
        <button className="flex items-center gap-1 hover:text-text-secondary"><ThumbsDown size={13} /> {review.thumbsDown}</button>
      </div>
    </div>
  );
}

function RemindMeButton({ movieId }: { movieId: string }) {
  const { mutate: remindMe, isPending } = useRemindMe(movieId);
  return (
    <Button size="lg" variant="secondary" loading={isPending} onClick={() => remindMe()}>
      <Bell size={18} /> Remind Me
    </Button>
  );
}
