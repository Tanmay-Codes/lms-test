import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch assessment details from an API
    // For this demo, we'll use mock data
    setTimeout(() => {
      const mockAssessment = {
        id: parseInt(id, 10),
        title: 'Music Theory Fundamentals',
        duration: 60, // minutes in a real app
        questions: [
          {
            id: 1,
            text: 'What is the name of the symbol that indicates a note should be played higher in pitch?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Flat' },
              { id: 'b', text: 'Sharp' },
              { id: 'c', text: 'Natural' },
              { id: 'd', text: 'Key signature' }
            ],
            correctAnswer: 'b'
          },
          {
            id: 2,
            text: 'How many lines are in a standard music staff?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '4' },
              { id: 'b', text: '5' },
              { id: 'c', text: '6' },
              { id: 'd', text: '7' }
            ],
            correctAnswer: 'b'
          },
          {
            id: 3,
            text: 'What is the interval between C and G?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Perfect fourth' },
              { id: 'b', text: 'Perfect fifth' },
              { id: 'c', text: 'Major sixth' },
              { id: 'd', text: 'Minor seventh' }
            ],
            correctAnswer: 'b'
          },
          {
            id: 4,
            text: 'Which of the following is not a part of a triad chord?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Root' },
              { id: 'b', text: 'Third' },
              { id: 'c', text: 'Fourth' },
              { id: 'd', text: 'Fifth' }
            ],
            correctAnswer: 'c'
          },
          {
            id: 5,
            text: 'Explain the difference between major and minor scales.',
            type: 'text',
            maxLength: 500,
            correctAnswer: null // This would be graded manually
          },
        ]
      };
      
      setAssessment(mockAssessment);
      setTimeLeft(mockAssessment.duration * 60); // Convert minutes to seconds
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // Timer countdown
  useEffect(() => {
    if (!timeLeft) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
      
      if (timeLeft <= 0) {
        clearInterval(timerId);
        handleSubmit();
      }
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // In a real app, you would submit answers to the backend
    setTimeout(() => {
      // Navigate to results or dashboard
      alert('Assessment submitted successfully!');
      navigate('/dashboard');
    }, 1500);
  };
  
  const renderQuestion = (question) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map(option => (
              <div 
                key={option.id}
                className={`p-3 border rounded-md cursor-pointer hover:bg-accent/10 ${answers[question.id] === option.id ? 'bg-accent/20 border-primary' : ''}`}
                onClick={() => handleAnswerChange(question.id, option.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full border ${answers[question.id] === option.id ? 'bg-primary border-primary' : 'border-border'}`}></div>
                  <span>{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'text':
        return (
          <div>
            <textarea
              className="w-full min-h-32 p-3 border rounded-md"
              placeholder="Type your answer here..."
              maxLength={question.maxLength}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            ></textarea>
            <p className="text-xs text-muted-foreground mt-1">
              {answers[question.id]?.length || 0}/{question.maxLength} characters
            </p>
          </div>
        );
        
      default:
        return <p>Unsupported question type</p>;
    }
  };
  
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
  
  const currentQuestionData = assessment.questions[currentQuestion];
  const questionsAnswered = Object.keys(answers).length;
  const questionsTotal = assessment.questions.length;
  
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="sticky top-0 bg-background z-10 py-4 mb-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questionsTotal}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono font-bold">{formatTime(timeLeft)}</div>
            <p className="text-sm text-muted-foreground">Time remaining</p>
          </div>
        </div>
        
        <div className="mt-4 h-1 w-full bg-muted rounded">
          <div 
            className="h-full bg-primary rounded" 
            style={{ width: `${(questionsAnswered / questionsTotal) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>{questionsAnswered} answered</span>
          <span>{questionsTotal - questionsAnswered} remaining</span>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium mb-4">{currentQuestionData.text}</p>
          {renderQuestion(currentQuestionData)}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <div>
            {currentQuestion === assessment.questions.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>Next</Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>Exit</Button>
        <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit All Answers'}
        </Button>
      </div>
    </div>
  );
} 