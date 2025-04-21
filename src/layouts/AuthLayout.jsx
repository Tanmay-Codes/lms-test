import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Theme switcher in top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      <div className="flex min-h-screen flex-col">
        {/* Left side (logo and background) */}
        <div className="flex min-h-screen">
          <div className="hidden w-1/2 flex-col justify-between bg-muted p-12 lg:flex">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span className="text-2xl font-bold">Jamclef LMS</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">
                Your Musical Journey Begins Here
              </h1>
              <p className="text-muted-foreground">
                Jamclef LMS is a comprehensive learning management system designed specifically for
                music education. Whether you're a student looking to master an instrument or a
                teacher sharing your musical knowledge, we provide the tools you need to succeed.
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Interactive lessons with professional instructors
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Personalized practice plans and progress tracking
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Music theory, instrument technique, and performance skills
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    Group and private lessons to match your learning style
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Jamclef Music Education, Inc. All rights reserved.
            </p>
          </div>
          
          {/* Right side (auth form) */}
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
} 