import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');

  const [analyticsSummary] = useState({
    totalStudents: 128,
    activeStudents: 112,
    totalCourses: 24,
    completionRate: 87,
    engagementRate: 92,
    averageGrade: 85,
    studentRetention: 94,
    userGrowth: [
      { month: 'Jan', count: 95 },
      { month: 'Feb', count: 103 },
      { month: 'Mar', count: 111 },
      { month: 'Apr', count: 118 },
      { month: 'May', count: 124 },
      { month: 'Jun', count: 128 },
    ],
    courseCompletions: [
      { course: 'Piano Beginner', completed: 18, enrolled: 22 },
      { course: 'Music Theory', completed: 24, enrolled: 30 },
      { course: 'Guitar Basics', completed: 16, enrolled: 18 },
      { course: 'Violin Fundamentals', completed: 12, enrolled: 15 },
      { course: 'Vocal Training', completed: 9, enrolled: 12 },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and user engagement metrics</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => {}}
          >
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 pb-4 border-b mb-6">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
          className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary"
          data-state={activeTab === 'overview' ? 'active' : 'inactive'}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'students' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('students')}
          className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary"
          data-state={activeTab === 'students' ? 'active' : 'inactive'}
        >
          Students
        </Button>
        <Button
          variant={activeTab === 'courses' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('courses')}
          className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary"
          data-state={activeTab === 'courses' ? 'active' : 'inactive'}
        >
          Courses
        </Button>
        <Button
          variant={activeTab === 'revenue' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('revenue')}
          className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary"
          data-state={activeTab === 'revenue' ? 'active' : 'inactive'}
        >
          Revenue
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsSummary.totalStudents}</div>
            <p className="text-xs text-muted-foreground">{analyticsSummary.activeStudents} active students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsSummary.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Average completion rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsSummary.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">Student engagement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsSummary.studentRetention}%</div>
            <p className="text-xs text-muted-foreground">Student retention rate</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Student registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full flex flex-col justify-center items-center space-y-2 text-muted-foreground">
              <p>User Growth Visualization</p>
              <p className="text-sm">(Chart component would display here)</p>
              <div className="flex h-40 w-full items-end gap-2 justify-center">
                {analyticsSummary.userGrowth.map((item, index) => (
                  <div key={index} className="relative w-12">
                    <div 
                      className="bg-primary/90 rounded-t-md w-full" 
                      style={{ 
                        height: `${(item.count / analyticsSummary.totalStudents) * 150}px`,
                        maxHeight: '130px',
                        minHeight: '30px'
                      }}
                    />
                    <span className="text-xs mt-1 block text-center">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Course Completions</CardTitle>
            <CardDescription>Completion rates by course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analyticsSummary.courseCompletions.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{course.course}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.completed} of {course.enrolled} students completed
                      </p>
                    </div>
                    <div className="font-bold">
                      {Math.round((course.completed / course.enrolled) * 100)}%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 