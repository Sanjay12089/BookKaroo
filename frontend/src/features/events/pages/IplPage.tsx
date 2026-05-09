import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';

const TEAMS = [
  { abbr: 'GT',  name: 'Gujarat Titans',         color: '#1B64A7', textColor: '#fff' },
  { abbr: 'MI',  name: 'Mumbai Indians',          color: '#004BA0', textColor: '#fff' },
  { abbr: 'RCB', name: 'Royal Challengers',       color: '#C41C1C', textColor: '#fff' },
  { abbr: 'CSK', name: 'Chennai Super Kings',     color: '#F9CD1B', textColor: '#000' },
  { abbr: 'RR',  name: 'Rajasthan Royals',        color: '#254AA5', textColor: '#fff' },
  { abbr: 'KKR', name: 'Kolkata Knight Riders',   color: '#3B215C', textColor: '#fff' },
  { abbr: 'SRH', name: 'Sunrisers Hyderabad',     color: '#D9480F', textColor: '#fff' },
  { abbr: 'DC',  name: 'Delhi Capitals',          color: '#0078C4', textColor: '#fff' },
  { abbr: 'LSG', name: 'Lucknow Super Giants',    color: '#A72056', textColor: '#fff' },
  { abbr: 'PBKS',name: 'Punjab Kings',            color: '#D71920', textColor: '#fff' },
];

const MATCHES = [
  { id: 'm1', team1: 'GT', team2: 'MI', date: '16 May 2026', time: '7:30 PM', venue: 'Narendra Modi Stadium, Ahmedabad', status: 'upcoming' },
  { id: 'm2', team1: 'RCB', team2: 'KKR', date: '18 May 2026', time: '3:30 PM', venue: 'M Chinnaswamy Stadium, Bangalore', status: 'upcoming' },
  { id: 'm3', team1: 'RR', team2: 'CSK', date: '20 May 2026', time: '7:30 PM', venue: 'Sawai Mansingh Stadium, Jaipur', status: 'upcoming' },
  { id: 'm4', team1: 'MI', team2: 'DC', date: '22 May 2026', time: '7:30 PM', venue: 'Wankhede Stadium, Mumbai', status: 'upcoming' },
  { id: 'm5', team1: 'SRH', team2: 'PBKS', date: '24 May 2026', time: '3:30 PM', venue: 'Rajiv Gandhi Stadium, Hyderabad', status: 'upcoming' },
];

function TeamBadge({ abbr, color, textColor }: { abbr: string; color: string; textColor: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/15 shadow-lg font-mono"
        style={{ background: color, color: textColor }}
      >
        {abbr}
      </div>
      <span className="text-[10px] text-text-muted font-sans text-center leading-tight max-w-[60px]">
        {TEAMS.find(t => t.abbr === abbr)?.name.split(' ')[0]}
      </span>
    </div>
  );
}

export default function IplPage() {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState<typeof MATCHES[0] | null>(null);

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative overflow-hidden min-h-[360px] flex items-center" style={{
        background: 'radial-gradient(60% 100% at 100% 50%, rgba(245,197,107,0.2), transparent), linear-gradient(135deg, #1a0a05 0%, #2d0a0e 50%, #1a0535 100%)'
      }}>
        <div className="max-w-[1280px] mx-auto px-6 py-16 w-full">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[#F5C56B] mb-3">
            ◆ TATA IPL 2026 · Indian Premier League
          </p>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-text-primary mb-4 tracking-tight">
            Cricket.<br/>Passion.<br/><span style={{ color: '#F5C56B' }}>Live.</span>
          </h1>
          <p className="text-text-secondary font-sans max-w-md mb-8">
            Book seats for TATA IPL 2026 — Narendra Modi Stadium, Wankhede, Eden Gardens and 7 more iconic venues.
          </p>
          <Button size="lg" style={{ background: 'linear-gradient(135deg, #F5C56B, #D4A017)', color: '#1a0a05', boxShadow: '0 8px 24px rgba(245,197,107,0.4)' }}>
            🏏 Browse All Matches
          </Button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {/* Teams */}
        <section className="mb-14">
          <h2 className="font-display font-semibold text-2xl md:text-3xl mb-6 tracking-tight">10 Teams · 74 Matches</h2>
          <div className="flex gap-6 flex-wrap">
            {TEAMS.map((t) => (
              <div key={t.abbr} className="flex flex-col items-center gap-2">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold font-mono border-2 border-white/10 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: t.color, color: t.textColor }}
                  title={t.name}
                >
                  {t.abbr}
                </div>
                <span className="text-[10px] text-text-muted font-sans text-center leading-tight max-w-[60px]">
                  {t.abbr}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming fixtures */}
        <section>
          <h2 className="font-display font-semibold text-2xl md:text-3xl mb-6 tracking-tight">Upcoming Fixtures</h2>
          <div className="space-y-4">
            {MATCHES.map((m) => {
              const t1 = TEAMS.find(t => t.abbr === m.team1);
              const t2 = TEAMS.find(t => t.abbr === m.team2);
              return (
                <div key={m.id} className="p-5 rounded-xl bg-bg-surface border border-border-default hover:border-border-strong transition-colors">
                  <div className="flex items-center gap-6">
                    <TeamBadge abbr={m.team1} color={t1?.color ?? '#444'} textColor={t1?.textColor ?? '#fff'} />
                    <div className="flex-1 text-center">
                      <div className="font-display font-semibold text-xl text-text-primary">{m.team1} vs {m.team2}</div>
                      <div className="text-sm text-text-secondary mt-1 font-sans">{m.date} · {m.time}</div>
                      <div className="text-xs text-text-muted mt-0.5 font-sans">{m.venue}</div>
                    </div>
                    <TeamBadge abbr={m.team2} color={t2?.color ?? '#444'} textColor={t2?.textColor ?? '#fff'} />
                    <div className="hidden md:block">
                      <Button
                        size="sm"
                        onClick={() => setSelectedMatch(m)}
                        style={{ background: 'linear-gradient(135deg, #F5C56B, #D4A017)', color: '#1a0a05' }}>
                        Book →
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-text-muted mt-8 font-sans">
            Full schedule and seat booking coming soon — matches added via Admin panel
          </p>
        </section>
      </div>

      {/* Match Booking Modal */}
      <Modal
        open={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title={selectedMatch ? `${selectedMatch.team1} vs ${selectedMatch.team2}` : ''}
      >
        {selectedMatch && (
          <div className="space-y-4 font-sans">
            <div className="p-4 rounded-xl bg-bg-surface2 border border-border-default space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Date</span><span className="text-text-primary font-medium">{selectedMatch.date}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Time</span><span className="text-text-primary font-medium">{selectedMatch.time}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Venue</span><span className="text-text-primary font-medium text-right max-w-[55%] leading-snug">{selectedMatch.venue}</span></div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              IPL seat booking is being set up. Matches will be available to book once added as Shows in the Admin panel.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedMatch(null); navigate('/sports'); }}
                className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple text-white text-sm font-semibold"
              >
                Browse Sports Events
              </button>
              <button onClick={() => setSelectedMatch(null)}
                className="px-5 py-2.5 rounded-full bg-bg-surface2 border border-border-default text-sm text-text-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
