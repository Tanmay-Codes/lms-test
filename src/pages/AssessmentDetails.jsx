import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

export function AssessmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch assessment details from an API
    // For this demo, we'll use mock data
    setTimeout(() => {
      setAssessment({
        id: parseInt(id, 10),
        title: 'Music Theory Fundamentals',
        description: 'A comprehensive assessment covering basic music theory concepts including notes, scales, intervals, and chords.',
        course: 'Music Theory 101',
        status: 'upcoming',
        duration: 60, // minutes
        questions: 40,
        date: '2023-07-15T14:00:00Z',
        passingScore: 70,
        instructions: 'This assessment contains multiple-choice and short-answer questions. You will have 60 minutes to complete all questions. You need a minimum score of 70% to pass.',
        sections: [
          { name: 'Notes and Scales', questions: 15, points: 30 },
          { name: 'Intervals', questions: 10, points: 20 },
          { name: 'Chords and Harmony', questions: 15, points: 30 },
        ],
        allowedAttempts: 2,
        submissionStats: {
          totalStudents: 25,
          submitted: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!assessment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Assessment Not Found</h2>
        <p className="text-muted-foreground">The assessment you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          <p className="text-muted-foreground mt-1">Course: {assessment.course}</p>
        </div>
        <Badge className={getStatusColor(assessment.status)}>
          {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
        </Badge>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">{assessment.description}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Instructions</h3>
                  <p className="text-sm text-muted-foreground">{assessment.instructions}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Sections</h3>
                  <div className="space-y-2">
                    {assessment.sections.map((section, index) => (
                      <div key={index} className="flex justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{section.name}</p>
                          <p className="text-sm text-muted-foreground">{section.questions} questions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{section.points} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {user?.role !== 'student' && (
            <Card>
              <CardHeader>
                <CardTitle>Submission Statistics</CardTitle>
                <CardDescription>Student performance and participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{assessment.submissionStats.totalStudents}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Submissions</p>
                    <p className="text-2xl font-bold">{assessment.submissionStats.submitted}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold">{assessment.submissionStats.averageScore}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Passing Rate</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">View All Submissions</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Duration</h3>
                <p>{assessment.duration} minutes</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Total Questions</h3>
                <p>{assessment.questions}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Passing Score</h3>
                <p>{assessment.passingScore}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Date & Time</h3>
                <p>{new Date(assessment.date).toLocaleDateString()}, {new Date(assessment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Allowed Attempts</h3>
                <p>{assessment.allowedAttempts}</p>
              </div>
              
              <div className="pt-4">
                {user?.role === 'student' ? (
                  <Button 
                    className="w-full"
                    disabled={assessment.status !== 'active'}
                  >
                    {assessment.status === 'active' ? 'Take Assessment' : 'Not Available'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full">Edit Assessment</Button>
                    <Button variant="outline" className="w-full">Preview Assessment</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 