import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { api } from '@/shared/lib/api';
import type { User, PaginatedResponse, UserRole } from '@/shared/types';

type ApiError = { response?: { status?: number }; statusCode?: number };

const ROLE_BADGE: Record<UserRole, string> = {
  Admin: 'bg-accent-purple/12 text-accent-purple',
  User: 'bg-bg-surface3 text-text-muted',
};

export default function AdminUsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () =>
      api.get<PaginatedResponse<User>>('/api/admin/users').then((r) => r.data),
    retry: false,
  });

  const is501 =
    (error as ApiError | null)?.response?.status === 501 ||
    (error as ApiError | null)?.statusCode === 501;

  const users: User[] = Array.isArray(data)
    ? (data as User[])
    : ((data as PaginatedResponse<User> | undefined)?.items ?? []);

  const showEmpty = is501 || (!isLoading && !error && users.length === 0);
  const showError = !isLoading && !!error && !is501;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl mb-1 tracking-tight">Users</h1>
            <p className="text-text-muted text-sm font-sans">Manage registered users and their access.</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64 text-text-muted text-sm font-sans">
            Loading users…
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-4xl">👥</p>
            <p className="text-text-secondary font-sans text-base">No users found.</p>
          </div>
        )}

        {showError && (
          <div className="flex items-center justify-center h-64 text-semantic-error text-sm font-sans">
            Failed to load users. Please try again.
          </div>
        )}

        {!isLoading && !showEmpty && !showError && users.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full text-sm font-sans">
              <thead className="bg-bg-surface2 border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mobile</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Verified</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border-default hover:bg-bg-surface2/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{user.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3 text-text-secondary">{user.mobile}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_BADGE[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          user.emailVerified
                            ? 'bg-semantic-success/15 text-semantic-success'
                            : 'bg-amber-500/15 text-amber-400'
                        }`}
                      >
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled
                        className="text-xs text-semantic-error opacity-40 cursor-not-allowed font-semibold border border-semantic-error/30 px-2 py-0.5 rounded"
                      >
                        Block
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
