import { useState, useEffect, useRef } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Badge, StarRating } from '../DesignSystem';
import { MOVIES } from './mockData';

const TMDB = 'https://image.tmdb.org/t/p/w300';
const TMDB_BD = 'https://image.tmdb.org/t/p/w1280';

// Use the first movie as demo
const MOVIE = MOVIES[1]; // Chhaava

type Tab = 'about' | 'cast' | 'reviews' | 'photos';

// ─── Reviews mock ─────────────────────────────────────────────────────────────

const REVIEWS = [
  { id: 'r1', author: 'Priya M.', initials: 'PM', verified: true, date: '8 May 2026', rating: 9.5, title: 'A cinematic triumph', body: 'Vicky Kaushal is absolutely electrifying. The battle sequences are some of the finest ever put on an Indian screen. Watch it in IMAX — do not settle for less. Stay for the pre-intermission sequence, it\'s worth every rupee.', likes: 2841, dislikes: 124 },
  { id: 'r2', author: 'Rohit K.', initials: 'RK', verified: true, date: '7 May 2026', rating: 9.0, title: 'Sambhaji deserved this epic', body: 'Finally a historical that doesn\'t romanticise history — it shows the blood, the sacrifice, and the pride. Akshaye Khanna as Aurangzeb is terrifying. The poetry scenes gave me chills.', likes: 1620, dislikes: 89 },
  { id: 'r3', author: 'Sonia T.', initials: 'ST', verified: false, date: '9 May 2026', rating: 7.5, title: 'Good but too long', body: 'Strong performances all around but the second half drags a bit. The emotional core lands beautifully though, and Rashmika brings real depth to Yesubai.', likes: 942, dislikes: 201 },
  { id: 'r4', author: 'Aditya R.', initials: 'AR', verified: true, date: '6 May 2026', rating: 10, title: '🔥 National treasure', body: 'I\'ve watched it twice already. The scale is unmatched in Hindi cinema. Every frame is a painting. Laxman Utekar has outdone himself.', likes: 3102, dislikes: 67 },
];

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div style={{
      padding: 22, borderRadius: T.radius.lg,
      background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: T.radius.full, flexShrink: 0,
          background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: T.colors.tint.white, fontFamily: T.fonts.body,
        }}>
          {review.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: T.colors.text.primary }}>{review.author}</span>
            {review.verified && (
              <span style={{
                padding: '1px 8px', borderRadius: T.radius.full,
                background: 'rgba(16,185,129,0.12)', color: T.colors.semantic.success,
                border: `1px solid rgba(16,185,129,0.25)`, fontSize: 10, fontWeight: 600,
              }}>
                ✓ Verified Booking
              </span>
            )}
            <span style={{ fontSize: 12, color: T.colors.text.muted, marginLeft: 'auto' }}>{review.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <StarRating value={Math.round(review.rating / 2)} max={5} readOnly size={14} />
            <span style={{ fontFamily: T.fonts.mono, fontSize: 12, color: T.colors.text.secondary }}>{review.rating}/10</span>
          </div>
        </div>
      </div>
      <p style={{ fontWeight: 600, fontSize: 15, color: T.colors.text.primary, margin: '0 0 6px' }}>{review.title}</p>
      <p style={{ fontSize: 14, color: T.colors.text.secondary, lineHeight: 1.6, margin: '0 0 12px' }}>{review.body}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: T.colors.text.muted }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.colors.text.muted, fontFamily: T.fonts.body, fontSize: 12 }}>
          👍 {review.likes.toLocaleString()}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.colors.text.muted, fontFamily: T.fonts.body, fontSize: 12 }}>
          👎 {review.dislikes.toLocaleString()}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.colors.text.muted, fontFamily: T.fonts.body, fontSize: 12, marginLeft: 'auto' }}>
          Report
        </button>
      </div>
    </div>
  );
}

// ─── About Tab ────────────────────────────────────────────────────────────────

function AboutTab({ movie }: { movie: typeof MOVIES[0] }) {
  return (
    <div>
      {/* Trailer placeholder */}
      <div style={{
        aspectRatio: '16/9', borderRadius: T.radius.lg, overflow: 'hidden',
        background: T.gradients.heroDark,
        position: 'relative', marginBottom: 32,
        border: `1px solid ${T.colors.border.default}`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 18px)',
        }} />
        <button style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 80, height: 80, borderRadius: T.radius.full,
          background: 'rgba(0,0,0,0.5)', border: `1px solid rgba(255,255,255,0.2)`,
          backdropFilter: 'blur(10px)', color: T.colors.tint.white, fontSize: 24, cursor: 'pointer',
          transition: `background ${T.motion.duration.base}`,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(225, 29, 116,0.6)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
          aria-label="Play trailer"
        >
          ▶
        </button>
        <div style={{
          position: 'absolute', bottom: 12, left: 16,
          fontFamily: T.fonts.mono, fontSize: 11, color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.1em',
        }}>
          OFFICIAL TRAILER · 2:34
        </div>
      </div>

      <h2 style={{ fontFamily: T.fonts.display, fontSize: 26, fontWeight: 600, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
        Storyline
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: T.colors.text.secondary, margin: '0 0 20px', maxWidth: 740 }}>
        {movie.synopsis}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
        {movie.genres.map((g) => (
          <span key={g} style={{
            padding: '4px 12px', borderRadius: T.radius.full, fontSize: 12, fontWeight: 500,
            background: T.colors.bg.surface2, border: `1px solid ${T.colors.border.default}`,
            color: T.colors.text.secondary,
          }}>
            {g}
          </span>
        ))}
      </div>

      {/* Facts */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
        padding: 22, borderRadius: T.radius.lg,
        background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
      }}>
        {[
          { label: 'Director', value: movie.director },
          { label: 'Released', value: movie.releaseDate },
          { label: 'Runtime', value: movie.duration },
          { label: 'Certificate', value: `${movie.certificate} · 13+` },
        ].map((f) => (
          <div key={f.label}>
            <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{f.label}</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6, color: T.colors.text.primary }}>{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cast Tab ─────────────────────────────────────────────────────────────────

const CAST_COLORS = [T.gradients.posterPurple, 'linear-gradient(135deg,#3a0a14,#7f1d1d)', 'linear-gradient(135deg,#0a2a3a,#155e75)', 'linear-gradient(135deg,#2a2a0a,#713f12)'];

function CastTab({ movie }: { movie: typeof MOVIES[0] }) {
  return (
    <div style={{
      display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 140,
      gap: 16, overflowX: 'auto', paddingBottom: 8,
    }}>
      {movie.cast.map((member, i) => (
        <div key={member.name} style={{ textAlign: 'center' }}>
          <div style={{
            aspectRatio: '1', borderRadius: T.radius.full,
            marginBottom: 10, position: 'relative', overflow: 'hidden',
            background: CAST_COLORS[i % CAST_COLORS.length],
            border: `1px solid ${T.colors.border.default}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: 'rgba(255,255,255,0.4)',
          }}>
            👤
          </div>
          <div style={{ fontWeight: 600, fontSize: 13, color: T.colors.text.primary }}>{member.name}</div>
          <div style={{ fontSize: 11, color: T.colors.text.muted, marginTop: 2 }}>{member.role}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────

function ReviewsTab() {
  const [sortReviews, setSortReviews] = useState('Most Helpful');

  return (
    <div>
      {/* Score overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { num: MOVIE.rating.toString(), label: `★ BookKaroo score · ${MOVIE.reviewCount} ratings`, bar: MOVIE.rating / 10, barColor: `linear-gradient(90deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})` },
          { num: '96%', label: 'Critics liked it · 42 reviews', bar: 0.96, barColor: `linear-gradient(90deg, ${T.colors.semantic.success}, ${T.colors.tint.cyan})` },
          { num: '93%', label: 'Audience score · 14K verified', bar: 0.93, barColor: `linear-gradient(90deg, #FBBF24, ${T.colors.accent.crimson})` },
        ].map((m) => (
          <div key={m.label} style={{ padding: 20, borderRadius: T.radius.lg, background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}` }}>
            <div style={{ fontFamily: T.fonts.display, fontSize: 38, fontWeight: 600, lineHeight: 1, color: T.colors.text.primary }}>{m.num}</div>
            <div style={{ fontSize: 12, color: T.colors.text.muted, marginTop: 6 }}>{m.label}</div>
            <div style={{ height: 5, borderRadius: 3, background: T.colors.bg.surface3, overflow: 'hidden', marginTop: 10 }}>
              <div style={{ height: '100%', background: m.barColor, borderRadius: 3, width: `${m.bar * 100}%`, transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['Most Helpful', 'Most Recent', 'Highest', 'Lowest'].map((s) => (
          <button key={s} onClick={() => setSortReviews(s)} style={{
            padding: '6px 14px', borderRadius: T.radius.full, fontSize: 12, fontWeight: 500,
            background: sortReviews === s ? T.colors.bg.surface3 : T.colors.bg.surface,
            border: `1px solid ${sortReviews === s ? T.colors.border.strong : T.colors.border.default}`,
            color: sortReviews === s ? T.colors.text.primary : T.colors.text.secondary,
            cursor: 'pointer', fontFamily: T.fonts.body,
          }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {REVIEWS.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>
    </div>
  );
}

// ─── MovieDetail ──────────────────────────────────────────────────────────────

export default function MovieDetail() {
  const [tab, setTab] = useState<Tab>('about');
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), { threshold: 0 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'cast', label: 'Cast & Crew' },
    { key: 'reviews', label: `Reviews (${REVIEWS.length})` },
    { key: 'photos', label: 'Photos' },
  ];

  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      {/* Backdrop */}
      <div style={{
        position: 'relative', height: 480,
        background: T.gradients.heroDark,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${TMDB_BD}${MOVIE.backdropPath})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.2,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(70% 80% at 60% 30%, rgba(168,85,247,0.4), transparent 60%),
                       radial-gradient(50% 50% at 20% 80%, rgba(225, 29, 116,0.3), transparent 60%)`,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, ${T.colors.bg.base} 100%)` }} />
      </div>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Detail shell */}
        <div style={{ marginTop: -200, position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40 }}>
          {/* Poster column */}
          <aside>
            <div style={{
              width: '100%', aspectRatio: '2/3', borderRadius: T.radius.lg, overflow: 'hidden',
              background: 'linear-gradient(135deg, #2a1a3d, #4c1d95 80%)',
              boxShadow: T.shadows.lg, border: `1px solid rgba(255,255,255,0.12)`,
            }}>
              <img
                src={`${TMDB}${MOVIE.posterPath}`}
                alt={MOVIE.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
              {['♡  Add to Watchlist', '↗  Share'].map((btn) => (
                <button key={btn} style={{
                  padding: '10px 0', borderRadius: T.radius.full,
                  background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
                  color: T.colors.text.secondary, fontSize: 14, cursor: 'pointer', fontFamily: T.fonts.body,
                  width: '100%',
                }}>
                  {btn}
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <section style={{ paddingTop: 60 }}>
            <div ref={heroRef}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Now Showing · {MOVIE.certificate} · {MOVIE.duration}
              </div>
              <h1 style={{
                fontFamily: T.fonts.display,
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1,
                color: T.colors.text.primary,
              }}>
                {MOVIE.title}
              </h1>
              <p style={{ fontFamily: T.fonts.display, fontStyle: 'italic', color: T.colors.text.secondary, fontSize: 18, margin: '12px 0 0', maxWidth: 600 }}>
                "{MOVIE.synopsis.slice(0, 80)}…"
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '20px 0' }}>
                <Badge color="warning">⭐ {MOVIE.rating} · {MOVIE.reviewCount} reviews</Badge>
                {MOVIE.formats.slice(0, 2).map((f) => <Badge key={f} color="indigo">{f}</Badge>)}
                {MOVIE.languages.map((l) => <Badge key={l}>{l}</Badge>)}
                {MOVIE.genres.map((g) => <Badge key={g}>{g}</Badge>)}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <a href={`/movies/${MOVIE.slug}/showtimes`} style={{ textDecoration: 'none' }}>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '0 28px', height: 52, borderRadius: T.radius.full,
                    background: `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`,
                    color: T.colors.tint.white, fontWeight: 700, fontSize: 16, cursor: 'pointer',
                    border: 'none', fontFamily: T.fonts.body, boxShadow: T.shadows.glowCrimson,
                  }}>
                    Book Tickets
                  </button>
                </a>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '0 24px', height: 52, borderRadius: T.radius.full,
                  background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
                  color: T.colors.text.primary, fontWeight: 600, fontSize: 15, cursor: 'pointer',
                  fontFamily: T.fonts.body,
                }}>
                  ▶ Watch Trailer
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 4, padding: 4,
              background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
              borderRadius: T.radius.full, width: 'fit-content', margin: '32px 0 24px',
            }}>
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: '7px 18px', borderRadius: T.radius.full, fontSize: 13, fontWeight: 500,
                  background: tab === t.key ? T.colors.bg.surface3 : 'transparent',
                  color: tab === t.key ? T.colors.text.primary : T.colors.text.muted,
                  border: 'none', cursor: 'pointer', fontFamily: T.fonts.body,
                  boxShadow: tab === t.key ? T.shadows.sm : 'none',
                  transition: `all ${T.motion.duration.fast}`,
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'about' && <AboutTab movie={MOVIE} />}
            {tab === 'cast' && <CastTab movie={MOVIE} />}
            {tab === 'reviews' && <ReviewsTab />}
            {tab === 'photos' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} style={{
                    aspectRatio: '16/9', borderRadius: T.radius.md,
                    background: `linear-gradient(135deg, hsl(${i * 40},30%,15%), hsl(${i * 40 + 30},50%,25%))`,
                    border: `1px solid ${T.colors.border.default}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, color: 'rgba(255,255,255,0.2)',
                  }}>
                    🖼
                  </div>
                ))}
              </div>
            )}

            {/* Sticky CTA */}
            {stickyVisible && (
              <div style={{
                position: 'sticky', bottom: 16, zIndex: 30, marginTop: 32,
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 18px', borderRadius: T.radius.full,
                background: `rgba(19,24,38,0.88)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${T.colors.border.strong}`,
                boxShadow: T.shadows.lg,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: T.colors.text.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tickets from</div>
                  <div style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 600 }}>
                    ₹{MOVIE.fromPrice}{' '}
                    <span style={{ fontSize: 13, fontWeight: 400, color: T.colors.text.muted }}>· 3 venues in Ahmedabad</span>
                  </div>
                </div>
                <button style={{
                  padding: '0 24px', height: 44, borderRadius: T.radius.full,
                  background: `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`,
                  color: T.colors.tint.white, border: 'none', fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', fontFamily: T.fonts.body,
                }}>
                  Pick a showtime →
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
