import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { ROUTES } from '@/shared/constants';
import { useLogin } from '../api/useAuth';

const schema = z.object({
  identifier: z.string().min(1, 'Email or mobile is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
      <Input
        label="Email or Mobile"
        autoComplete="username"
        error={errors.identifier?.message}
        {...register('identifier')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-end">
        <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-accent-indigo hover:underline font-sans">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth loading={isPending} size="lg">
        Sign In
      </Button>

      <p className="text-center text-sm text-text-muted font-sans">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-accent-indigo hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
