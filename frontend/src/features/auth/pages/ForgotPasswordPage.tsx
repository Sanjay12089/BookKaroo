import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { ROUTES } from '@/shared/constants';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-page">
      <div className="w-full max-w-md">
        {/* Back + Logo */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to={ROUTES.LOGIN}
            className="p-2 rounded-full hover:bg-card border border-transparent hover:border-border-l transition-colors text-tx-muted hover:text-tx-primary"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="font-display font-bold text-xl text-tx-primary">
            Book<span className="text-brand">Karoo</span>
          </span>
        </div>

        <div className="bg-card border border-border-l rounded-2xl p-8 shadow-sm">
          <h1 className="font-display font-semibold text-2xl text-tx-primary mb-1.5 tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-tx-muted font-sans text-sm mb-6">
            Enter your registered email address and we'll send you a reset link.
          </p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
