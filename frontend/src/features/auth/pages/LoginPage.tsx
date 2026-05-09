import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <PublicLayout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-text-muted font-sans text-sm">Book the moment. Karo it now.</p>
          </div>
          <div className="bg-bg-surface border border-border-default rounded-xl p-8 shadow-lg">
            <LoginForm />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
