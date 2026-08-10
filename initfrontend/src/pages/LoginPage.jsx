import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { extractAuthError } from '@/services/authService';
import { getDashboardPath } from '@/utils/helpers';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const authData = await login(data);
      toast.success('Authentication successful', {
        description: 'Welcome back. Redirecting to workstation...',
      });
      window.location.href = getDashboardPath(authData.role);
    } catch (error) {
      toast.error('Login failed', {
        description: extractAuthError(error),
      });
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Enter your credentials to access the investigation workstation"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="operator@agency.gov"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <p className="text-center text-xs text-muted">
          No account?{' '}
          <Link to="/register" className="text-accent hover:underline">
            Register new operator
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
