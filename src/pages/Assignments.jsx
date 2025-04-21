import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../lib/auth-context';

export function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get assignments from Redux store
  const storeAssignments = useSelector(state => state.assignments.assignments);
  
  useEffect(() => {
    // Filter assignments based on user role
    if (user && storeAssignments) {
      if (user.role === 'student') {
        // For students, show assignments relevant to their courses
        setAssignments(storeAssignments.filter(assignment => 
          assignment.courseId && assignment.courseId === user.courseId
        ));
      } else if (user.role === 'teacher') {
        // For teachers, show assignments they created
        setAssignments(storeAssignments.filter(assignment => 
          assignment.teacherId && assignment.teacherId === user.id
        ));
      } else {
        // For admin, show all assignments
        setAssignments(storeAssignments);
      }
      setLoading(false);
    }
  }, [user, storeAssignments]);
  
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
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">View and manage your assignments</p>
      </div>
      
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">No assignments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{assignment.description}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 