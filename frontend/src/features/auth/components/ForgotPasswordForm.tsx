import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { ROUTES } from '@/shared/constants';
import { useForgotPassword } from '../api/useAuth';

const schema = z.object({ email: z.string().email('Invalid email') });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(({ email }) => forgotPassword(email))} className="space-y-4">
      <Input label="Email address" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Button type="submit" fullWidth loading={isPending} size="lg">
        Send Reset Link
      </Button>
      <p className="text-center text-sm text-text-muted font-sans">
        <Link to={ROUTES.LOGIN} className="text-accent-indigo hover:underline">← Back to Sign In</Link>
      </p>
    </form>
  );
}
