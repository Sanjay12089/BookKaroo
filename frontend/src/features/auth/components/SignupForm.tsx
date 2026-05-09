import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { ROUTES } from '@/shared/constants';
import { useSignup } from '../api/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid mobile number'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
});

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const { mutate: signup, isPending } = useSignup();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => signup(data))} className="space-y-4">
      <Input label="Full Name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input label="Mobile" type="tel" error={errors.mobile?.message} {...register('mobile')} />
      <Input label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />

      <Button type="submit" fullWidth loading={isPending} size="lg">
        Create Account
      </Button>

      <p className="text-center text-sm text-text-muted font-sans">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-accent-indigo hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
