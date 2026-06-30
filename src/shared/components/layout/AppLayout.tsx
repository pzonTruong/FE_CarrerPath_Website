import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { authApi } from '@/modules/auth/api/auth.api';
import { tokenStore } from '@/modules/auth/store/token.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { CurrentUser } from '@/modules/auth/types/auth.types';

export const AppLayout = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = tokenStore.get();
    if (token) {
      authApi.getMe()
        .then((res) => {
          if (res?.data) {
            const userData = res.data as CurrentUser;
            setUser((prev) => (prev?.email === userData.email ? prev : userData));
          }
        })
        .catch(() => {
          tokenStore.clear();
          setTimeout(() => setUser(null), 0);
        });
    } else {
      setTimeout(() => setUser(null), 0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    tokenStore.clear();
    setUser(null);
    navigate('/login');
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';

  const isGuest = !user;

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/roadmap', label: 'Roadmaps' },
    { to: '/features', label: 'Features' },
    { to: '/contact', label: 'Contact' },
  ];

  if (!isGuest) {
    navItems.push({ to: '/dashboard', label: 'Dashboard' });
    navItems.push({ to: '/profile', label: 'Profile' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b-2 border-foreground bg-card text-card-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-sm font-extrabold tracking-wider uppercase">
            <span className="bg-primary text-primary-foreground px-2 py-1 border border-foreground rounded-[2px] font-mono">
              PATH
            </span>
            <span className="hidden sm:inline font-mono">roadmap.dev</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'px-2.5 py-1.5 text-xs uppercase tracking-wider font-mono border border-transparent transition-all rounded-[2px]',
                  location.pathname === item.to
                    ? 'bg-primary text-primary-foreground border-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isGuest ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="px-2.5 py-1.5 text-xs uppercase tracking-wider font-mono border border-foreground bg-background hover:bg-muted transition-all rounded-[2px]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-block px-2.5 py-1.5 text-xs uppercase tracking-wider font-mono border border-foreground bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-[2px]"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar className="size-8 rounded-[2px] border border-foreground">
                  <AvatarImage src={user?.avatarUrl} alt={user?.email} className="rounded-[2px]" />
                  <AvatarFallback className="text-xs font-mono font-bold rounded-[2px] bg-muted">{initials}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border border-foreground px-2.5 py-1.5 text-xs uppercase tracking-wider font-mono h-8 rounded-[2px] cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      {/* Clean Footer */}
      <footer className="border-t-2 border-foreground bg-card text-card-foreground py-8 mt-auto">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-sm font-mono font-bold">roadmap.dev</p>
            <p className="text-xs text-muted-foreground mt-1">
              Developer-centric paths to coding mastery. REDESIGNED.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-mono uppercase tracking-wider">
            <Link to="/" className="hover:underline text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/roadmap" className="hover:underline text-muted-foreground hover:text-foreground">Roadmaps</Link>
            <Link to="/features" className="hover:underline text-muted-foreground hover:text-foreground">Features</Link>
            <Link to="/contact" className="hover:underline text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} roadmap.dev
          </div>
        </div>
      </footer>
    </div>
  );
};
