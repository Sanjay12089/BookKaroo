import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';

const TEAMS = [
  { abbr: 'GT', color: '#1B64A7' }, { abbr: 'MI', color: '#004BA0' },
  { abbr: 'RCB', color: '#C41C1C' }, { abbr: 'CSK', color: '#F9CD1B' },
  { abbr: 'RR', color: '#254AA5' }, { abbr: 'KKR', color: '#3B215C' },
  { abbr: 'SRH', color: '#D9480F' }, { abbr: 'DC', color: '#0078C4' },
];

const FIXTURES = [
  { teams: 'GT vs MI', date: '16 May', time: '7:30 PM', venue: 'Narendra Modi Stadium' },
  { teams: 'RCB vs KKR', date: '18 May', time: '3:30 PM', venue: 'M Chinnaswamy Stadium' },
  { teams: 'RR vs CSK', date: '20 May', time: '7:30 PM', venue: 'Sawai Mansingh Stadium' },
];

export function IplStrip() {
  return (
    <section className="my-12 rounded-2xl overflow-hidden border border-[rgba(245,197,107,0.2)] relative">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(60% 100% at 100% 50%, rgba(245,197,107,0.18), transparent), linear-gradient(110deg, #1a0a05 0%, #2d0a0e 60%, #1a0535 100%)',
        }}
      />

      <div className="relative p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-[#F5C56B] mb-2">
            ◆ TATA IPL 2026 · Indian Premier League
          </p>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-2">
            The season is on. Tickets are live.
          </h3>
          <p className="text-text-secondary text-sm mb-5">
            Narendra Modi Stadium, Eden Gardens, Wankhede & 7 more venues.
          </p>

          {/* Team avatars */}
          <div className="flex gap-2.5 mb-6 flex-wrap">
            {TEAMS.map((t) => (
              <div
                key={t.abbr}
                title={t.abbr}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white/10 shadow-md font-mono"
                style={{ background: t.color }}
              >
                {t.abbr}
              </div>
            ))}
          </div>

          <Link
            to={ROUTES.IPL}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full font-semibold text-sm font-sans shadow-[0_8px_24px_rgba(245,197,107,0.4)] transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #F5C56B, #D4A017)', color: '#1a0a05' }}
          >
            Book IPL Tickets →
          </Link>
        </div>

        {/* Fixtures */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          {FIXTURES.map((f) => (
            <div
              key={f.teams}
              className="px-4 py-2.5 rounded-lg border border-white/10 text-sm font-sans"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <p className="font-semibold text-text-primary">{f.teams}</p>
              <p className="text-text-muted text-xs mt-0.5">{f.date} · {f.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
