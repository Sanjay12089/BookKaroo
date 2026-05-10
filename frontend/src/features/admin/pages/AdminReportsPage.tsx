import { AdminLayout } from '@/shared/components/layout/AdminLayout';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  trend: string;
  trendUp: boolean;
}

const STATS: StatCard[] = [
  { label: 'Total Revenue', value: '₹0', icon: '💰', trend: '+0% this month', trendUp: true },
  { label: 'Total Bookings', value: '0', icon: '🎟', trend: '+0% this month', trendUp: true },
  { label: 'Avg Ticket Price', value: '₹0', icon: '🏷', trend: 'vs last month', trendUp: false },
  { label: 'Active Users', value: '0', icon: '👥', trend: '+0% this week', trendUp: true },
];

// Heights as Tailwind classes (mapped from 0–100 scale to h-* steps)
const MONTHLY_DATA = [
  { month: 'Jan', heightClass: 'h-[40px]' },
  { month: 'Feb', heightClass: 'h-[65px]' },
  { month: 'Mar', heightClass: 'h-[55px]' },
  { month: 'Apr', heightClass: 'h-[80px]' },
  { month: 'May', heightClass: 'h-[72px]' },
  { month: 'Jun', heightClass: 'h-[90px]' },
  { month: 'Jul', heightClass: 'h-[60px]' },
  { month: 'Aug', heightClass: 'h-[85px]' },
  { month: 'Sep', heightClass: 'h-[70px]' },
  { month: 'Oct', heightClass: 'h-[95px]' },
  { month: 'Nov', heightClass: 'h-[88px]' },
  { month: 'Dec', heightClass: 'h-[100px]' },
];

const TOP_MOVIES = [
  { title: 'Pushpa 2: The Rule', bookings: 0, revenue: '₹0', rating: '8.2' },
  { title: 'Devara', bookings: 0, revenue: '₹0', rating: '7.1' },
  { title: 'Kalki 2898 AD', bookings: 0, revenue: '₹0', rating: '7.8' },
  { title: 'Stree 2', bookings: 0, revenue: '₹0', rating: '8.0' },
  { title: 'Singham Returns', bookings: 0, revenue: '₹0', rating: '6.5' },
];

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Reports</h1>
          <p className="text-text-muted text-sm font-sans">Platform analytics and performance overview.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="p-5 rounded-xl bg-bg-surface border border-border-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs font-sans font-medium ${stat.trendUp ? 'text-semantic-success' : 'text-text-muted'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="font-display font-bold text-2xl text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted font-sans mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="p-6 rounded-xl bg-bg-surface border border-border-default mb-8">
          <h2 className="font-display font-semibold text-base text-text-primary mb-6">Revenue by Month (Demo)</h2>
          <div className="flex items-end gap-2 h-40">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t bg-gradient-to-t from-accent-indigo to-accent-purple opacity-80 hover:opacity-100 transition-opacity ${d.heightClass}`}
                />
                <span className="text-[10px] text-text-muted font-sans">{d.month}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted font-sans mt-4 text-center">
            Live revenue data will appear here once bookings are processed.
          </p>
        </div>

        {/* Top Movies Table */}
        <div className="rounded-xl border border-border-default overflow-hidden">
          <div className="px-5 py-4 bg-bg-surface border-b border-border-default">
            <h2 className="font-display font-semibold text-base text-text-primary">Top Movies</h2>
          </div>
          <table className="w-full text-sm font-sans">
            <thead className="bg-bg-surface2 border-b border-border-default">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Movie</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Bookings</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">IMDB</th>
              </tr>
            </thead>
            <tbody>
              {TOP_MOVIES.map((movie, idx) => (
                <tr key={movie.title} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                  <td className="px-4 py-3 text-text-muted font-semibold">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{movie.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{movie.bookings}</td>
                  <td className="px-4 py-3 text-text-secondary">{movie.revenue}</td>
                  <td className="px-4 py-3 text-text-secondary">{movie.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
