import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <PublicLayout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2 tracking-tight">
              Forgot password?
            </h1>
            <p className="text-text-muted font-sans text-sm">Enter your email and we'll send a reset link.</p>
          </div>
          <div className="bg-bg-surface border border-border-default rounded-xl p-8 shadow-lg">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
