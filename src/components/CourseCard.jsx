import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { GraduationCap, Clock, BarChart3, Star } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { CourseDetailModal } from './CourseDetailModal';

export function CourseCard({ course, showActions = true }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
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

  const handleCardClick = () => {
    setShowModal(true);
  };
  
  return (
    <>
      <div 
        className="group relative rounded-lg border border-border bg-card overflow-hidden transition-all hover:shadow-md cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={course.image || '/placeholder.svg?height=200&width=400'}
            alt={course.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Status badge */}
          <div className="absolute top-2 right-2">
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-1">{course.title}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm">{course.rating || 'New'}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
            {course.description}
          </p>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <GraduationCap className="w-3.5 h-3.5 mr-1" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              {getLevelBadge()}
            </div>
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              {course.courseType === 'group' ? (
                <span>Group • {course.students} students</span>
              ) : (
                <span>Private • One-on-one</span>
              )}
            </div>
          </div>
          
          {/* Price tag */}
          <div className="mt-3 flex justify-between items-center">
            <div className="font-bold">
              ${course.price.toFixed(2)}
              {course.courseType === 'solo' && <span className="text-xs font-normal">/hour</span>}
            </div>
            
            {showActions && (
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                }}
                asChild
              >
                <Link to={`/course-management/edit/${course.id}`}>Manage</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Course Detail Modal */}
      {showModal && (
        <CourseDetailModal 
          course={course} 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
} 