import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

export function TeacherManagement() {
  const [teachers] = useState([
    {
      id: 1,
      name: 'Dr. John Adams',
      email: 'john.adams@example.com',
      status: 'active',
      specialty: 'Piano',
      coursesCount: 4,
      joinDate: '2022-01-15',
    },
    {
      id: 2,
      name: 'Prof. Lisa Wang',
      email: 'lisa.wang@example.com',
      status: 'active',
      specialty: 'Music Theory',
      coursesCount: 3,
      joinDate: '2022-03-20',
    },
    {
      id: 3,
      name: 'James Miller',
      email: 'james.miller@example.com',
      status: 'inactive',
      specialty: 'Guitar',
      coursesCount: 1,
      joinDate: '2021-11-10',
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      status: 'active',
      specialty: 'Violin',
      coursesCount: 2,
      joinDate: '2022-06-05',
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">Manage your teaching staff</p>
        </div>
        <Button>Add New Teacher</Button>
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
                    <Label>Courses</Label>
                    <p>{selectedTeacher.coursesCount} active courses</p>
                  </div>
                  <div>
                    <Label>Join Date</Label>
                    <p>{new Date(selectedTeacher.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Button className="w-full">View Courses</Button>
                    <Button variant="outline" className="w-full">Edit Teacher</Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Select a teacher to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 