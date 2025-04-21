import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../lib/auth-context';
import { fetchCoursesSuccess, setFilteredTeacher, clearTeacherFilter } from '../lib/redux/slices/coursesSlice';
import { courses, users } from '../lib/dummyData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { SimpleSelect } from '../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { CourseCard } from '../components/CourseCard';
import { Music, Search, Filter, Users } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/DropdownMenu';

export function Courses() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get the filtered teacher ID from Redux
  const filteredTeacherId = useSelector(state => state.courses.filteredTeacherId);
  
  // Get teachers for dropdown
  const teachers = users.filter(u => u.role === 'teacher');
  
  useEffect(() => {
    // Load initial courses data
    dispatch(fetchCoursesSuccess(courses));
  }, [dispatch]);
  
  const allCourses = useSelector(state => state.courses.courses);
  
  // Filter courses based on search, status filter, and teacher filter (for admin)
  const filteredCourses = allCourses.filter(course => {
    // Text search filter
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatusFilter = true;
    if (activeTab === 'active') matchesStatusFilter = course.status === 'active';
    if (activeTab === 'upcoming') matchesStatusFilter = course.status === 'upcoming';
    if (activeTab === 'completed') matchesStatusFilter = course.status === 'completed';
    
    // Teacher filter (for admin only)
    let matchesTeacherFilter = true;
    if (user?.role === 'admin' && filteredTeacherId) {
      matchesTeacherFilter = course.instructorId === filteredTeacherId;
    }
    
    return matchesSearch && matchesStatusFilter && matchesTeacherFilter;
  });
  
  const handleTeacherFilterChange = (teacherId) => {
    if (teacherId === 'all') {
      dispatch(clearTeacherFilter());
    } else {
      dispatch(setFilteredTeacher(teacherId));
    }
  };
  
  const renderCourseList = () => {
    if (filteredCourses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg">
          <Music className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  };
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">Browse and manage your music courses</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter dropdown for admin */}
          {user?.role === 'admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  {filteredTeacherId ? 'Filtered' : 'Filter'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="font-medium mb-2 flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Filter by Teacher
                  </div>
                  <div className="space-y-1">
                    <DropdownMenuItem 
                      className={!filteredTeacherId ? 'bg-accent' : ''}
                      onClick={() => handleTeacherFilterChange('all')}
                    >
                      All Teachers
                    </DropdownMenuItem>
                    {teachers.map(teacher => (
                      <DropdownMenuItem 
                        key={teacher.id}
                        className={filteredTeacherId === teacher.id ? 'bg-accent' : ''}
                        onClick={() => handleTeacherFilterChange(teacher.id)}
                      >
                        {teacher.name}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Show active teacher filter if one is selected */}
      {user?.role === 'admin' && filteredTeacherId && (
        <div className="flex items-center bg-accent/30 p-2 rounded-md">
          <span className="text-sm">Filtered by teacher: </span>
          <span className="ml-1 font-medium">
            {teachers.find(t => t.id === filteredTeacherId)?.name || 'Unknown'}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 h-6" 
            onClick={() => dispatch(clearTeacherFilter())}
          >
            Clear filter
          </Button>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {renderCourseList()}
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          {renderCourseList()}
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          {renderCourseList()}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {renderCourseList()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 