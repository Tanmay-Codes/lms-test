import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../lib/auth-context';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get course from Redux store
  const courses = useSelector(state => state.courses.courses);
  
  useEffect(() => {
    // Find course by ID
    const foundCourse = courses.find(c => c.id === parseInt(id, 10));
    
    if (foundCourse) {
      setCourse(foundCourse);
    }
    
    setLoading(false);
  }, [id, courses]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <p className="text-muted-foreground">The course you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-1">Instructor: {course.instructor}</p>
        </div>
        <Badge>{course.status}</Badge>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Syllabus</CardTitle>
              <CardDescription>Course content and structure</CardDescription>
            </CardHeader>
            <CardContent>
              {course.syllabus && course.syllabus.length > 0 ? (
                <ul className="space-y-4">
                  {course.syllabus.map((week) => (
                    <li key={week.week} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium">Week {week.week}: {week.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{week.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Syllabus information is not available.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Level</h3>
                <p>{course.level}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Duration</h3>
                <p>{course.duration}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Type</h3>
                <p>{course.courseType === 'group' ? 'Group Course' : 'Private Lessons'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Schedule</h3>
                {course.schedule ? (
                  <div>
                    <p className="text-sm">{course.schedule.days.join(', ')}</p>
                    <p className="text-sm">{course.schedule.time}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Schedule not available</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium">Price</h3>
                <p className="text-lg font-bold">
                  ${course.price.toFixed(2)}
                  {course.courseType === 'solo' && <span className="text-xs font-normal">/hour</span>}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {user?.role === 'student' && (
            <Button className="w-full">Enroll in Course</Button>
          )}
        </div>
      </div>
    </div>
  );
} 