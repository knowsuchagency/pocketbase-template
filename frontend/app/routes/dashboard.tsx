import { useNavigate } from 'react-router';
import { useAuthStore } from '~/stores/auth.store';
import { useEffect } from 'react';

export function meta() {
  return [
    { title: "Dashboard - PocketBase App" },
    { name: "description", content: "User Dashboard" },
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Dashboard</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user.email}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome to your Dashboard!</h2>
            <p>You are successfully logged in.</p>
            <div className="divider"></div>
            <div>
              <h3 className="font-semibold mb-2">User Details:</h3>
              <p>Email: {user.email}</p>
              <p>ID: {user.id}</p>
              <p>Created: {new Date(user.created).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}