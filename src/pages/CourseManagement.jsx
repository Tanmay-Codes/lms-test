import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../lib/auth-context';
import { 
  addCourse, 
  updateCourse, 
  deleteCourse, 
  approveCourse,
  rejectCourse,
  assignTeacherToCourse,
  setFilteredTeacher,
  clearTeacherFilter
} from '../lib/redux/slices/coursesSlice';
import { users } from '../lib/dummyData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { SimpleSelect } from '../components/ui/Select';
import { Switch } from '../components/ui/Switch';
import { CourseCard } from '../components/CourseCard';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { BookOpen, Upload, PlusCircle, Users, X } from 'lucide-react';

export function CourseManagement() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const courses = useSelector(state => state.courses.courses);
  const filteredTeacherId = useSelector(state => state.courses.filteredTeacherId);
  
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  
  // Form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    price: '0.00',
    duration: '8 weeks',
    courseType: 'group',
    maxStudents: 20,
    image: '',
    instructorId: user?.role === 'teacher' ? user.id : '',
    instructor: user?.role === 'teacher' ? user.name : '',
  });
  
  // State for file upload
  const [courseMedia, setCourseMedia] = useState({
    file: null,
    type: 'image',
    source: 'upload', // 'upload' or 'url'
    url: '',
    previewUrl: '',
  });
  
  // State for assigning teacher
  const [assignTeacherForm, setAssignTeacherForm] = useState({
    courseId: '',
    teacherId: '',
  });

  // State for course review
  const [reviewForm, setReviewForm] = useState({
    courseId: '',
    price: '0.00',
    approved: true,
    rejectionReason: '',
  });
  
  // Get teachers for dropdown
  const teachers = users.filter(u => u.role === 'teacher');
  
  // Filter courses based on user role and filter state
  const filteredCourses = courses.filter(course => {
    // If teacher, show only their courses
    if (user.role === 'teacher') {
      return course.instructorId === user.id;
    }
    
    // If admin and a teacher filter is applied
    if (user.role === 'admin' && filteredTeacherId) {
      return course.instructorId === filteredTeacherId;
    }
    
    // Otherwise show all courses
    return true;
  });
  
  // Reset form
  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      level: 'Beginner',
      price: '0.00',
      duration: '8 weeks',
      courseType: 'group',
      maxStudents: 20,
      image: '',
      instructorId: user?.role === 'teacher' ? user.id : '',
      instructor: user?.role === 'teacher' ? user.name : '',
    });
    setCourseMedia({
      file: null,
      type: 'image',
      source: 'upload',
      url: '',
      previewUrl: '',
    });
  };
  
  // Handle opening the dialog for editing a course
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      level: course.level,
      price: course.price.toString(),
      duration: course.duration,
      courseType: course.courseType,
      maxStudents: course.maxStudents || 20,
      image: course.image,
      instructorId: course.instructorId,
      instructor: course.instructor,
    });
    
    setCourseMedia({
      file: null,
      type: 'image',
      source: 'url',
      url: course.image,
      previewUrl: course.image,
    });
    
    setFormMode('edit');
    setIsAddCourseDialogOpen(true);
  };
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file/media input changes
  const handleMediaChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file' && files?.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      setCourseMedia(prev => ({
        ...prev,
        file: file,
        previewUrl: url,
      }));
    } else {
      setCourseMedia(prev => ({
        ...prev,
        [name]: value
      }));
      
      // If it's a URL, set it as preview as well
      if (name === 'url') {
        setCourseMedia(prev => ({
          ...prev,
          previewUrl: value
        }));
      }
    }
  };
  
  // Handle course submission
  const handleSubmitCourse = () => {
    // Validate form
    if (!courseForm.title || !courseForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, you would upload the file to a server here
    // For now, we'll just use the file preview or URL
    const imageUrl = courseMedia.source === 'upload' 
      ? (courseMedia.previewUrl || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop') 
      : (courseMedia.url || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop');
    
    if (formMode === 'add') {
      // Add new course with the appropriate review status based on role
      dispatch(addCourse({
        ...courseForm,
        price: parseFloat(courseForm.price),
        image: imageUrl,
        role: user.role, // Pass user role to determine if course needs review
      }));
    } else {
      // Update existing course
      dispatch(updateCourse({
        id: selectedCourse.id,
        ...courseForm,
        price: parseFloat(courseForm.price),
        image: imageUrl,
        // Teacher edits will put course back in review unless it's an admin
        reviewStatus: user.role === 'admin' ? selectedCourse.reviewStatus : 'pending',
        status: user.role === 'admin' ? selectedCourse.status : 'review',
      }));
    }
    
    // Reset and close dialog
    resetForm();
    setIsAddCourseDialogOpen(false);
  };
  
  // Handle opening assign teacher dialog
  const handleAssignTeacher = (course) => {
    setSelectedCourse(course);
    setAssignTeacherForm({
      courseId: course.id,
      teacherId: course.instructorId || '',
    });
    setIsAssignTeacherDialogOpen(true);
  };
  
  // Handle assign teacher form changes
  const handleAssignTeacherChange = (e) => {
    const { name, value } = e.target;
    setAssignTeacherForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle assigning teacher to course
  const handleSubmitAssignTeacher = () => {
    const selectedTeacher = teachers.find(t => t.id === assignTeacherForm.teacherId);
    
    if (!selectedTeacher) {
      alert('Please select a teacher');
      return;
    }
    
    dispatch(assignTeacherToCourse({
      courseId: assignTeacherForm.courseId,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
    }));
    
    setIsAssignTeacherDialogOpen(false);
  };
  
  // Handle opening review dialog
  const handleReviewCourse = (course) => {
    setSelectedCourse(course);
    setReviewForm({
      courseId: course.id,
      price: course.price.toString(),
      approved: true,
      rejectionReason: '',
    });
    setIsReviewDialogOpen(true);
  };
  
  // Handle review form changes
  const handleReviewFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle submitting course review
  const handleSubmitReview = () => {
    if (reviewForm.approved) {
      dispatch(approveCourse({
        courseId: reviewForm.courseId,
        price: parseFloat(reviewForm.price),
      }));
    } else {
      dispatch(rejectCourse({
        courseId: reviewForm.courseId,
        reason: reviewForm.rejectionReason,
      }));
    }
    
    setIsReviewDialogOpen(false);
  };
  
  // Handle teacher filter change
  const handleTeacherFilterChange = (e) => {
    const teacherId = e.target.value;
    if (teacherId === '') {
      dispatch(clearTeacherFilter());
    } else {
      dispatch(setFilteredTeacher(teacherId));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Course Management</h2>
          <p className="text-muted-foreground">Create and manage your courses</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {user.role === 'admin' && (
            <div className="w-full sm:w-64">
              <SimpleSelect 
                value={filteredTeacherId || ''} 
                onChange={handleTeacherFilterChange}
              >
                <option value="">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </SimpleSelect>
            </div>
          )}
          <Button onClick={() => {
            resetForm();
            setFormMode('add');
            setIsAddCourseDialogOpen(true);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          {user.role === 'admin' && (
            <TabsTrigger value="review">Under Review</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Get started by creating your first course.
                </p>
                <Button className="mt-4" onClick={() => {
                  resetForm();
                  setFormMode('add');
                  setIsAddCourseDialogOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.filter(course => course.status === 'active').map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.filter(course => course.status === 'upcoming').map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        {user.role === 'admin' && (
          <TabsContent value="review" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.filter(course => course.reviewStatus === 'pending').map(course => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={course.image || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop'} 
                      alt={course.title} 
                      className="object-cover w-full h-40" 
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Pending Review
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Instructor:</span>
                        <span className="text-sm">{course.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Level:</span>
                        <span className="text-sm">{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm">{course.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Price:</span>
                        <span className="text-sm">${course.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleEditCourse(course)}>
                      Edit
                    </Button>
                    <Button onClick={() => handleReviewCourse(course)}>
                      Review
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Add/Edit Course Dialog */}
      <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Add New Course' : 'Edit Course'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Course Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={courseForm.title} 
                  onChange={handleFormChange} 
                  placeholder="e.g. Music Theory Fundamentals" 
                  required 
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={courseForm.description} 
                  onChange={handleFormChange} 
                  placeholder="Enter course description..." 
                  required 
                  rows={3} 
                />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <SimpleSelect id="level" name="level" value={courseForm.level} onChange={handleFormChange}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </SimpleSelect>
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={courseForm.price} 
                  onChange={handleFormChange} 
                  placeholder="0.00" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  value={courseForm.duration} 
                  onChange={handleFormChange} 
                  placeholder="e.g. 8 weeks" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="courseType">Course Type</Label>
                <SimpleSelect id="courseType" name="courseType" value={courseForm.courseType} onChange={handleFormChange}>
                  <option value="group">Group</option>
                  <option value="solo">One-on-One</option>
                </SimpleSelect>
              </div>
              {courseForm.courseType === 'group' && (
                <div>
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input 
                    id="maxStudents" 
                    name="maxStudents" 
                    type="number" 
                    min="1" 
                    value={courseForm.maxStudents} 
                    onChange={handleFormChange} 
                    placeholder="20" 
                  />
                </div>
              )}
              {user.role === 'admin' && formMode === 'add' && (
                <div>
                  <Label htmlFor="instructorId">Instructor</Label>
                  <SimpleSelect id="instructorId" name="instructorId" value={courseForm.instructorId} onChange={(e) => {
                    const teacherId = e.target.value;
                    const teacher = teachers.find(t => t.id === teacherId);
                    setCourseForm(prev => ({
                      ...prev,
                      instructorId: teacherId,
                      instructor: teacher?.name || ''
                    }));
                  }}>
                    <option value="">Select Instructor</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </SimpleSelect>
                </div>
              )}
              <div className="col-span-2">
                <Label>Course Media</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="media-upload" className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-primary">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm text-center text-muted-foreground">
                        <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        <p className="text-xs">Up to 2MB. Images or videos only.</p>
                      </div>
                      <input 
                        id="media-upload" 
                        name="file"
                        type="file" 
                        className="hidden" 
                        accept="image/*,video/*" 
                        onChange={handleMediaChange}
                      />
                    </div>
                  </Label>
                  <div className="text-center">or</div>
                  <div className="flex-1">
                    <Input 
                      type="url" 
                      name="url"
                      placeholder="Enter URL..." 
                      value={courseMedia.url} 
                      onChange={handleMediaChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">YouTube, Vimeo, or image URL</p>
                  </div>
                </div>
                {courseMedia.previewUrl && (
                  <div className="mt-4 relative">
                    <img 
                      src={courseMedia.previewUrl} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-md" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-6 w-6" 
                      onClick={() => setCourseMedia(prev => ({...prev, file: null, previewUrl: '', url: ''}))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCourseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitCourse}>
              {formMode === 'add' ? 'Create Course' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Teacher Dialog */}
      <Dialog open={isAssignTeacherDialogOpen} onOpenChange={setIsAssignTeacherDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Teacher</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="teacherId">Select Teacher</Label>
            <SimpleSelect 
              id="teacherId" 
              name="teacherId" 
              value={assignTeacherForm.teacherId} 
              onChange={handleAssignTeacherChange}
            >
              <option value="">Select a Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </SimpleSelect>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignTeacherDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitAssignTeacher}>Assign Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Review Course Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Course</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="approved">Approval Status</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch 
                  id="approved" 
                  name="approved"
                  checked={reviewForm.approved} 
                  onCheckedChange={(checked) => setReviewForm(prev => ({...prev, approved: checked}))} 
                />
                <Label htmlFor="approved" className="cursor-pointer">
                  {reviewForm.approved ? 'Approve Course' : 'Reject Course'}
                </Label>
              </div>
            </div>
            
            {reviewForm.approved ? (
              <div>
                <Label htmlFor="price">Set Price ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={reviewForm.price} 
                  onChange={handleReviewFormChange} 
                  placeholder="0.00" 
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Textarea 
                  id="rejectionReason" 
                  name="rejectionReason" 
                  value={reviewForm.rejectionReason} 
                  onChange={handleReviewFormChange} 
                  placeholder="Explain why this course is being rejected..." 
                  rows={3} 
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitReview}
              variant={reviewForm.approved ? 'default' : 'destructive'}
            >
              {reviewForm.approved ? 'Approve Course' : 'Reject Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 