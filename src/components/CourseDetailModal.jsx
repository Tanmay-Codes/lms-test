import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  GraduationCap, 
  Clock, 
  BarChart3, 
  Star, 
  Users, 
  Calendar, 
  MapPin,
  FileText,
  BookOpen
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from './ui/Dialog';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { ScrollArea } from './ui/ScrollArea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth-context';

export function CourseDetailModal({ course, isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!course) return null;
  
  // Helper function to get status badge
  const getStatusBadge = () => {
    // If the course is under review, show review status instead of active/inactive
    if (course.reviewStatus === 'pending') {
      return <Badge className="bg-amber-500">Under Review</Badge>;
    }
    
    // Otherwise show normal status
    switch (course.status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'archived':
        return <Badge className="bg-gray-500">Archived</Badge>;
      case 'review':
        return <Badge className="bg-amber-500">Under Review</Badge>;
      default:
        return null;
    }
  };
  
  // Helper function to format course level
  const getLevelBadge = () => {
    switch (course.level) {
      case 'Beginner':
        return <Badge variant="outline" className="border-green-500 text-green-700">Beginner</Badge>;
      case 'Intermediate':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Intermediate</Badge>;
      case 'Advanced':
        return <Badge variant="outline" className="border-red-500 text-red-700">Advanced</Badge>;
      default:
        return <Badge variant="outline">All Levels</Badge>;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 w-[95vw] h-[90vh] max-h-[90vh] overflow-hidden">
        {/* Hero section with course image */}
        <div className="relative overflow-hidden">
          <div className="h-48 md:h-64 lg:h-72 overflow-hidden">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
          
          {/* Close button */}
          <div className="absolute top-4 right-4 z-10">
            <Button variant="outline" size="icon" onClick={onClose} className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Course title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {getStatusBadge()}
              {getLevelBadge()}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{course.title}</h2>
          </div>
        </div>
        
        <div className="px-4 py-3 md:px-6 md:py-4 border-b">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-1.5 text-primary" />
                <span className="font-medium">{course.instructor}</span>
              </div>
              <div className="hidden md:flex items-center">
                <Clock className="w-5 h-5 mr-1.5 text-primary" />
                <span>{course.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(course.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    )} 
                  />
                ))}
              </div>
              <span className="font-medium ml-1.5">{course.rating || 'New'}</span>
            </div>
          </div>
          <p className="text-muted-foreground mt-2 line-clamp-2 md:line-clamp-none">{course.description}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 h-[calc(90vh-330px)] md:h-[calc(90vh-390px)]">
          <TabsList className="grid w-full grid-cols-4 px-4 md:px-6 py-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 px-4 md:px-6">
            <TabsContent value="overview" className="py-4 space-y-5 min-h-[300px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">Expert Instructor</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Duration</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{course.duration}</p>
                        <p className="text-xs text-muted-foreground">Course Length</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Class Size</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        {course.courseType === 'group' ? (
                          <>
                            <p className="font-medium">{course.students}/{course.maxStudents} Students</p>
                            <p className="text-xs text-muted-foreground">Group Sessions</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">1-on-1 Instruction</p>
                            <p className="text-xs text-muted-foreground">Private Lessons</p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {course.schedule?.days?.join(', ') || 'Flexible'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.schedule?.time || 'By appointment'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <p className="text-sm md:text-base">{course.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-base md:text-lg">What You'll Learn</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
                      {course.syllabus && course.syllabus.length > 0 ? (
                        course.syllabus.slice(0, 4).map((week, index) => (
                          <li key={index}>{week.title}</li>
                        ))
                      ) : (
                        <li>Comprehensive curriculum tailored to your skill level</li>
                      )}
                      {course.syllabus && course.syllabus.length > 4 && (
                        <li className="list-none mt-3">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-primary" 
                            onClick={() => setActiveTab('syllabus')}
                          >
                            See full syllabus →
                          </Button>
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="syllabus" className="py-4 space-y-4 min-h-[300px]">
              {course.syllabus && course.syllabus.length > 0 ? (
                course.syllabus.map((week, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base md:text-lg">Week {week.week}: {week.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-sm md:text-base">{week.description}</p>
                      
                      {week.materials && week.materials.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium md:text-base">Materials:</h5>
                          <ul className="list-disc list-inside text-sm md:text-base pl-2">
                            {week.materials.map((material, idx) => (
                              <li key={idx}>{material}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {week.assignments && week.assignments.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium md:text-base">Assignments:</h5>
                          <ul className="list-disc list-inside text-sm md:text-base pl-2">
                            {week.assignments.map((assignment, idx) => (
                              <li key={idx}>
                                {assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium md:text-xl">Syllabus Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-2 md:text-base">
                    The complete syllabus for this course is being finalized.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resources" className="py-4 space-y-4 min-h-[300px]">
              {course.resources && course.resources.length > 0 ? (
                course.resources.map((resource, index) => (
                  <Card key={index} className="hover:bg-accent/10 transition-colors">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center">
                        <div className={cn(
                          "w-12 h-12 rounded-md flex items-center justify-center mr-3 flex-shrink-0",
                          resource.type === 'pdf' ? "bg-red-100 text-red-600" : 
                          resource.type === 'audio' ? "bg-blue-100 text-blue-600" :
                          resource.type === 'video' ? "bg-purple-100 text-purple-600" :
                          "bg-green-100 text-green-600"
                        )}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium md:text-lg">{resource.title}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {resource.description} • {resource.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="md:w-auto w-full">Download</Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium md:text-xl">No Resources Yet</h3>
                  <p className="text-sm text-muted-foreground mt-2 md:text-base">
                    Course resources will be available once you enroll.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="py-4 space-y-4 min-h-[300px]">
              {course.reviews && course.reviews.length > 0 ? (
                course.reviews.map((review, index) => (
                  <Card key={index} className="hover:bg-accent/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                            {review.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{review.studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-4 h-4",
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              )} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm md:text-base">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Star className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium md:text-xl">No Reviews Yet</h3>
                  <p className="text-sm text-muted-foreground mt-2 md:text-base">
                    Be the first to review this course after enrollment.
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="px-4 py-4 md:px-6 md:py-5 border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
            <div>
              <p className="font-bold text-2xl">${course.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                {course.courseType === 'solo' ? 'Per hour' : 'Full course'}
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 md:flex-initial">Close</Button>
              <Button className="flex-1 md:flex-initial">
                {user?.role === 'student' ? 'Enroll Now' : 'Manage Course'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 