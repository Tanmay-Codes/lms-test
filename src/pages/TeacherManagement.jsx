import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { toast } from 'react-hot-toast';

export function TeacherManagement() {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Dr. John Adams',
      email: 'john.adams@example.com',
      status: 'active',
      specialty: 'Piano',
      coursesCount: 4,
      joinDate: '2022-01-15',
      bio: 'Concert pianist with over 15 years of teaching experience. PhD in Music from Juilliard.',
      phone: '555-123-4567'
    },
    {
      id: 2,
      name: 'Prof. Lisa Wang',
      email: 'lisa.wang@example.com',
      status: 'active',
      specialty: 'Music Theory',
      coursesCount: 3,
      joinDate: '2022-03-20',
      bio: 'Professor of Music Theory with expertise in contemporary composition. Author of multiple textbooks.',
      phone: '555-234-5678'
    },
    {
      id: 3,
      name: 'James Miller',
      email: 'james.miller@example.com',
      status: 'inactive',
      specialty: 'Guitar',
      coursesCount: 1,
      joinDate: '2021-11-10',
      bio: 'Professional guitarist specializing in jazz and classical styles. On sabbatical until next term.',
      phone: '555-345-6789'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      status: 'active',
      specialty: 'Violin',
      coursesCount: 2,
      joinDate: '2022-06-05',
      bio: 'Concert violinist with the National Symphony Orchestra. Specializes in teaching advanced students.',
      phone: '555-456-7890'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Teacher form
  const defaultTeacherForm = {
    name: '',
    email: '',
    status: 'active',
    specialty: '',
    bio: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
  };
  
  const [teacherForm, setTeacherForm] = useState(defaultTeacherForm);
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTeacherForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (value) => {
    setTeacherForm(prev => ({
      ...prev,
      status: value
    }));
  };
  
  const handleAddTeacher = () => {
    // Validate form
    if (!teacherForm.name || !teacherForm.email || !teacherForm.specialty) {
      toast.error('Name, email and specialty are required fields');
      return;
    }
    
    // Create new teacher
    const newTeacher = {
      ...teacherForm,
      id: Math.max(0, ...teachers.map(t => t.id)) + 1,
      coursesCount: 0
    };
    
    setTeachers(prev => [...prev, newTeacher]);
    setIsAddDialogOpen(false);
    setTeacherForm(defaultTeacherForm);
    toast.success('Teacher added successfully');
  };
  
  const handleEditTeacher = () => {
    // Validate form
    if (!teacherForm.name || !teacherForm.email || !teacherForm.specialty) {
      toast.error('Name, email and specialty are required fields');
      return;
    }
    
    setTeachers(prev => 
      prev.map(teacher => 
        teacher.id === selectedTeacher.id ? { ...teacher, ...teacherForm } : teacher
      )
    );
    
    setIsEditDialogOpen(false);
    setSelectedTeacher(prevTeacher => ({ ...prevTeacher, ...teacherForm }));
    toast.success('Teacher updated successfully');
  };
  
  const handleDeleteTeacher = () => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== selectedTeacher.id));
    setIsDeleteDialogOpen(false);
    setSelectedTeacher(null);
    toast.success('Teacher deleted successfully');
  };
  
  const openEditDialog = () => {
    if (!selectedTeacher) return;
    
    setTeacherForm({
      name: selectedTeacher.name,
      email: selectedTeacher.email,
      status: selectedTeacher.status,
      specialty: selectedTeacher.specialty,
      bio: selectedTeacher.bio || '',
      phone: selectedTeacher.phone || '',
      joinDate: selectedTeacher.joinDate
    });
    
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = () => {
    if (!selectedTeacher) return;
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">Manage your teaching staff</p>
        </div>
        <Button onClick={() => {
          setTeacherForm(defaultTeacherForm);
          setIsAddDialogOpen(true);
        }}>Add New Teacher</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <div className="mt-2">
                <Input 
                  placeholder="Search teachers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTeachers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No teachers found</p>
                ) : (
                  filteredTeachers.map(teacher => (
                    <div 
                      key={teacher.id}
                      className={`p-4 border rounded-md hover:bg-accent/10 cursor-pointer transition-colors ${selectedTeacher?.id === teacher.id ? 'bg-accent/20 border-primary' : 'border-border'}`}
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{teacher.name}</h3>
                          <p className="text-sm text-muted-foreground">{teacher.specialty}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {teacher.status}
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
              <CardTitle>Teacher Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTeacher ? (
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <p>{selectedTeacher.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <Label>Specialty</Label>
                    <p>{selectedTeacher.specialty}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p className="capitalize">{selectedTeacher.status}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{selectedTeacher.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Courses</Label>
                    <p>{selectedTeacher.coursesCount} active courses</p>
                  </div>
                  <div>
                    <Label>Join Date</Label>
                    <p>{new Date(selectedTeacher.joinDate).toLocaleDateString()}</p>
                  </div>
                  {selectedTeacher.bio && (
                    <div>
                      <Label>Biography</Label>
                      <p className="text-sm">{selectedTeacher.bio}</p>
                    </div>
                  )}
                  <div className="pt-4 space-y-2">
                    <Button className="w-full">View Courses</Button>
                    <Button variant="outline" className="w-full" onClick={openEditDialog}>Edit Teacher</Button>
                    <Button variant="destructive" className="w-full" onClick={openDeleteDialog}>Delete Teacher</Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Select a teacher to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Teacher Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={teacherForm.name}
                onChange={handleFormChange}
                placeholder="Enter teacher's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={teacherForm.email}
                onChange={handleFormChange}
                placeholder="Enter teacher's email"
                required
              />
            </div>
            <div>
              <Label htmlFor="specialty">Specialty *</Label>
              <Input 
                id="specialty" 
                name="specialty" 
                value={teacherForm.specialty}
                onChange={handleFormChange}
                placeholder="e.g. Piano, Violin, Music Theory"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={teacherForm.phone}
                onChange={handleFormChange}
                placeholder="Enter teacher's phone number"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={teacherForm.status} onValueChange={handleStatusChange}>
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
                value={teacherForm.joinDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={teacherForm.bio}
                onChange={handleFormChange}
                placeholder="Enter teacher's professional biography"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTeacher}>Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={teacherForm.name}
                onChange={handleFormChange}
                placeholder="Enter teacher's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email Address *</Label>
              <Input 
                id="edit-email" 
                name="email" 
                type="email"
                value={teacherForm.email}
                onChange={handleFormChange}
                placeholder="Enter teacher's email"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-specialty">Specialty *</Label>
              <Input 
                id="edit-specialty" 
                name="specialty" 
                value={teacherForm.specialty}
                onChange={handleFormChange}
                placeholder="e.g. Piano, Violin, Music Theory"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input 
                id="edit-phone" 
                name="phone" 
                value={teacherForm.phone}
                onChange={handleFormChange}
                placeholder="Enter teacher's phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={teacherForm.status} onValueChange={handleStatusChange}>
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
                value={teacherForm.joinDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-bio">Biography</Label>
              <Textarea 
                id="edit-bio" 
                name="bio" 
                value={teacherForm.bio}
                onChange={handleFormChange}
                placeholder="Enter teacher's professional biography"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTeacher}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Teacher Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Teacher</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{selectedTeacher?.name}</span>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTeacher}>Delete Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 