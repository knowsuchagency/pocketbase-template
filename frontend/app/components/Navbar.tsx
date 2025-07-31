import { Link, useLocation } from "react-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useAuth } from "~/hooks";
import { Button } from "~/components/ui/button";

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">PocketBase Template</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAuthenticated ? (
            <>
              {location.pathname !== "/dashboard" && (
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              )}
              <Button variant="ghost" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            location.pathname !== "/" && (
              <Button variant="ghost" asChild>
                <Link to="/">Login</Link>
              </Button>
            )
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}