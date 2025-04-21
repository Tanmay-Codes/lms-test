import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { toast } from 'react-hot-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { 
  selectAllCourses,
  enrollStudent 
} from '../lib/redux/slices/coursesSlice';
import { 
  PlusCircle, 
  UserPlus, 
  Users, 
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { Checkbox } from '../components/ui/Checkbox';

export function StudentManagement() {
  const dispatch = useDispatch();
  const allCourses = useSelector(selectAllCourses);
  
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      status: 'active',
      enrolledCourses: 3,
      joinDate: '2023-01-15',
      phone: '555-123-4567',
      notes: 'Exceptional student with good musical ear.',
      courses: [1, 3]
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      status: 'active',
      enrolledCourses: 2,
      joinDate: '2023-02-20',
      phone: '555-234-5678',
      notes: 'Needs additional practice time.',
      courses: [1, 5]
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@example.com',
      status: 'inactive',
      enrolledCourses: 1,
      joinDate: '2022-11-10',
      phone: '555-345-6789',
      notes: 'On leave until next semester.',
      courses: [2]
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@example.com',
      status: 'active',
      enrolledCourses: 4,
      joinDate: '2023-03-05',
      phone: '555-456-7890',
      notes: 'Interested in advanced theory classes.',
      courses: [1, 2, 4, 7]
    },
    {
      id: 5,
      name: 'Eva Garcia',
      email: 'eva@example.com',
      status: 'active',
      enrolledCourses: 2,
      joinDate: '2023-01-30',
      phone: '555-567-8901',
      notes: 'Considering private piano lessons.',
      courses: [3, 6]
    },
  ]);
  
  // Batches state
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: 'Music Theory 2023',
      description: 'Students enrolled in Music Theory for Spring 2023',
      courseId: 1,
      studentIds: [1, 2, 4],
      createdDate: '2023-01-10'
    },
    {
      id: 2,
      name: 'Guitar Beginners',
      description: 'Beginner guitarists group',
      courseId: 3,
      studentIds: [3, 5],
      createdDate: '2023-02-15'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignCourseDialogOpen, setIsAssignCourseDialogOpen] = useState(false);
  const [isCreateBatchDialogOpen, setIsCreateBatchDialogOpen] = useState(false);
  const [isAddToBatchDialogOpen, setIsAddToBatchDialogOpen] = useState(false);
  
  // Student form
  const defaultStudentForm = {
    name: '',
    email: '',
    status: 'active',
    phone: '',
    notes: '',
    joinDate: new Date().toISOString().split('T')[0],
    courses: []
  };
  
  // Batch form
  const defaultBatchForm = {
    name: '',
    description: '',
    courseId: '',
    studentIds: []
  };
  
  // Course assignment form
  const [courseAssignmentForm, setCourseAssignmentForm] = useState({
    studentId: '',
    courseId: ''
  });
  
  // Batch form
  const [batchForm, setBatchForm] = useState(defaultBatchForm);
  
  const [studentForm, setStudentForm] = useState(defaultStudentForm);
  
  // Student selected for batch addition
  const [selectedStudentsForBatch, setSelectedStudentsForBatch] = useState([]);
  
  // Selected batch for management
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredBatches = batches.filter(batch => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (value) => {
    setStudentForm(prev => ({
      ...prev,
      status: value
    }));
  };
  
  const handleBatchFormChange = (e) => {
    const { name, value } = e.target;
    setBatchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBatchCourseChange = (value) => {
    setBatchForm(prev => ({
      ...prev,
      courseId: value
    }));
  };
  
  const handleCourseAssignmentChange = (field, value) => {
    setCourseAssignmentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleStudentSelectionForBatch = (studentId, isChecked) => {
    if (isChecked) {
      setSelectedStudentsForBatch(prev => [...prev, studentId]);
    } else {
      setSelectedStudentsForBatch(prev => prev.filter(id => id !== studentId));
    }
  };
  
  const handleAddStudent = () => {
    // Validate form
    if (!studentForm.name || !studentForm.email) {
      toast.error('Name and email are required fields');
      return;
    }
    
    // Create new student
    const newStudent = {
      ...studentForm,
      id: Math.max(0, ...students.map(s => s.id)) + 1,
      enrolledCourses: studentForm.courses ? studentForm.courses.length : 0,
      courses: studentForm.courses || []
    };
    
    setStudents(prev => [...prev, newStudent]);
    setIsAddDialogOpen(false);
    setStudentForm(defaultStudentForm);
    toast.success('Student added successfully');
  };
  
  const handleEditStudent = () => {
    // Validate form
    if (!studentForm.name || !studentForm.email) {
      toast.error('Name and email are required fields');
      return;
    }
    
    setStudents(prev => 
      prev.map(student => 
        student.id === selectedStudent.id ? { 
          ...student, 
          ...studentForm,
          enrolledCourses: studentForm.courses ? studentForm.courses.length : 0
        } : student
      )
    );
    
    setIsEditDialogOpen(false);
    setSelectedStudent(prevStudent => ({ 
      ...prevStudent, 
      ...studentForm,
      enrolledCourses: studentForm.courses ? studentForm.courses.length : 0
    }));
    toast.success('Student updated successfully');
  };
  
  const handleDeleteStudent = () => {
    // Remove student from any batches they're in
    setBatches(prev => 
      prev.map(batch => ({
        ...batch,
        studentIds: batch.studentIds.filter(id => id !== selectedStudent.id)
      }))
    );
    
    setStudents(prev => prev.filter(student => student.id !== selectedStudent.id));
    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
    toast.success('Student deleted successfully');
  };
  
  const openEditDialog = () => {
    if (!selectedStudent) return;
    
    setStudentForm({
      name: selectedStudent.name,
      email: selectedStudent.email,
      status: selectedStudent.status,
      phone: selectedStudent.phone || '',
      notes: selectedStudent.notes || '',
      joinDate: selectedStudent.joinDate,
      courses: selectedStudent.courses || []
    });
    
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = () => {
    if (!selectedStudent) return;
    setIsDeleteDialogOpen(true);
  };
  
  const handleAssignCourse = () => {
    const { studentId, courseId } = courseAssignmentForm;
    
    if (!studentId || !courseId) {
      toast.error('Please select both a student and a course');
      return;
    }
    
    // Parse IDs as integers for comparison
    const studentIdInt = parseInt(studentId);
    const courseIdInt = parseInt(courseId);
    
    // Update student with new course
    setStudents(prev => 
      prev.map(student => {
        if (student.id === studentIdInt) {
          const updatedCourses = student.courses || [];
          if (!updatedCourses.includes(courseIdInt)) {
            updatedCourses.push(courseIdInt);
          }
          return {
            ...student,
            courses: updatedCourses,
            enrolledCourses: updatedCourses.length
          };
        }
        return student;
      })
    );
    
    // If selected student is being updated, also update the selected student state
    if (selectedStudent && selectedStudent.id === studentIdInt) {
      const updatedCourses = [...(selectedStudent.courses || [])];
      if (!updatedCourses.includes(courseIdInt)) {
        updatedCourses.push(courseIdInt);
      }
      setSelectedStudent({
        ...selectedStudent,
        courses: updatedCourses,
        enrolledCourses: updatedCourses.length
      });
    }
    
    // Dispatch to Redux to update course enrollment count
    dispatch(enrollStudent({ courseId: courseIdInt, studentId: studentIdInt }));
    
    setIsAssignCourseDialogOpen(false);
    setCourseAssignmentForm({ studentId: '', courseId: '' });
    toast.success('Course assigned to student successfully');
  };
  
  const handleCreateBatch = () => {
    if (!batchForm.name || !batchForm.courseId) {
      toast.error('Batch name and course are required');
      return;
    }
    
    const newBatch = {
      ...batchForm,
      id: Math.max(0, ...batches.map(b => b.id)) + 1,
      studentIds: selectedStudentsForBatch,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setBatches(prev => [...prev, newBatch]);
    
    // Update students with the new course if they don't already have it
    const courseIdInt = parseInt(batchForm.courseId);
    
    setStudents(prev => 
      prev.map(student => {
        if (selectedStudentsForBatch.includes(student.id)) {
          const updatedCourses = student.courses || [];
          if (!updatedCourses.includes(courseIdInt)) {
            updatedCourses.push(courseIdInt);
            
            // Dispatch to Redux to update course enrollment count
            dispatch(enrollStudent({ courseId: courseIdInt, studentId: student.id }));
            
            return {
              ...student,
              courses: updatedCourses,
              enrolledCourses: updatedCourses.length
            };
          }
          return student;
        }
        return student;
      })
    );
    
    // If selected student is in the batch, update selected student state
    if (selectedStudent && selectedStudentsForBatch.includes(selectedStudent.id)) {
      const updatedCourses = [...(selectedStudent.courses || [])];
      if (!updatedCourses.includes(courseIdInt)) {
        updatedCourses.push(courseIdInt);
      }
      setSelectedStudent({
        ...selectedStudent,
        courses: updatedCourses,
        enrolledCourses: updatedCourses.length
      });
    }
    
    setIsCreateBatchDialogOpen(false);
    setBatchForm(defaultBatchForm);
    setSelectedStudentsForBatch([]);
    toast.success('Batch created successfully');
  };
  
  const handleAddStudentToBatch = () => {
    if (!selectedBatch || !selectedStudentsForBatch.length) {
      toast.error('Please select a batch and at least one student');
      return;
    }
    
    // Find the course associated with this batch
    const courseIdInt = parseInt(selectedBatch.courseId);
    
    // Update the batch with new students
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id === selectedBatch.id) {
          // Combine existing students with new ones, avoiding duplicates
          const updatedStudentIds = [...new Set([...batch.studentIds, ...selectedStudentsForBatch])];
          return {
            ...batch,
            studentIds: updatedStudentIds
          };
        }
        return batch;
      })
    );
    
    // Update students with the course associated with the batch
    setStudents(prev => 
      prev.map(student => {
        if (selectedStudentsForBatch.includes(student.id)) {
          const updatedCourses = student.courses || [];
          if (!updatedCourses.includes(courseIdInt)) {
            updatedCourses.push(courseIdInt);
            
            // Dispatch to Redux to update course enrollment count
            dispatch(enrollStudent({ courseId: courseIdInt, studentId: student.id }));
            
            return {
              ...student,
              courses: updatedCourses,
              enrolledCourses: updatedCourses.length
            };
          }
          return student;
        }
        return student;
      })
    );
    
    // Update selected batch state
    setSelectedBatch(prev => ({
      ...prev,
      studentIds: [...new Set([...prev.studentIds, ...selectedStudentsForBatch])]
    }));
    
    setIsAddToBatchDialogOpen(false);
    setSelectedStudentsForBatch([]);
    toast.success('Students added to batch successfully');
  };
  
  // Helper to get course details by ID
  const getCourseById = (courseId) => {
    return allCourses.find(course => course.id === courseId) || { title: 'Unknown Course' };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage your students and batches</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => {
            setStudentForm(defaultStudentForm);
            setIsAddDialogOpen(true);
          }}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
          <Button onClick={() => {
            setBatchForm(defaultBatchForm);
            setSelectedStudentsForBatch([]);
            setIsCreateBatchDialogOpen(true);
          }}
          variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Create Batch
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="students" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="students">
            <UserPlus className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="batches">
            <Users className="mr-2 h-4 w-4" />
            Batches
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <div className="mt-2">
                    <Input 
                      placeholder="Search students..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredStudents.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No students found</p>
                    ) : (
                      filteredStudents.map(student => (
                        <div 
                          key={student.id}
                          className={`p-4 border rounded-md hover:bg-accent/10 cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-accent/20 border-primary' : 'border-border'}`}
                          onClick={() => setSelectedStudent(student)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{student.name}</h3>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {student.enrolledCourses} courses
                              </Badge>
                              <span className={`text-xs px-2 py-1 rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {student.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Student Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStudent ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <p>{selectedStudent.name}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p>{selectedStudent.email}</p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <p className="capitalize">{selectedStudent.status}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p>{selectedStudent.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label>Enrolled Courses</Label>
                        <div className="flex flex-col gap-1 mt-1">
                          {selectedStudent.courses && selectedStudent.courses.length > 0 ? (
                            selectedStudent.courses.map(courseId => {
                              const course = getCourseById(courseId);
                              return (
                                <Badge key={courseId} variant="secondary" className="text-xs inline-block mr-1 mb-1">
                                  {course.title}
                                </Badge>
                              );
                            })
                          ) : (
                            <p className="text-muted-foreground text-sm">No courses enrolled</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Join Date</Label>
                        <p>{new Date(selectedStudent.joinDate).toLocaleDateString()}</p>
                      </div>
                      {selectedStudent.notes && (
                        <div>
                          <Label>Notes</Label>
                          <p className="text-sm">{selectedStudent.notes}</p>
                        </div>
                      )}
                      <div className="pt-4 space-y-2">
                        <Button 
                          className="w-full"
                          onClick={() => {
                            setCourseAssignmentForm({ 
                              studentId: selectedStudent.id.toString(), 
                              courseId: '' 
                            });
                            setIsAssignCourseDialogOpen(true);
                          }}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Assign Course
                        </Button>
                        <Button variant="outline" className="w-full" onClick={openEditDialog}>Edit Student</Button>
                        <Button variant="destructive" className="w-full" onClick={openDeleteDialog}>Delete Student</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Select a student to view details</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="batches" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Student Batches</CardTitle>
                  <div className="mt-2">
                    <Input 
                      placeholder="Search batches..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredBatches.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No batches found</p>
                    ) : (
                      filteredBatches.map(batch => (
                        <div 
                          key={batch.id}
                          className={`p-4 border rounded-md hover:bg-accent/10 cursor-pointer transition-colors ${selectedBatch?.id === batch.id ? 'bg-accent/20 border-primary' : 'border-border'}`}
                          onClick={() => setSelectedBatch(batch)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{batch.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getCourseById(parseInt(batch.courseId)).title}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-xs">
                                {batch.studentIds?.length || 0} students
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Batch Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedBatch ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Batch Name</Label>
                        <p>{selectedBatch.name}</p>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <p>{selectedBatch.description || 'No description'}</p>
                      </div>
                      <div>
                        <Label>Course</Label>
                        <p>{getCourseById(parseInt(selectedBatch.courseId)).title}</p>
                      </div>
                      <div>
                        <Label>Students</Label>
                        <div className="mt-1">
                          {selectedBatch.studentIds && selectedBatch.studentIds.length > 0 ? (
                            <div className="space-y-1">
                              {selectedBatch.studentIds.map(studentId => {
                                const student = students.find(s => s.id === studentId);
                                return student ? (
                                  <div key={studentId} className="text-sm py-1 px-2 rounded bg-accent/10">
                                    {student.name}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No students in this batch</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Created Date</Label>
                        <p>{new Date(selectedBatch.createdDate).toLocaleDateString()}</p>
                      </div>
                      <div className="pt-4 space-y-2">
                        <Button 
                          className="w-full"
                          onClick={() => {
                            setSelectedStudentsForBatch([]);
                            setIsAddToBatchDialogOpen(true);
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Students
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Select a batch to view details</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={studentForm.name}
                onChange={handleFormChange}
                placeholder="Enter student's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={studentForm.email}
                onChange={handleFormChange}
                placeholder="Enter student's email"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={studentForm.phone}
                onChange={handleFormChange}
                placeholder="Enter student's phone number"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={studentForm.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="joinDate">Join Date</Label>
              <Input 
                id="joinDate" 
                name="joinDate" 
                type="date"
                value={studentForm.joinDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={studentForm.notes}
                onChange={handleFormChange}
                placeholder="Add any additional notes about the student"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={studentForm.name}
                onChange={handleFormChange}
                placeholder="Enter student's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email Address *</Label>
              <Input 
                id="edit-email" 
                name="email" 
                type="email"
                value={studentForm.email}
                onChange={handleFormChange}
                placeholder="Enter student's email"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input 
                id="edit-phone" 
                name="phone" 
                value={studentForm.phone}
                onChange={handleFormChange}
                placeholder="Enter student's phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={studentForm.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-joinDate">Join Date</Label>
              <Input 
                id="edit-joinDate" 
                name="joinDate" 
                type="date"
                value={studentForm.joinDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea 
                id="edit-notes" 
                name="notes" 
                value={studentForm.notes}
                onChange={handleFormChange}
                placeholder="Add any additional notes about the student"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{selectedStudent?.name}</span>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>Delete Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Course Dialog */}
      <Dialog open={isAssignCourseDialogOpen} onOpenChange={setIsAssignCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Course to Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="course-student">Student</Label>
              <Select 
                value={courseAssignmentForm.studentId} 
                onValueChange={(value) => handleCourseAssignmentChange('studentId', value)}
                disabled={Boolean(courseAssignmentForm.studentId)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="course-select">Course</Label>
              <Select 
                value={courseAssignmentForm.courseId} 
                onValueChange={(value) => handleCourseAssignmentChange('courseId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {allCourses.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignCourseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignCourse}>Assign Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Batch Dialog */}
      <Dialog open={isCreateBatchDialogOpen} onOpenChange={setIsCreateBatchDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batch-name">Batch Name *</Label>
                <Input 
                  id="batch-name" 
                  name="name" 
                  value={batchForm.name}
                  onChange={handleBatchFormChange}
                  placeholder="Enter batch name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="batch-course">Course *</Label>
                <Select 
                  value={batchForm.courseId} 
                  onValueChange={handleBatchCourseChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCourses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="batch-description">Description</Label>
              <Textarea 
                id="batch-description" 
                name="description" 
                value={batchForm.description}
                onChange={handleBatchFormChange}
                placeholder="Enter batch description"
                rows={2}
              />
            </div>
            <div>
              <Label className="mb-2 block">Select Students</Label>
              <div className="border rounded-md p-3 max-h-60 overflow-y-auto space-y-2">
                {students.map(student => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`student-${student.id}`} 
                      checked={selectedStudentsForBatch.includes(student.id)}
                      onCheckedChange={(checked) => 
                        handleStudentSelectionForBatch(student.id, checked)
                      }
                    />
                    <Label 
                      htmlFor={`student-${student.id}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {student.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateBatchDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateBatch}>Create Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add to Batch Dialog */}
      <Dialog open={isAddToBatchDialogOpen} onOpenChange={setIsAddToBatchDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Students to Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Batch</Label>
              <p className="text-sm font-medium">{selectedBatch?.name}</p>
              <p className="text-xs text-muted-foreground">
                {getCourseById(parseInt(selectedBatch?.courseId)).title}
              </p>
            </div>
            <div>
              <Label className="mb-2 block">Select Students</Label>
              <div className="border rounded-md p-3 max-h-60 overflow-y-auto space-y-2">
                {students
                  .filter(student => !selectedBatch?.studentIds.includes(student.id))
                  .map(student => (
                    <div key={student.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`add-student-${student.id}`} 
                        checked={selectedStudentsForBatch.includes(student.id)}
                        onCheckedChange={(checked) => 
                          handleStudentSelectionForBatch(student.id, checked)
                        }
                      />
                      <Label 
                        htmlFor={`add-student-${student.id}`}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {student.name}
                      </Label>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToBatchDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudentToBatch}>Add to Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 