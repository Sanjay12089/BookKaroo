import { useState, useEffect, useCallback } from 'react';
import { DESIGN_TOKENS as T } from '../tokens';
import { Logo } from '../Logo';
import { Badge, SectionHeader } from '../DesignSystem';
import { MOVIES, COMING_SOON, EVENTS, IPL_MATCHES } from './mockData';

const TMDB = 'https://image.tmdb.org/t/p/w300';
const TMDB_BD = 'https://image.tmdb.org/t/p/w1280';

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 68,
      background: scrolled
        ? `color-mix(in srgb, ${T.colors.bg.surface} 88%, transparent)`
        : 'transparent',
      backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      borderBottom: `1px solid ${scrolled ? T.colors.border.default : 'transparent'}`,
      transition: `background ${T.motion.duration.base}, border-color ${T.motion.duration.base}`,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Logo size={36} glow />

        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: T.radius.full,
          background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
          color: T.colors.text.secondary, fontSize: 13, cursor: 'pointer',
          fontFamily: T.fonts.body,
        }}>
          📍 Ahmedabad ▾
        </button>

        {searchOpen ? (
          <div style={{
            flex: 1, maxWidth: 480, display: 'flex', alignItems: 'center', gap: 10,
            background: T.colors.bg.surface2,
            border: `1px solid ${T.colors.accent.indigo}`,
            borderRadius: T.radius.full, padding: '8px 16px',
            boxShadow: `0 0 0 3px rgba(99,102,241,0.15)`,
          }}>
            <span style={{ color: T.colors.text.muted }}>🔍</span>
            <input
              autoFocus
              placeholder="Search movies, events"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: T.colors.text.primary, fontFamily: T.fonts.body, fontSize: 14,
              }}
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              flex: 1, maxWidth: 480, display: 'flex', alignItems: 'center', gap: 10,
              background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
              borderRadius: T.radius.full, padding: '8px 16px',
              color: T.colors.text.muted, fontSize: 14, cursor: 'pointer',
              fontFamily: T.fonts.body,
              transition: `border-color ${T.motion.duration.fast}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.colors.border.strong)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.colors.border.default)}
          >
            <span>🔍</span> Search movies, events
          </button>
        )}

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          {['Movies', 'Events', 'Sports', 'Plays'].map((item) => (
            <a key={item} href="#" style={{
              padding: '8px 12px', borderRadius: T.radius.md,
              fontSize: 14, fontWeight: 500, color: T.colors.text.secondary,
              textDecoration: 'none', fontFamily: T.fonts.body,
              transition: `color ${T.motion.duration.fast}, background ${T.motion.duration.fast}`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.colors.text.primary; e.currentTarget.style.background = T.colors.bg.surface; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.colors.text.secondary; e.currentTarget.style.background = 'transparent'; }}
            >
              {item}
            </a>
          ))}
        </nav>

        <button style={{
          padding: '8px 20px', borderRadius: T.radius.full,
          background: `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`,
          color: T.colors.tint.white, fontWeight: 600, fontSize: 14, cursor: 'pointer',
          border: 'none', fontFamily: T.fonts.body,
          boxShadow: T.shadows.glowIndigo,
        }}>
          Sign In
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HERO_MOVIES = MOVIES.filter((m) => m.heroSlide);

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const go = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 180);
  }, []);

  useEffect(() => {
    const id = setInterval(() => go((active + 1) % HERO_MOVIES.length), 4000);
    return () => clearInterval(id);
  }, [active, go]);

  const m = HERO_MOVIES[active];

  return (
    <section style={{
      position: 'relative', margin: '0 0 56px',
      borderRadius: T.radius.xl, overflow: 'hidden',
      border: `1px solid ${T.colors.border.default}`,
      minHeight: 520,
      background: `radial-gradient(70% 80% at 60% 30%, rgba(168,85,247,0.45), transparent 60%),
                   radial-gradient(50% 50% at 20% 80%, rgba(225, 29, 116,0.35), transparent 60%),
                   ${T.gradients.heroDark}`,
    }}>
      {/* Backdrop image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${TMDB_BD}${m.backdropPath})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        opacity: fading ? 0 : 0.18,
        transition: `opacity ${T.motion.duration.slow} ${T.motion.ease.out}`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(90deg, ${T.colors.bg.base} 35%, transparent 100%)`,
      }} />
      {/* Noise */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.35,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '3px 3px', mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        display: 'grid', gridTemplateColumns: '1.3fr 1fr',
        gap: 56, alignItems: 'center',
        padding: '64px 56px 56px',
        minHeight: 520,
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(8px)' : 'none',
        transition: `opacity ${T.motion.duration.base}, transform ${T.motion.duration.base}`,
      }}>
        <div>
          <Badge color="crimson" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.colors.accent.crimson, boxShadow: `0 0 8px ${T.colors.accent.crimson}`, display: 'inline-block' }} />
            Premiere · Now Showing
          </Badge>

          <h1 style={{
            fontFamily: T.fonts.display,
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1,
            margin: '0 0 14px', color: T.colors.text.primary,
          }}>
            {m.title}
          </h1>

          <p style={{
            color: T.colors.text.secondary, fontSize: 17,
            maxWidth: 520, lineHeight: 1.55, margin: '0 0 20px',
          }}>
            {m.synopsis.slice(0, 120)}…
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            <Badge color="warning">⭐ {m.rating} · {m.reviewCount} reviews</Badge>
            {m.formats.slice(0, 2).map((f) => <Badge key={f} color="indigo">{f}</Badge>)}
            {m.languages.slice(0, 2).map((l) => <Badge key={l}>{l}</Badge>)}
            <Badge>{m.duration} · {m.certificate}</Badge>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0 28px', height: 52, borderRadius: T.radius.full,
              background: `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson} 55%, ${T.colors.accent.crimsonDark})`,
              color: T.colors.tint.white, fontWeight: 700, fontSize: 16, cursor: 'pointer',
              border: 'none', fontFamily: T.fonts.body,
              boxShadow: T.shadows.glowCrimson,
            }}>
              🎟 Book Tickets
            </button>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0 24px', height: 52, borderRadius: T.radius.full,
              background: T.colors.bg.surface, border: `1px solid ${T.colors.border.default}`,
              color: T.colors.text.primary, fontWeight: 600, fontSize: 15,
              cursor: 'pointer', fontFamily: T.fonts.body,
              backdropFilter: 'blur(8px)',
            }}>
              ▶ Watch Trailer
            </button>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
            {HERO_MOVIES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                style={{
                  width: i === active ? 32 : 10, height: 4,
                  borderRadius: 2, border: 'none', cursor: 'pointer',
                  background: i === active ? T.colors.tint.white : 'rgba(255,255,255,0.22)',
                  transition: `width ${T.motion.duration.base}, background ${T.motion.duration.base}`,
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Poster */}
        <div style={{
          position: 'relative', aspectRatio: '2/3', maxWidth: 280,
          justifySelf: 'end',
          borderRadius: T.radius.lg, overflow: 'hidden',
          background: T.gradients.posterPurple,
          boxShadow: `${T.shadows.lg}, 0 0 80px -20px rgba(168,85,247,0.6)`,
          border: `1px solid rgba(255,255,255,0.1)`,
          transform: 'rotate(-2deg)',
        }}>
          <img
            src={`${TMDB}${m.posterPath}`}
            alt={m.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>

      {/* Arrows */}
      <div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', gap: 8 }}>
        {['‹', '›'].map((arrow, i) => (
          <button key={arrow} onClick={() => go(i === 0 ? (active - 1 + HERO_MOVIES.length) % HERO_MOVIES.length : (active + 1) % HERO_MOVIES.length)}
            style={{
              width: 40, height: 40, borderRadius: T.radius.full,
              background: 'rgba(0,0,0,0.4)', border: `1px solid ${T.colors.border.strong}`,
              color: T.colors.tint.white, cursor: 'pointer', fontSize: 18, display: 'grid', placeItems: 'center',
              backdropFilter: 'blur(10px)',
            }}>
            {arrow}
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Movie Card ────────────────────────────────────────────────────────────────

function MovieCard({ movie, coming = false }: { movie: typeof MOVIES[0] | typeof COMING_SOON[0]; coming?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isMovie = 'rating' in movie;

  return (
    <a href={`/movies/${movie.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        position: 'relative', aspectRatio: '2/3',
        borderRadius: T.radius.lg, overflow: 'hidden',
        background: T.gradients.posterCard,
        border: `1px solid ${hovered ? T.colors.border.strong : T.colors.border.default}`,
        transition: `all ${T.motion.duration.base} ${T.motion.ease.out}`,
        transform: hovered ? 'translateY(-4px) scale(1.02)' : 'none',
        boxShadow: hovered ? `${T.shadows.lg}, ${T.shadows.glowCrimson}` : T.shadows.sm,
        isolation: 'isolate',
      }}>
        <img
          src={`${TMDB}${movie.posterPath}`}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        {isMovie && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            padding: '3px 8px', borderRadius: T.radius.full,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            fontSize: 12, fontWeight: 600, color: T.colors.tint.warningText,
            fontFamily: T.fonts.body,
          }}>
            ⭐ {(movie as typeof MOVIES[0]).rating}
          </div>
        )}

        {coming && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            padding: '3px 8px', borderRadius: T.radius.full,
            background: 'rgba(99,102,241,0.85)', backdropFilter: 'blur(8px)',
            fontSize: 11, fontWeight: 600, color: T.colors.tint.white,
            fontFamily: T.fonts.body,
          }}>
            {(movie as typeof COMING_SOON[0]).releaseDate}
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.4) 60%, transparent 100%)',
          opacity: hovered ? 1 : 0,
          transition: `opacity ${T.motion.duration.base}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 14,
        }}>
          <button style={{
            background: coming
              ? `linear-gradient(135deg, ${T.colors.accent.indigo}, ${T.colors.accent.purple})`
              : `linear-gradient(135deg, ${T.colors.accent.crimsonLight}, ${T.colors.accent.crimson})`,
            color: T.colors.tint.white, border: 'none', borderRadius: T.radius.full,
            padding: '8px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            width: '100%', fontFamily: T.fonts.body,
          }}>
            {coming ? '🔔 Remind Me' : '🎟 Book Now'}
          </button>
        </div>
      </div>

      <div style={{ paddingTop: 10 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.colors.text.primary, fontFamily: T.fonts.display }}>{movie.title}</p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: T.colors.text.muted, fontFamily: T.fonts.body }}>
          {isMovie
            ? `${(movie as typeof MOVIES[0]).genres.slice(0, 2).join(' · ')}`
            : `${(movie as typeof COMING_SOON[0]).genres.join(' · ')}`
          }
        </p>
      </div>
    </a>
  );
}

// ─── IPL Strip ────────────────────────────────────────────────────────────────

function IPLStrip() {
  return (
    <section style={{
      margin: '0 0 56px', position: 'relative',
      borderRadius: T.radius.xl, overflow: 'hidden',
      border: `1px solid rgba(245,197,107,0.2)`,
      background: `radial-gradient(60% 100% at 100% 50%, rgba(245,197,107,0.18), transparent),
                   ${T.gradients.iplStrip}`,
      padding: '32px 36px',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontFamily: T.fonts.mono, fontSize: 11, letterSpacing: '0.18em',
          color: T.colors.tint.gold, textTransform: 'uppercase', marginBottom: 8,
        }}>
          ◆ TATA IPL 2026 · Indian Premier League
        </div>
        <h3 style={{
          fontFamily: T.fonts.display, fontSize: 32, margin: '0 0 6px',
          fontWeight: 700, color: T.colors.text.primary,
        }}>
          The season is on. Tickets are live.
        </h3>
        <p style={{ color: T.colors.text.secondary, margin: '0 0 18px', fontSize: 14 }}>
          Narendra Modi Stadium, Eden Gardens, Wankhede & 7 more venues. Early access for BookKaroo Plus members.
        </p>

        {/* Team avatars */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { abbr: 'GT', color: '#1B64A7' }, { abbr: 'MI', color: '#004BA0' },
            { abbr: 'RCB', color: '#C41C1C' }, { abbr: 'CSK', color: '#F9CD1B' },
            { abbr: 'RR', color: '#254AA5' }, { abbr: 'KKR', color: '#3B215C' },
          ].map((t) => (
            <div key={t.abbr} style={{
              width: 38, height: 38, borderRadius: T.radius.full,
              background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: T.colors.tint.white, fontFamily: T.fonts.mono,
              border: '2px solid rgba(255,255,255,0.12)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              {t.abbr}
            </div>
          ))}
        </div>

        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '0 24px', height: 44, borderRadius: T.radius.full,
          background: T.gradients.iplGoldCta,
          color: T.colors.tint.goldBg, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          border: 'none', fontFamily: T.fonts.body,
          boxShadow: '0 8px 24px rgba(245,197,107,0.4)',
        }}>
          Book IPL Tickets →
        </button>
      </div>

      {/* Fixture cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
        {IPL_MATCHES.map((m) => (
          <div key={m.abbr1 + m.abbr2} style={{
            padding: '10px 14px', borderRadius: T.radius.md,
            background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.1)`,
          }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: T.colors.text.primary }}>
              {m.abbr1} <span style={{ color: T.colors.text.muted }}>vs</span> {m.abbr2}
            </div>
            <div style={{ fontSize: 11, color: T.colors.text.muted, marginTop: 2 }}>
              {m.date} · {m.time}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Events Grid ──────────────────────────────────────────────────────────────

function EventTile({ evt }: { evt: typeof EVENTS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        borderRadius: T.radius.lg, overflow: 'hidden',
        background: T.colors.bg.surface,
        border: `1px solid ${hovered ? T.colors.border.strong : T.colors.border.default}`,
        transition: `transform ${T.motion.duration.base}, border-color ${T.motion.duration.base}`,
        transform: hovered ? 'translateY(-3px)' : 'none',
      }}>
        <div style={{
          aspectRatio: '4/3', background: evt.gradient, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 48 }}>{evt.emoji}</span>
          <div style={{
            position: 'absolute', top: 12, left: 12,
            padding: '3px 10px', borderRadius: T.radius.full,
            background: 'rgba(99,102,241,0.85)', color: T.colors.tint.white,
            fontSize: 11, fontWeight: 600, fontFamily: T.fonts.body,
          }}>
            {evt.type}
          </div>
        </div>
        <div style={{ padding: 14 }}>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.colors.text.primary }}>{evt.title}</h4>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: T.colors.text.muted }}>{evt.subtitle}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
            <span style={{ color: T.colors.text.secondary }}>{evt.date}</span>
            <span style={{ color: T.colors.semantic.success, fontWeight: 600 }}>{evt.price}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function EventsSection() {
  return (
    <section style={{ marginBottom: 64 }}>
      <SectionHeader title="Live Events & Concerts" seeAllHref="#" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {EVENTS.map((evt) => <EventTile key={evt.id} evt={evt} />)}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.colors.border.default}`,
      padding: '56px 0 32px',
      background: `radial-gradient(80% 60% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%), ${T.colors.bg.base}`,
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <Logo size={36} style={{ marginBottom: 16 }} />
            <p style={{ color: T.colors.text.muted, fontSize: 14, margin: '0 0 8px', lineHeight: 1.6 }}>
              Book the moment. Karo it now.
            </p>
            <p style={{ color: T.colors.text.muted, fontSize: 12, margin: 0 }}>
              India's premier entertainment booking platform.
            </p>
          </div>
          {[
            { heading: 'Explore', links: ['Movies', 'Events', 'Sports', 'Plays', 'Comedy'] },
            { heading: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
            { heading: 'Support', links: ['Help Centre', 'Refunds', 'Cancellation', 'Contact Us'] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em',
                color: T.colors.text.muted, margin: '0 0 16px', fontWeight: 600,
              }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ color: T.colors.text.secondary, fontSize: 14, textDecoration: 'none' }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 24, borderTop: `1px solid ${T.colors.border.default}`,
          color: T.colors.text.muted, fontSize: 12,
        }}>
          <span>© 2026 BookKaroo Pvt Ltd. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: T.colors.text.muted, textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: T.colors.text.muted, textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: T.colors.text.muted, textDecoration: 'none' }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ background: T.colors.bg.base, minHeight: '100vh', color: T.colors.text.primary, fontFamily: T.fonts.body }}>
      <Nav />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 0' }}>
        <HeroCarousel />

        <section style={{ marginBottom: 64 }}>
          <SectionHeader title="Now Showing" seeAllHref="/movies" seeAllLabel="View all 312 →" />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16,
            overflowX: 'auto',
          }}>
            {MOVIES.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        </section>

        <IPLStrip />

        <section style={{ marginBottom: 64 }}>
          <SectionHeader title="Coming Soon" seeAllHref="#" seeAllLabel="Set reminders →" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {COMING_SOON.map((m) => <MovieCard key={m.id} movie={m} coming />)}
          </div>
        </section>

        <EventsSection />

        {/* Trust band */}
        <section style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          padding: '32px 0',
          borderTop: `1px solid ${T.colors.border.default}`,
          borderBottom: `1px solid ${T.colors.border.default}`,
          marginBottom: 0,
        }}>
          {[
            { num: '4,200+', label: 'screens nationwide' },
            { num: '98%', label: 'on-time entry' },
            { num: '2.1M', label: 'tickets monthly' },
            { num: '4.8★', label: 'average app rating' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.fonts.display, fontSize: 36, fontWeight: 600, color: T.colors.text.primary }}>{item.num}</div>
              <div style={{ fontSize: 12, color: T.colors.text.muted, letterSpacing: '0.06em', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
