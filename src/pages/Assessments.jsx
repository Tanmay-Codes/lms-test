import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../lib/auth-context';

export function Assessments() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [assessments] = useState([
    {
      id: 1,
      title: 'Music Theory Fundamentals',
      course: 'Music Theory 101',
      status: 'upcoming',
      duration: 60, // minutes
      questions: 40,
      date: '2023-07-15T14:00:00Z',
      passingScore: 70,
    },
    {
      id: 2,
      title: 'Piano Technique Assessment',
      course: 'Intermediate Piano',
      status: 'active',
      duration: 45, // minutes
      questions: 25,
      date: '2023-06-28T10:30:00Z',
      passingScore: 75,
    },
    {
      id: 3,
      title: 'Guitar Basics Quiz',
      course: 'Beginning Guitar',
      status: 'completed',
      duration: 30, // minutes
      questions: 20,
      date: '2023-06-10T15:00:00Z',
      passingScore: 65,
      yourScore: 85,
    },
    {
      id: 4,
      title: 'Ear Training Test',
      course: 'Advanced Ear Training',
      status: 'active',
      duration: 40, // minutes
      questions: 30,
      date: '2023-06-30T13:00:00Z',
      passingScore: 80,
    },
    {
      id: 5,
      title: 'Music History Quiz',
      course: 'Music History Through the Ages',
      status: 'completed',
      duration: 50, // minutes
      questions: 35,
      date: '2023-05-20T11:00:00Z',
      passingScore: 70,
      yourScore: 92,
    },
  ]);
  
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         assessment.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'Take quizzes and tests to evaluate your knowledge' 
              : 'Manage and monitor student assessments'}
          </p>
        </div>
        {user?.role !== 'student' && (
          <Button>Create Assessment</Button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-grow">
          <Input 
            placeholder="Search assessments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
          >
            All
          </Button>
          <Button 
            variant="outline"
          >
            Upcoming
          </Button>
          <Button 
            variant="outline"
          >
            Active
          </Button>
          <Button 
            variant="outline"
          >
            Completed
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredAssessments.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No assessments match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAssessments.map(assessment => (
            <Card key={assessment.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{assessment.title}</CardTitle>
                  <Badge className={getStatusColor(assessment.status)}>
                    {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Course: {assessment.course}</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{assessment.duration} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span>{assessment.questions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(assessment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{new Date(assessment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Passing Score:</span>
                      <span>{assessment.passingScore}%</span>
                    </div>
                    {assessment.yourScore && (
                      <div className="flex justify-between text-sm font-medium">
                        <span>Your Score:</span>
                        <span className={assessment.yourScore >= assessment.passingScore ? 'text-green-600' : 'text-red-600'}>
                          {assessment.yourScore}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-end justify-end">
                    {assessment.status === 'active' && user?.role === 'student' && (
                      <Button>Take Assessment</Button>
                    )}
                    {assessment.status === 'completed' && (
                      <Button variant="outline">View Results</Button>
                    )}
                    {user?.role !== 'student' && (
                      <div className="space-x-2">
                        <Button variant="outline">Edit</Button>
                        <Button>View Details</Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}