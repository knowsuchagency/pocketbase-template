import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LoginForm } from '~/components/LoginForm';
import { useAuth } from '~/hooks';
import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login - PocketBase Template' },
    { name: 'description', content: 'Login to your account' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <LoginForm />
    </div>
  );
}
