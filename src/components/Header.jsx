import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Bell, Menu } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../lib/auth-context';
import { cn } from '../lib/utils';

export function Header({ onOpenSidebar }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close user menu when clicking outside
  const handleClickOutside = () => {
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and mobile menu */}
        <div className="flex items-center space-x-3">
          {/* Hamburger menu for mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          
          {/* Logo (only shown on mobile) */}
          <div className="md:hidden">
            <Link to="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold text-primary">JamClef LMS</h1>
            </Link>
          </div>
        </div>

        {/* Search bar (placeholder) */}
        <div className="hidden md:flex flex-1 mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-3 pr-10 rounded-md bg-background border border-input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="absolute right-3 top-2.5 text-muted-foreground">
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* Theme switcher */}
          <ThemeSwitcher />

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full"
              onClick={toggleUserMenu}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name ? (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            </Button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-card rounded-md border border-border shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="border-t border-border pt-2">
                    <Link
                      to="/profile"
                      className={cn(
                        'flex items-center px-4 py-2 text-sm hover:bg-accent rounded-md'
                      )}
                      onClick={handleClickOutside}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className={cn(
                        'flex items-center px-4 py-2 text-sm hover:bg-accent rounded-md'
                      )}
                      onClick={handleClickOutside}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      className={cn(
                        'flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-accent rounded-md'
                      )}
                      onClick={() => {
                        logout();
                        handleClickOutside();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 