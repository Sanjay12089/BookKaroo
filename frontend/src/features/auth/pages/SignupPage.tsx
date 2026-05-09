import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { SignupForm } from '../components/SignupForm';

export default function SignupPage() {
  return (
    <PublicLayout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2 tracking-tight">
              Create account
            </h1>
            <p className="text-text-muted font-sans text-sm">Join BookKaroo and start booking today.</p>
          </div>
          <div className="bg-bg-surface border border-border-default rounded-xl p-8 shadow-lg">
            <SignupForm />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
