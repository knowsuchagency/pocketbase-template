import { useEffect } from 'react';
import { useAuthStore } from '~/stores/auth.store';
import { useAppStore } from '~/stores/app.store';
import { Button } from '~/components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/components/ui/card';
import { useNavigate } from 'react-router';
import type { Route } from './+types/dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard - PocketBase Template' },
    { name: 'description', content: 'User dashboard' },
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const addNotification = useAppStore((state) => state.addNotification);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    addNotification({
      type: 'info',
      title: 'Logged out',
      message: 'You have been logged out successfully',
    });
    navigate('/');
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              You are logged in as {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is a protected dashboard page. Only authenticated users can see this content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}