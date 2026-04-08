'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/auth';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setLoading, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock login logic - this would call authService in a real app
    try {
      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
      };
      
      setAuth(mockUser, 'mock-jwt-token');
      router.push(ROUTES.DASHBOARD.ROOT);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        placeholder="name@company.com"
        required
        leftIcon={<Mail className="h-4 w-4" />}
        autoComplete="email"
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        leftIcon={<Lock className="h-4 w-4" />}
        autoComplete="current-password"
      />

      {error && (
        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-600 font-medium animate-in fade-in zoom-in-95">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-yellow-500 focus:ring-brand-yellow-500" />
          <span className="text-sm text-slate-500 group-hover:text-slate-700 select-none">Remember for 30 days</span>
        </label>
        <div className="text-sm font-semibold text-brand-yellow-600 hover:text-brand-yellow-700 cursor-pointer">
          Forgot password?
        </div>
      </div>

      <Button
        className="w-full"
        type="submit"
        isLoading={isLoading}
        rightIcon={<LogIn className="h-4 w-4" />}
      >
        Sign in to platform
      </Button>
    </form>
  );
}
