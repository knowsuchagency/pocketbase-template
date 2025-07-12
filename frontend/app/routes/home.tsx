import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LoginForm } from '~/components/LoginForm';
import { useAuthStore } from '~/stores/auth.store';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login - PocketBase Template' },
    { name: 'description', content: 'Login to your account' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <LoginForm />
    </div>
  );
}