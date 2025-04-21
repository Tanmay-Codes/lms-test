import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

export function StudentManagement() {
  const [students] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      status: 'active',
      enrolledCourses: 3,
      joinDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      status: 'active',
      enrolledCourses: 2,
      joinDate: '2023-02-20',
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@example.com',
      status: 'inactive',
      enrolledCourses: 1,
      joinDate: '2022-11-10',
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@example.com',
      status: 'active',
      enrolledCourses: 4,
      joinDate: '2023-03-05',
    },
    {
      id: 5,
      name: 'Eva Garcia',
      email: 'eva@example.com',
      status: 'active',
      enrolledCourses: 2,
      joinDate: '2023-01-30',
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage your students</p>
        </div>
        <Button>Add New Student</Button>
      </div>
      
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
                        <div className="flex items-center">
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
                    <Label>Enrolled Courses</Label>
                    <p>{selectedStudent.enrolledCourses}</p>
                  </div>
                  <div>
                    <Label>Join Date</Label>
                    <p>{new Date(selectedStudent.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Button className="w-full">View Courses</Button>
                    <Button variant="outline" className="w-full">Edit Student</Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Select a student to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 