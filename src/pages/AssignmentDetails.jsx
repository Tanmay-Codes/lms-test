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

export function AssignmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get assignments from Redux store
  const assignments = useSelector(state => state.assignments.assignments);
  
  useEffect(() => {
    // Find assignment by ID
    const foundAssignment = assignments.find(a => a.id === parseInt(id, 10));
    
    if (foundAssignment) {
      setAssignment(foundAssignment);
    }
    
    setLoading(false);
  }, [id, assignments]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!assignment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Assignment Not Found</h2>
        <p className="text-muted-foreground">The assignment you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-muted-foreground mt-1">Course: {assignment.courseName || 'N/A'}</p>
        </div>
        <Badge>{new Date(assignment.dueDate) > new Date() ? 'Active' : 'Past Due'}</Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{assignment.description}</p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submission</CardTitle>
              <CardDescription>
                {user.role === 'student' ? 'Submit your work here' : 'Student submissions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.role === 'student' ? (
                <div className="text-center py-8">
                  <p className="mb-4">You haven't submitted this assignment yet</p>
                  <Button>Submit Assignment</Button>
                </div>
              ) : (
                <p className="text-muted-foreground py-4">No submissions yet</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Due Date</h3>
                <p>{new Date(assignment.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <p>{new Date(assignment.dueDate) > new Date() ? 'Active' : 'Past Due'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Points</h3>
                <p>{assignment.points || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 