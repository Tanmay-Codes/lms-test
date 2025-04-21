import {
  Home,
  BookOpen,
  Calendar,
  Users,
  Settings,
  BarChart2,
  FileText,
  MessageSquare,
  CheckSquare,
  Award,
  Briefcase,
  Clock,
} from 'lucide-react';

// Define all sidebar menu items with their access controls
export const sidebarConfig = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    // Everyone can access the dashboard
    roles: ['admin', 'instructor', 'student'],
  },
  {
    title: 'Courses',
    icon: BookOpen,
    path: '/courses',
    // Everyone can view courses
    roles: ['admin', 'instructor', 'student'],
  },
  {
    title: 'Schedule',
    icon: Calendar,
    path: '/schedule',
    // Everyone can view the schedule
    roles: ['admin', 'instructor', 'student'],
  },
  {
    title: 'Assignments',
    icon: CheckSquare,
    path: '/assignments',
    // Everyone can view assignments
    roles: ['admin', 'instructor', 'student'],
  },
  {
    title: 'Discussions',
    icon: MessageSquare,
    path: '/discussions',
    // Everyone can participate in discussions
    roles: ['admin', 'instructor', 'student'],
  },
  {
    title: 'Progress',
    icon: BarChart2,
    path: '/progress',
    // Students can view their progress
    roles: ['student'],
  },
  {
    title: 'Certificates',
    icon: Award,
    path: '/certificates',
    // Students can view their certificates
    roles: ['student'],
  },
  {
    title: 'Course Management',
    icon: Briefcase,
    path: '/course-management',
    // Only instructors and admins can manage courses
    roles: ['admin', 'instructor'],
  },
  {
    title: 'Student Management',
    icon: Users,
    path: '/student-management',
    // Only instructors and admins can manage students
    roles: ['admin', 'instructor'],
  },
  {
    title: 'Reports',
    icon: FileText,
    path: '/reports',
    // Only admins can view all reports
    roles: ['admin'],
  },
  {
    title: 'System Settings',
    icon: Settings,
    path: '/settings',
    // Only admins can change system settings
    roles: ['admin'],
  },
  {
    title: 'Activity Logs',
    icon: Clock,
    path: '/logs',
    // Only admins can view logs
    roles: ['admin'],
  },
];

/**
 * Filter sidebar items based on user role
 * @param {string} userRole - The role of the current user
 * @returns {Array} - Filtered sidebar items
 */
export const getFilteredSidebarItems = (userRole) => {
  if (!userRole) return [];
  
  return sidebarConfig.filter(item => 
    item.roles.includes(userRole)
  );
};