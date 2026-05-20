import { PartnerLayout } from '../components/PartnerLayout';
import { usePartnerDashboard } from '../api/usePartner';
import { SimpleBarChart } from '@/features/admin/components/SimpleBarChart';
import { HorizontalBarChart } from '@/features/admin/components/HorizontalBarChart';
import { Skeleton } from '@/shared/components/ui/Skeleton';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-base p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function PartnerReportsPage() {
  const { data, isLoading, isError, refetch } = usePartnerDashboard();

  return (
    <PartnerLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-text-primary">Reports</h1>
          <p className="text-sm text-text-secondary mt-1">Revenue and booking performance for your venues.</p>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height={220} />)}
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-semantic-error/30 bg-semantic-error/08 p-4 text-sm text-semantic-error flex items-center justify-between">
            <span>Failed to load report data.</span>
            <button onClick={() => refetch()} className="underline hover:opacity-80">Retry</button>
          </div>
        )}

        {data && (
          <>
            {/* KPI summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Today\'s Revenue',    value: fmt(data.todayRevenue)    },
                { label: 'This Week',           value: fmt(data.weekRevenue)     },
                { label: 'This Month',          value: fmt(data.monthRevenue)    },
                { label: 'Avg Occupancy',       value: `${data.occupancyRate.toFixed(1)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-border-default bg-bg-base p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wide">{label}</p>
                  <p className="text-2xl font-display font-bold text-text-primary mt-1 tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Daily Bookings — Last 7 Days">
                {data.bookingsPerDay.length > 0 ? (
                  <SimpleBarChart
                    data={data.bookingsPerDay.map((d) => ({ label: d.date.slice(5), value: d.count }))}
                    color="#6366F1"
                    height={180}
                    showValues
                  />
                ) : (
                  <p className="text-sm text-text-muted text-center py-8">No booking data yet.</p>
                )}
              </Card>

              <Card title="Revenue by Venue">
                {data.revenuePerVenue.length > 0 ? (
                  <HorizontalBarChart
                    data={data.revenuePerVenue.map((v) => ({ label: v.venueName, value: v.revenue }))}
                    color="#6366F1"
                    formatValue={fmt}
                  />
                ) : (
                  <p className="text-sm text-text-muted text-center py-8">No venue revenue yet.</p>
                )}
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Bookings (All Time)', value: data.totalBookingsAllTime.toString() },
                { label: 'Upcoming Shows (7d)',        value: data.upcomingShows.toString()        },
                { label: 'Today\'s Bookings',         value: data.todayBookings.toString()        },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-border-default bg-bg-base p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wide">{label}</p>
                  <p className="text-3xl font-display font-bold text-text-primary mt-1 tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PartnerLayout>
  );
}
