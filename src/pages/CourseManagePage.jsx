import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../lib/auth-context';
import { 
  updateCourse, 
  deleteCourse, 
  addSyllabusItem, 
  updateSyllabusItem,
  selectCourseById
} from '../lib/redux/slices/coursesSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { SimpleSelect } from '../components/ui/Select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft, Book, Calendar, Clock, Edit, FileText, 
  GraduationCap, Save, Trash, Upload, Users, X 
} from 'lucide-react';

export function CourseManagePage() {
  const { id } = useParams();
  const courseId = parseInt(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  // Get course from Redux store
  const course = useSelector((state) => selectCourseById(state, courseId));
  
  // Form states
  const [generalForm, setGeneralForm] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    duration: '',
    courseType: 'group',
    maxStudents: 20,
    image: '',
    imageFile: null,
    imageSource: 'url', // 'url' or 'file'
  });
  
  const [syllabusForm, setSyllabusForm] = useState({
    week: '',
    title: '',
    description: '',
    materials: '',
  });
  
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    type: 'link',
    url: '',
    file: null,
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddSyllabusDialogOpen, setIsAddSyllabusDialogOpen] = useState(false);
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isEditSyllabusDialogOpen, setIsEditSyllabusDialogOpen] = useState(false);
  const [isDeleteSyllabusDialogOpen, setIsDeleteSyllabusDialogOpen] = useState(false);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null);
  
  const [isScheduleReleaseDialogOpen, setIsScheduleReleaseDialogOpen] = useState(false);
  const [releaseForm, setReleaseForm] = useState({
    releaseType: 'immediate', // 'immediate' or 'scheduled'
    releaseDate: '',
    releaseTime: '',
  });
  
  // Load course data when component mounts or course changes
  useEffect(() => {
    if (course) {
      setGeneralForm({
        title: course.title || '',
        description: course.description || '',
        level: course.level || 'Beginner',
        duration: course.duration || '',
        courseType: course.courseType || 'group',
        maxStudents: course.maxStudents || 20,
        image: course.image || '',
        imageFile: null,
        imageSource: 'url', // Default to URL since that's what's stored in the database
      });
    } else {
      // Course not found, redirect to courses page
      navigate('/course-management');
    }
  }, [course, navigate]);
  
  // Handle general form changes
  const handleGeneralFormChange = (e) => {
    const { name, value, files, type } = e.target;
    
    if (name === 'imageFile' && files?.length > 0) {
      const file = files[0];
      
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      
      setGeneralForm(prev => ({
        ...prev,
        imageFile: file,
        image: imageUrl,
        imageSource: 'file'
      }));
    } else if (name === 'imageSource') {
      setGeneralForm(prev => ({
        ...prev,
        imageSource: value,
        // Reset the opposite type
        ...(value === 'file' ? { image: prev.imageFile ? URL.createObjectURL(prev.imageFile) : '' } : { imageFile: null })
      }));
    } else {
      setGeneralForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle syllabus form changes
  const handleSyllabusFormChange = (e) => {
    const { name, value } = e.target;
    setSyllabusForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle material form changes
  const handleMaterialFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file' && files?.length > 0) {
      setMaterialForm(prev => ({
        ...prev,
        file: files[0]
      }));
    } else {
      setMaterialForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Save general information
  const handleSaveGeneral = () => {
    setIsSaving(true);
    
    // Determine the image to use
    let imageToSave = course.image;  // Default to existing image
    
    if (generalForm.imageSource === 'url' && generalForm.image) {
      // Use the URL provided in the form
      imageToSave = generalForm.image;
    } else if (generalForm.imageSource === 'file' && generalForm.imageFile) {
      // In a real app, you would upload the file to a server here
      // For now, we'll just use the object URL created for preview
      imageToSave = generalForm.image;
    }
    
    // Keep price the same unless user is admin
    const updatedCourse = {
      ...course,
      ...generalForm,
      image: imageToSave,
      // Only admins can update price
      price: user.role === 'admin' ? generalForm.price || course.price : course.price,
    };
    
    // Remove temporary form fields not needed in the Redux store
    delete updatedCourse.imageFile;
    delete updatedCourse.imageSource;
    
    dispatch(updateCourse({
      id: courseId,
      ...updatedCourse,
      // Course edits by teachers put course back in review
      reviewStatus: user.role === 'admin' ? course.reviewStatus : 'pending',
      status: user.role === 'admin' ? course.status : 'review',
    }));
    
    setIsEditing(false);
    setIsSaving(false);
  };
  
  // Add new syllabus item
  const handleAddSyllabus = () => {
    dispatch(addSyllabusItem({
      courseId,
      syllabusItem: {
        week: parseInt(syllabusForm.week) || course.syllabus.length + 1,
        title: syllabusForm.title,
        description: syllabusForm.description,
        materials: syllabusForm.materials.split(',').map(item => item.trim()),
        assignments: []
      }
    }));
    
    setSyllabusForm({
      week: '',
      title: '',
      description: '',
      materials: '',
    });
    
    setIsAddSyllabusDialogOpen(false);
  };
  
  // Delete course
  const handleDeleteCourse = () => {
    dispatch(deleteCourse(courseId));
    navigate('/course-management');
  };
  
  // Get review status badge
  const getReviewStatusBadge = () => {
    if (!course) return null;
    
    switch (course.reviewStatus) {
      case 'pending':
        return <Badge className="bg-amber-500">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  // Handle opening the edit syllabus dialog
  const handleEditSyllabus = (weekIndex) => {
    const week = course.syllabus[weekIndex];
    setSelectedWeekIndex(weekIndex);
    setSyllabusForm({
      week: week.week.toString(),
      title: week.title,
      description: week.description,
      materials: week.materials.join(', '),
    });
    setIsEditSyllabusDialogOpen(true);
  };
  
  // Save edited syllabus
  const handleSaveSyllabus = () => {
    if (selectedWeekIndex === null) return;
    
    dispatch(updateSyllabusItem({
      courseId,
      weekIndex: selectedWeekIndex,
      updates: {
        week: parseInt(syllabusForm.week) || course.syllabus[selectedWeekIndex].week,
        title: syllabusForm.title,
        description: syllabusForm.description,
        materials: syllabusForm.materials.split(',').map(item => item.trim()),
      }
    }));
    
    // Reset form and close dialog
    setSyllabusForm({
      week: '',
      title: '',
      description: '',
      materials: '',
    });
    setSelectedWeekIndex(null);
    setIsEditSyllabusDialogOpen(false);
  };
  
  // Handle deleting a syllabus week
  const handleDeleteSyllabus = () => {
    if (selectedWeekIndex === null) return;
    
    // Create a new syllabus array without the selected week
    const updatedSyllabus = course.syllabus.filter((_, index) => index !== selectedWeekIndex);
    
    // Update the course with the new syllabus
    dispatch(updateCourse({
      id: courseId,
      syllabus: updatedSyllabus
    }));
    
    setSelectedWeekIndex(null);
    setIsDeleteSyllabusDialogOpen(false);
  };
  
  // Add material to course
  const handleAddMaterial = () => {
    if (!materialForm.title) {
      alert('Please provide a title for the material');
      return;
    }
    
    let materialUrl = '';
    let materialSize = '';
    let materialType = materialForm.type;
    
    if (materialForm.type === 'link' && materialForm.url) {
      materialUrl = materialForm.url;
      materialType = materialForm.url.includes('youtube.com') || materialForm.url.includes('vimeo.com') 
        ? 'video' 
        : materialForm.url.includes('.pdf') 
          ? 'pdf' 
          : 'link';
    } else if (materialForm.file) {
      // In a real app, you would upload the file to a server and get back a URL
      // For now, we'll create an object URL (this will not persist on page refresh)
      materialUrl = URL.createObjectURL(materialForm.file);
      materialSize = `${(materialForm.file.size / 1024).toFixed(0)} KB`;
      
      // Determine file type from extension
      const fileExtension = materialForm.file.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        materialType = 'image';
      } else if (['pdf'].includes(fileExtension)) {
        materialType = 'pdf';
      } else if (['mp4', 'webm', 'mov'].includes(fileExtension)) {
        materialType = 'video';
      } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
        materialType = 'audio';
      } else if (['csv', 'xls', 'xlsx'].includes(fileExtension)) {
        materialType = 'spreadsheet';
      } else {
        materialType = 'document';
      }
    } else {
      alert('Please provide a URL or upload a file');
      return;
    }
    
    // Create a new resources array if it doesn't exist
    const currentResources = course.resources || [];
    
    // Add the new material
    const newMaterial = {
      id: Date.now().toString(),
      title: materialForm.title,
      description: materialForm.description,
      url: materialUrl,
      type: materialType,
      size: materialSize,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    dispatch(updateCourse({
      id: courseId,
      resources: [...currentResources, newMaterial]
    }));
    
    // Reset form
    setMaterialForm({
      title: '',
      description: '',
      type: 'link',
      url: '',
      file: null
    });
    
    setIsAddMaterialDialogOpen(false);
  };
  
  // Delete a material
  const handleDeleteMaterial = (materialId) => {
    if (!course.resources) return;
    
    const updatedResources = course.resources.filter(resource => resource.id !== materialId);
    
    dispatch(updateCourse({
      id: courseId,
      resources: updatedResources
    }));
  };
  
  // Handle release form changes
  const handleReleaseFormChange = (e) => {
    const { name, value } = e.target;
    setReleaseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle course release
  const handleReleaseCourse = () => {
    if (releaseForm.releaseType === 'immediate') {
      // Release the course immediately
      dispatch(updateCourse({
        id: courseId,
        status: 'active',
        reviewStatus: 'approved',
        releaseDate: new Date().toISOString(),
      }));
      
      setIsScheduleReleaseDialogOpen(false);
    } else if (releaseForm.releaseType === 'scheduled') {
      // Validate the form
      if (!releaseForm.releaseDate) {
        alert('Please select a release date');
        return;
      }
      
      // Create a release date from the form inputs
      const releaseDateTime = releaseForm.releaseTime 
        ? `${releaseForm.releaseDate}T${releaseForm.releaseTime}:00` 
        : `${releaseForm.releaseDate}T00:00:00`;
      
      // Schedule the course release
      dispatch(updateCourse({
        id: courseId,
        status: 'upcoming',
        reviewStatus: 'approved',
        releaseDate: releaseDateTime,
      }));
      
      setIsScheduleReleaseDialogOpen(false);
    }
  };
  
  if (!course) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/course-management')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>{course.instructor}</span>
              <span>•</span>
              <span>{course.status}</span>
              <span>{getReviewStatusBadge()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGeneral} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Course
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="general">
            <Book className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="syllabus">
            <Calendar className="mr-2 h-4 w-4" />
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="materials">
            <FileText className="mr-2 h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="students">
            <GraduationCap className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          {user.role === 'admin' && (
            <TabsTrigger value="release">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Release
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* General Information */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  {isEditing ? (
                    <Input 
                      id="title" 
                      name="title" 
                      value={generalForm.title} 
                      onChange={handleGeneralFormChange} 
                      placeholder="Course Title"
                    />
                  ) : (
                    <div className="p-2 border rounded-md">{course.title}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  {isEditing ? (
                    <SimpleSelect 
                      id="level" 
                      name="level" 
                      value={generalForm.level} 
                      onChange={handleGeneralFormChange}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </SimpleSelect>
                  ) : (
                    <div className="p-2 border rounded-md">{course.level}</div>
                  )}
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={generalForm.description} 
                      onChange={handleGeneralFormChange} 
                      placeholder="Course Description"
                      rows={4}
                    />
                  ) : (
                    <div className="p-2 border rounded-md whitespace-pre-wrap">{course.description}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  {isEditing ? (
                    <Input 
                      id="duration" 
                      name="duration" 
                      value={generalForm.duration} 
                      onChange={handleGeneralFormChange} 
                      placeholder="e.g. 8 weeks"
                    />
                  ) : (
                    <div className="p-2 border rounded-md">{course.duration}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courseType">Course Type</Label>
                  {isEditing ? (
                    <SimpleSelect 
                      id="courseType" 
                      name="courseType" 
                      value={generalForm.courseType} 
                      onChange={handleGeneralFormChange}
                    >
                      <option value="group">Group</option>
                      <option value="solo">One-on-One</option>
                    </SimpleSelect>
                  ) : (
                    <div className="p-2 border rounded-md capitalize">{course.courseType}</div>
                  )}
                </div>
                
                {generalForm.courseType === 'group' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents">Maximum Students</Label>
                    {isEditing ? (
                      <Input 
                        id="maxStudents" 
                        name="maxStudents" 
                        type="number" 
                        value={generalForm.maxStudents} 
                        onChange={handleGeneralFormChange} 
                        placeholder="20"
                      />
                    ) : (
                      <div className="p-2 border rounded-md">{course.maxStudents || 'Not specified'}</div>
                    )}
                  </div>
                )}
                
                {/* Only admins can set/edit price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  {isEditing && user.role === 'admin' ? (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        value={generalForm.price} 
                        onChange={handleGeneralFormChange} 
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  ) : (
                    <div className="p-2 border rounded-md">${course.price?.toFixed(2)}</div>
                  )}
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="image">Course Image</Label>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex space-x-4 items-center">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="imageSourceUrl" 
                            name="imageSource" 
                            value="url" 
                            checked={generalForm.imageSource === 'url'} 
                            onChange={handleGeneralFormChange} 
                          />
                          <Label htmlFor="imageSourceUrl">URL</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="imageSourceFile" 
                            name="imageSource" 
                            value="file" 
                            checked={generalForm.imageSource === 'file'} 
                            onChange={handleGeneralFormChange} 
                          />
                          <Label htmlFor="imageSourceFile">Upload File</Label>
                        </div>
                      </div>
                      
                      {generalForm.imageSource === 'url' ? (
                        <Input 
                          id="image" 
                          name="image" 
                          value={generalForm.image} 
                          onChange={handleGeneralFormChange} 
                          placeholder="Image URL"
                        />
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <Label htmlFor="imageFile" className="cursor-pointer text-center">
                              <span className="font-medium text-primary">Click to upload</span>
                              <p className="text-xs text-muted-foreground">Up to 2MB. JPG, PNG, GIF</p>
                            </Label>
                            <input 
                              id="imageFile" 
                              name="imageFile" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleGeneralFormChange} 
                            />
                            {generalForm.imageFile && (
                              <p className="text-sm mt-2 text-muted-foreground">
                                Selected: {generalForm.imageFile.name} ({Math.round(generalForm.imageFile.size / 1024)} KB)
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {generalForm.image && (
                        <div className="relative w-full h-40">
                          <img 
                            src={generalForm.image} 
                            alt="Course preview" 
                            className="object-cover w-full h-full rounded-md" 
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setGeneralForm(prev => ({
                                ...prev,
                                image: '',
                                imageFile: null
                              }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full h-40">
                      <img 
                        src={course.image || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop'} 
                        alt={course.title} 
                        className="object-cover w-full h-full rounded-md" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Syllabus */}
        <TabsContent value="syllabus" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Syllabus</CardTitle>
              <Button onClick={() => setIsAddSyllabusDialogOpen(true)}>
                Add Week
              </Button>
            </CardHeader>
            <CardContent>
              {course.syllabus && course.syllabus.length > 0 ? (
                <div className="space-y-4">
                  {course.syllabus.map((week, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Week {week.week}: {week.title}</CardTitle>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditSyllabus(index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedWeekIndex(index);
                                setIsDeleteSyllabusDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">{week.description}</p>
                        
                        {week.materials && week.materials.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Materials:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {week.materials.map((material, i) => (
                                <li key={i} className="text-sm text-muted-foreground">{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {week.assignments && week.assignments.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Assignments:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {week.assignments.map((assignment) => (
                                <li key={assignment.id} className="text-sm text-muted-foreground">
                                  {assignment.title} - Due: {assignment.dueDate}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Book className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No syllabus yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Start building your course syllabus by adding weekly content.
                  </p>
                  <Button onClick={() => setIsAddSyllabusDialogOpen(true)}>
                    Add First Week
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Materials */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Materials</CardTitle>
              <Button onClick={() => setIsAddMaterialDialogOpen(true)}>
                Add Material
              </Button>
            </CardHeader>
            <CardContent>
              {course.resources && course.resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                            <div className="flex items-center mt-2">
                              <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                              {resource.size && (
                                <span className="text-xs text-muted-foreground ml-2">{resource.size}</span>
                              )}
                              {resource.dateAdded && (
                                <span className="text-xs text-muted-foreground ml-2">Added: {resource.dateAdded}</span>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteMaterial(resource.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 py-2 px-4">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary hover:underline"
                        >
                          {resource.type === 'video' ? 'Watch Video' : 
                           resource.type === 'pdf' ? 'View PDF' : 
                           resource.type === 'image' ? 'View Image' : 
                           resource.type === 'audio' ? 'Listen' : 
                           resource.type === 'spreadsheet' ? 'Open Spreadsheet' : 
                           'Open'}
                        </a>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No materials added yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Add resources like PDFs, links, and audio files for your students.
                  </p>
                  <Button onClick={() => setIsAddMaterialDialogOpen(true)}>
                    Add First Material
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Students */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                <div className="divide-y">
                  {course.enrolledStudents.map((student) => (
                    <div key={student.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {student.avatar ? (
                            <img 
                              src={student.avatar} 
                              alt={student.name} 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          ) : (
                            <span className="text-sm font-medium">{student.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={student.status === 'active' ? 'default' : 'outline'}>
                          {student.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="ml-2">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No students enrolled yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Students will appear here once they enroll in your course.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Release - Admin Only */}
        {user.role === 'admin' && (
          <TabsContent value="release" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Course Release</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-muted/30 rounded-md">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${
                          course.status === 'active' 
                            ? 'bg-green-100 text-green-600' 
                            : course.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-amber-100 text-amber-600'
                        }`}>
                          <Calendar className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Current Status</h3>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>
                            This course is currently <Badge 
                              className={`ml-1 ${
                                course.status === 'active' 
                                  ? 'bg-green-500' 
                                  : course.status === 'upcoming' 
                                    ? 'bg-blue-500' 
                                    : 'bg-amber-500'
                              }`}
                            >
                              {course.status === 'active' 
                                ? 'Active' 
                                : course.status === 'upcoming' 
                                  ? 'Upcoming' 
                                  : 'Under Review'}
                            </Badge>
                          </p>
                          {course.releaseDate && (
                            <p className="mt-1">
                              {course.status === 'active' 
                                ? `Released on: ${new Date(course.releaseDate).toLocaleDateString()}` 
                                : course.status === 'upcoming' 
                                  ? `Scheduled release: ${new Date(course.releaseDate).toLocaleDateString()} ${
                                      new Date(course.releaseDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                    }` 
                                  : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Release Options</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={() => setIsScheduleReleaseDialogOpen(true)}
                          disabled={course.status === 'active'}
                        >
                          {course.status === 'active' 
                            ? 'Course Already Active' 
                            : 'Schedule Release'}
                        </Button>
                        
                        {course.status === 'upcoming' && (
                          <Button 
                            variant="outline"
                            onClick={() => {
                              dispatch(updateCourse({
                                id: courseId,
                                status: 'active',
                                releaseDate: new Date().toISOString(),
                              }));
                            }}
                          >
                            Activate Now
                          </Button>
                        )}
                      </div>
                      
                      {course.status === 'upcoming' && (
                        <p className="text-sm text-muted-foreground">
                          This course is scheduled for release. You can activate it immediately or change the schedule.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Add Syllabus Week Dialog */}
      <Dialog open={isAddSyllabusDialogOpen} onOpenChange={setIsAddSyllabusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Syllabus Week</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="week">Week</Label>
                <Input 
                  id="week"
                  name="week"
                  type="number"
                  value={syllabusForm.week} 
                  onChange={handleSyllabusFormChange}
                  placeholder={(course.syllabus?.length || 0) + 1}
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={syllabusForm.title} 
                  onChange={handleSyllabusFormChange}
                  placeholder="Week Title"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={syllabusForm.description} 
                onChange={handleSyllabusFormChange}
                placeholder="Describe what will be covered this week"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="materials">Materials (comma separated)</Label>
              <Textarea 
                id="materials"
                name="materials"
                value={syllabusForm.materials} 
                onChange={handleSyllabusFormChange}
                placeholder="Textbook Chapter 1, Handout 1, Practice Exercises"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddSyllabusDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSyllabus}>
              Add Week
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Course Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{course.title}</span>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Syllabus Week Dialog */}
      <Dialog open={isEditSyllabusDialogOpen} onOpenChange={setIsEditSyllabusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Syllabus Week</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="edit-week">Week</Label>
                <Input 
                  id="edit-week"
                  name="week"
                  type="number"
                  value={syllabusForm.week} 
                  onChange={handleSyllabusFormChange}
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title"
                  name="title"
                  value={syllabusForm.title} 
                  onChange={handleSyllabusFormChange}
                  placeholder="Week Title"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description"
                name="description"
                value={syllabusForm.description} 
                onChange={handleSyllabusFormChange}
                placeholder="Describe what will be covered this week"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-materials">Materials (comma separated)</Label>
              <Textarea 
                id="edit-materials"
                name="materials"
                value={syllabusForm.materials} 
                onChange={handleSyllabusFormChange}
                placeholder="Textbook Chapter 1, Handout 1, Practice Exercises"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditSyllabusDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveSyllabus}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Syllabus Week Confirmation Dialog */}
      <Dialog open={isDeleteSyllabusDialogOpen} onOpenChange={setIsDeleteSyllabusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Syllabus Week</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Are you sure you want to delete this week from the syllabus?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteSyllabusDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSyllabus}>
              Delete Week
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Material Dialog */}
      <Dialog open={isAddMaterialDialogOpen} onOpenChange={setIsAddMaterialDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Course Material</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="materialTitle">Title</Label>
              <Input 
                id="materialTitle"
                name="title"
                value={materialForm.title} 
                onChange={handleMaterialFormChange}
                placeholder="e.g. Week 1 Handout"
              />
            </div>
            <div>
              <Label htmlFor="materialDescription">Description (optional)</Label>
              <Textarea 
                id="materialDescription"
                name="description"
                value={materialForm.description} 
                onChange={handleMaterialFormChange}
                placeholder="Briefly describe this material"
                rows={2}
              />
            </div>
            <div>
              <Label>Material Type</Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="materialTypeLink" 
                    name="type" 
                    value="link" 
                    checked={materialForm.type === 'link'} 
                    onChange={handleMaterialFormChange} 
                  />
                  <Label htmlFor="materialTypeLink">Link/URL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="materialTypeFile" 
                    name="type" 
                    value="file" 
                    checked={materialForm.type === 'file'} 
                    onChange={handleMaterialFormChange} 
                  />
                  <Label htmlFor="materialTypeFile">Upload File</Label>
                </div>
              </div>
            </div>
            
            {materialForm.type === 'link' ? (
              <div>
                <Label htmlFor="materialUrl">URL</Label>
                <Input 
                  id="materialUrl"
                  name="url"
                  value={materialForm.url} 
                  onChange={handleMaterialFormChange}
                  placeholder="https://..."
                  type="url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Link to YouTube, Vimeo, PDF, or any other resource
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="materialFile">Upload File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-1">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <Label htmlFor="materialFile" className="cursor-pointer text-center">
                      <span className="font-medium text-primary">Click to upload</span>
                      <p className="text-xs text-muted-foreground">Up to 2MB. PDFs, images, videos, documents</p>
                    </Label>
                    <input 
                      id="materialFile" 
                      name="file" 
                      type="file" 
                      className="hidden" 
                      onChange={handleMaterialFormChange} 
                    />
                    {materialForm.file && (
                      <p className="text-sm mt-2 text-muted-foreground">
                        Selected: {materialForm.file.name} ({Math.round(materialForm.file.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMaterialDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMaterial}>
              Add Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Release Dialog */}
      <Dialog open={isScheduleReleaseDialogOpen} onOpenChange={setIsScheduleReleaseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Course Release</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Release Type</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div 
                  className={`p-3 border rounded-md cursor-pointer flex flex-col items-center text-center ${
                    releaseForm.releaseType === 'immediate' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setReleaseForm(prev => ({ ...prev, releaseType: 'immediate' }))}
                >
                  <div className="p-2 rounded-full bg-primary/10 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Immediate</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Make course active right away
                  </div>
                </div>
                
                <div 
                  className={`p-3 border rounded-md cursor-pointer flex flex-col items-center text-center ${
                    releaseForm.releaseType === 'scheduled' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setReleaseForm(prev => ({ ...prev, releaseType: 'scheduled' }))}
                >
                  <div className="p-2 rounded-full bg-primary/10 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Scheduled</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Set a future release date
                  </div>
                </div>
              </div>
            </div>
            
            {releaseForm.releaseType === 'scheduled' && (
              <>
                <div>
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input 
                    id="releaseDate" 
                    name="releaseDate" 
                    type="date" 
                    value={releaseForm.releaseDate} 
                    onChange={handleReleaseFormChange}
                    min={new Date().toISOString().split('T')[0]} // Ensure date is today or later
                  />
                </div>
                
                <div>
                  <Label htmlFor="releaseTime">Release Time (optional)</Label>
                  <Input 
                    id="releaseTime" 
                    name="releaseTime" 
                    type="time" 
                    value={releaseForm.releaseTime} 
                    onChange={handleReleaseFormChange} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If no time is set, the course will be released at midnight
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleReleaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReleaseCourse}>
              {releaseForm.releaseType === 'immediate' ? 'Release Now' : 'Schedule Release'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 