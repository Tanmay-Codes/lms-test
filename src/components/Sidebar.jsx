import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  BookOpen, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings, 
  Award, 
  DollarSign, 
  X, 
  GraduationCap,
  UserCheck,
  Activity,
  FolderOpen,
  ClipboardCheck,
  Music
} from 'lucide-react';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/ScrollArea';

// Navigation items by role
const roleNavItems = {
  admin: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: 'Courses',
      href: '/courses',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: 'Schedule',
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Student Management',
      href: '/student-management',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: 'Teacher Management',
      href: '/teacher-management',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Course Management',
      href: '/course-management',
      icon: <FolderOpen className="h-5 w-5" />,
    },
    {
      title: 'Assessments',
      href: '/assessments',
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Revenue',
      href: '/revenue',
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: 'Discussions',
      href: '/discussions',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: <Music className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ],
  teacher: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: 'My Courses',
      href: '/courses',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: 'Schedule',
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Assignments',
      href: '/assignments',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Students',
      href: '/student-management',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: 'Course Management',
      href: '/course-management',
      icon: <FolderOpen className="h-5 w-5" />,
    },
    {
      title: 'Assessments',
      href: '/assessments',
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: 'Discussions',
      href: '/discussions',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: <Music className="h-5 w-5" />,
    },
  ],
  student: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: 'Courses',
      href: '/courses',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: 'My Schedule',
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Assignments',
      href: '/assignments',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Discussion Forums',
      href: '/discussions',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'My Progress',
      href: '/progress',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: <Music className="h-5 w-5" />,
    },
    {
      title: 'Certificates',
      href: '/certificates',
      icon: <Award className="h-5 w-5" />,
    },
  ],
  proctor: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: 'Assessments',
      href: '/assessments',
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: 'Proctoring',
      href: '/proctoring',
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      title: 'Schedule',
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Students',
      href: '/student-management',
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ],
};

export function Sidebar({ onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const [navItems, setNavItems] = useState([]);
  
  // Set navigation items based on user role
  useEffect(() => {
    console.log("User in Sidebar:", user);
    if (user && user.role) {
      const items = roleNavItems[user.role];
      if (items) {
        setNavItems(items);
      } else {
        // Fallback to general navigation if role not found
        setNavItems(roleNavItems.student || []);
        console.warn(`Role '${user.role}' not found in navigation items, using fallback.`);
      }
    } else {
      // Default to an empty array if user or role is undefined
      setNavItems([]);
    }
  }, [user]);

  // If user is not authenticated, don't render the sidebar
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Mobile: Close button */}
      {onClose && (
        <div className="flex items-center justify-between p-4 md:hidden">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="font-bold">Jamclef LMS</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
      )}
      
      {/* Logo - desktop only */}
      <div className={cn(
        "flex h-16 items-center border-b border-border px-4",
        onClose ? "hidden" : "flex"
      )}>
        <Link to="/dashboard" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span className="font-bold">Jamclef LMS</span>
        </Link>
      </div>
      
      {/* Navigation items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
              onClick={onClose && (() => onClose())}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      
      {/* User info at bottom */}
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center">
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 