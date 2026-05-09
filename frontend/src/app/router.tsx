import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Skeleton } from '@/shared/components/ui/Skeleton';

// ── Page-shape skeleton fallback ──────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 space-y-6">
      <Skeleton height={56} width="40%" />
      <Skeleton height={24} width="60%" />
      <div className="grid grid-cols-4 gap-4 mt-8">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] rounded-lg" />
            <Skeleton height={14} width="80%" />
          </div>
        ))}
      </div>
    </div>
  );
}

function S(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  );
}

// ── Lazy imports ──────────────────────────────────────────────────────────────
const HomePage           = lazy(() => import('@/features/home/pages/HomePage'));
const MoviesPage         = lazy(() => import('@/features/movies/pages/MoviesPage'));
const MovieDetailPage    = lazy(() => import('@/features/movies/pages/MovieDetailPage'));
const ShowtimesPage      = lazy(() => import('@/features/movies/pages/ShowtimesPage'));
const EventsPage         = lazy(() => import('@/features/events/pages/EventsPage'));
const EventDetailPage    = lazy(() => import('@/features/events/pages/EventDetailPage'));
const IplPage            = lazy(() => import('@/features/events/pages/IplPage'));
const SearchResultsPage  = lazy(() => import('@/features/search/pages/SearchResultsPage'));
const LoginPage          = lazy(() => import('@/features/auth/pages/LoginPage'));
const SignupPage          = lazy(() => import('@/features/auth/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const HelpPage           = lazy(() => import('@/features/help/pages/HelpPage'));
// Protected
const SeatSelectionPage  = lazy(() => import('@/features/booking/pages/SeatSelectionPage'));
const CheckoutPage       = lazy(() => import('@/features/booking/pages/CheckoutPage'));
const ConfirmationPage   = lazy(() => import('@/features/booking/pages/ConfirmationPage'));
const ProfilePage        = lazy(() => import('@/features/profile/pages/ProfilePage'));
const MyBookingsPage     = lazy(() => import('@/features/profile/pages/MyBookingsPage'));
// Admin
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminMoviesPage    = lazy(() => import('@/features/admin/pages/AdminMoviesPage'));
const AdminEventsPage    = lazy(() => import('@/features/admin/pages/AdminEventsPage'));
const AdminVenuesPage    = lazy(() => import('@/features/admin/pages/AdminVenuesPage'));
const AdminShowsPage     = lazy(() => import('@/features/admin/pages/AdminShowsPage'));
const AdminBookingsPage  = lazy(() => import('@/features/admin/pages/AdminBookingsPage'));
const AdminUsersPage     = lazy(() => import('@/features/admin/pages/AdminUsersPage'));
const AdminReportsPage   = lazy(() => import('@/features/admin/pages/AdminReportsPage'));
const AdminCmsPage       = lazy(() => import('@/features/admin/pages/AdminCmsPage'));
const AdminSettingsPage  = lazy(() => import('@/features/admin/pages/AdminSettingsPage'));
const StaticPage         = lazy(() => import('@/features/static/pages/StaticPage'));

// ── Guards ────────────────────────────────────────────────────────────────────
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminRoute() {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'Admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

// ── Router ────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Public
  { path: '/',                    element: S(HomePage) },
  { path: '/movies',              element: S(MoviesPage) },
  { path: '/movies/:slug',        element: S(MovieDetailPage) },
  { path: '/movies/:slug/showtimes', element: S(ShowtimesPage) },
  { path: '/events',              element: S(EventsPage) },
  { path: '/events/:slug',        element: S(EventDetailPage) },
  { path: '/sports',              element: S(EventsPage) },
  { path: '/plays',               element: S(EventsPage) },
  { path: '/activities',          element: S(EventsPage) },
  { path: '/ipl',                 element: S(IplPage) },
  { path: '/search',              element: S(SearchResultsPage) },
  { path: '/login',               element: S(LoginPage) },
  { path: '/signup',              element: S(SignupPage) },
  { path: '/forgot-password',     element: S(ForgotPasswordPage) },
  { path: '/help',                element: S(HelpPage) },

  // Protected
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/booking/:showId/seats', element: S(SeatSelectionPage) },
      { path: '/booking/checkout',      element: S(CheckoutPage) },
      { path: '/booking/confirmed',     element: S(ConfirmationPage) },
      { path: '/profile',               element: S(ProfilePage) },
      { path: '/profile/bookings',      element: S(MyBookingsPage) },
    ],
  },

  // Admin
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin',           element: S(AdminDashboardPage) },
      { path: '/admin/movies',    element: S(AdminMoviesPage) },
      { path: '/admin/events',    element: S(AdminEventsPage) },
      { path: '/admin/venues',    element: S(AdminVenuesPage) },
      { path: '/admin/shows',     element: S(AdminShowsPage) },
      { path: '/admin/bookings',  element: S(AdminBookingsPage) },
      { path: '/admin/users',     element: S(AdminUsersPage) },
      { path: '/admin/reports',   element: S(AdminReportsPage) },
      { path: '/admin/cms',       element: S(AdminCmsPage) },
      { path: '/admin/settings',  element: S(AdminSettingsPage) },
    ],
  },

  // Static pages (About, T&C, Privacy, etc.)
  { path: '/about',          element: S(StaticPage) },
  { path: '/careers',        element: S(StaticPage) },
  { path: '/list-your-show', element: S(StaticPage) },
  { path: '/blog',           element: S(StaticPage) },
  { path: '/terms',          element: S(StaticPage) },
  { path: '/privacy',        element: S(StaticPage) },
  { path: '/faq',            element: S(StaticPage) },
  { path: '/sitemap',        element: S(StaticPage) },
  { path: '/page/:slug',     element: S(StaticPage) },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);
