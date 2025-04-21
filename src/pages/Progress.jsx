import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Progress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get courses from Redux store
  const courses = useSelector(state => state.courses.courses);
  
  useEffect(() => {
    // In a real app, you would fetch progress data from an API
    // For this demo, we'll generate some random progress data
    if (courses) {
      const mockProgress = courses.slice(0, 4).map(course => ({
        courseId: course.id,
        courseTitle: course.title,
        completionPercentage: Math.floor(Math.random() * 100),
        grades: [
          { assignment: 'Quiz 1', score: Math.floor(Math.random() * 30) + 70 },
          { assignment: 'Assignment 1', score: Math.floor(Math.random() * 30) + 70 },
          { assignment: 'Mid-term', score: Math.floor(Math.random() * 30) + 70 }
        ]
      }));
      
      setProgress(mockProgress);
      setLoading(false);
    }
  }, [courses]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {progress.map(item => (
          <Card key={item.courseId}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.courseTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Completion</span>
                  <span className="text-sm font-medium">{item.completionPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${item.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Grades</h4>
                {item.grades.map((grade, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{grade.assignment}</span>
                    <span className="font-medium">{grade.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 