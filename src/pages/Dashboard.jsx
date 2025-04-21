import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../lib/auth-context';
import { createSelector } from '@reduxjs/toolkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  AlertCircle, 
  BarChart, 
  BookOpen, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  GraduationCap, 
  Music, 
  Users 
} from 'lucide-react';
import { fetchCoursesSuccess } from '../lib/redux/slices/coursesSlice';
import { fetchSchedulesSuccess } from '../lib/redux/slices/schedulesSlice';
import { fetchAssignmentsSuccess } from '../lib/redux/slices/assignmentsSlice';
import { courses, schedules, assignments, studentProgress } from '../lib/dummyData';
import { CourseCard } from '../components/CourseCard';

// Creating memoized selectors
const selectActiveCoursesSelector = createSelector(
  [(state) => state.courses.courses],
  (courses) => courses.filter(course => course.status === 'active')
);

const selectUpcomingSchedulesSelector = createSelector(
  [(state) => state.schedules.schedules],
  (schedules) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return schedules
      .filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= today && scheduleDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }
);

export function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  // Load initial data from dummy data when component mounts
  useEffect(() => {
    dispatch(fetchCoursesSuccess(courses));
    dispatch(fetchSchedulesSuccess(schedules));
    dispatch(fetchAssignmentsSuccess(assignments));
  }, [dispatch]);
  
  // Using memoized selectors
  const activeCourses = useSelector(selectActiveCoursesSelector);
  const upcomingSchedules = useSelector(selectUpcomingSchedulesSelector);
  
  // Create dynamic selectors based on user
  const pendingAssignmentsSelector = useMemo(() => 
    createSelector(
      [(state) => state.assignments.assignments],
      (assignments) => {
        if (!user) return [];
        
        if (user.role === 'student') {
          return assignments.filter(assignment => {
            // Check if student has submitted this assignment
            const submitted = assignment.submissions && 
              assignment.submissions.some(submission => submission.studentId === user.id);
            
            return !submitted && new Date(assignment.dueDate) > new Date();
          });
        } else if (user.role === 'teacher') {
          // Get assignments that need grading
          return assignments.filter(assignment => {
            return assignment.submissions && 
              assignment.submissions.some(submission => !submission.grade);
          });
        }
        return [];
      }
    ), [user?.id, user?.role]
  );
  
  const pendingAssignments = useSelector(pendingAssignmentsSelector);
  
  // Get student progress if user is a student
  const studentProgressData = useMemo(() => {
    if (!user || user.role !== 'student') return null;
    return studentProgress.find(p => p.studentId === user.id);
  }, [user?.id, user?.role]);
  
  const renderDashboardOverview = () => {
    // Common cards for all users
    const commonCards = (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSchedules.length}</div>
            <p className="text-xs text-muted-foreground">Classes in next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses.length}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled/teaching</p>
          </CardContent>
        </Card>
      </>
    );
    
    // Admin specific cards
    if (user && user.role === 'admin') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {commonCards}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">Total active students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Total active teachers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,500</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Course completion rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Lessons</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">243</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Open tickets</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Teacher specific cards
    if (user && user.role === 'teacher') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {commonCards}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58</div>
              <p className="text-xs text-muted-foreground">Active in your courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Waiting for review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Overall attendance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student Retention</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">Student retention rate</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Student specific cards
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {commonCards}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Pending submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentProgressData && studentProgressData.courses.length > 0
                ? `${studentProgressData.courses.reduce((acc, course) => 
                    acc + (course.overallGrade || 0), 0) / studentProgressData.courses.length}%`
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderUpcomingSchedule = () => {
    if (upcomingSchedules.length === 0) {
      return (
        <p className="text-muted-foreground py-4">No upcoming classes scheduled</p>
      );
    }
    
    return (
      <div className="space-y-4">
        {upcomingSchedules.slice(0, 3).map((schedule) => (
          <div key={schedule.id} className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0">
            <div>
              <h4 className="font-medium">{schedule.title}</h4>
              <p className="text-sm text-muted-foreground">{schedule.time} • {schedule.location}</p>
            </div>
            <div className="text-sm text-right">
              {new Date(schedule.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderPendingAssignments = () => {
    if (pendingAssignments.length === 0) {
      return (
        <p className="text-muted-foreground py-4">No pending assignments</p>
      );
    }
    
    return (
      <div className="space-y-4">
        {pendingAssignments.slice(0, 3).map((assignment) => (
          <div key={assignment.id} className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0">
            <div>
              <h4 className="font-medium">{assignment.title}</h4>
              <p className="text-sm text-muted-foreground">
                {user.role === 'student' 
                  ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`
                  : `${assignment.submissions?.length || 0} submissions to review`}
              </p>
            </div>
            <div className="text-sm">
              {user.role === 'student' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-700">
                  {Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const getTabsForUserRole = () => {
    if (user && user.role === 'admin') {
      return (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{renderDashboardOverview()}</TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics will be displayed here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  Analytics Visualization Placeholder
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Financial data and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  Revenue Charts Placeholder
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      );
    }
    
    if (user && user.role === 'teacher') {
      return (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{renderDashboardOverview()}</TabsContent>
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>
                  Track your students' progress and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  Performance Metrics Placeholder
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      );
    }
    
    return (
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">{renderDashboardOverview()}</TabsContent>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Progress</CardTitle>
              <CardDescription>
                Track your progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                Progress Visualization Placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}</p>
      </div>
      
      {getTabsForUserRole()}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Courses you're currently enrolled in or teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {activeCourses.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Your classes for the next few days</CardDescription>
            </CardHeader>
            <CardContent>
              {renderUpcomingSchedule()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {user.role === 'student' ? 'Pending Assignments' : 'Assignments to Review'}
              </CardTitle>
              <CardDescription>
                {user.role === 'student' 
                  ? 'Assignments due soon' 
                  : 'Student submissions waiting for review'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderPendingAssignments()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 