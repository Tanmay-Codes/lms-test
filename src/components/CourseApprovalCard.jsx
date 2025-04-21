import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { approveCourse, rejectCourse } from '../lib/redux/slices/coursesSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/Dialog';
import { Check, X, Edit, Eye } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Link } from 'react-router-dom';

export function CourseApprovalCard({ course, onEdit }) {
  const dispatch = useDispatch();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [price, setPrice] = useState(course.price.toString());
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    dispatch(approveCourse({
      courseId: course.id,
      price: parseFloat(price),
    }));
    setIsApproveDialogOpen(false);
  };

  const handleReject = () => {
    dispatch(rejectCourse({
      courseId: course.id,
      reason: rejectionReason,
    }));
    setIsRejectDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={course.image || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop'} 
          alt={course.title} 
          className="object-cover w-full h-40" 
        />
        <div className="absolute top-2 right-2">
          <Badge variant="warning" className="bg-amber-500">Pending Review</Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
          <div className="flex justify-between col-span-2">
            <span className="font-medium">Instructor:</span>
            <span>{course.instructor}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Level:</span>
            <span>{course.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Duration:</span>
            <span>{course.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Type:</span>
            <span className="capitalize">{course.courseType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Price:</span>
            <span>${course.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="grid grid-cols-4 gap-2 pt-0">
        <Button 
          variant="outline" 
          size="sm"
          className="col-span-1"
          asChild
        >
          <Link to={`/courses/${course.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="col-span-1"
          onClick={() => onEdit(course)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="destructive" 
          size="sm"
          className="col-span-1"
          onClick={() => setIsRejectDialogOpen(true)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          className="col-span-1"
          onClick={() => setIsApproveDialogOpen(true)}
        >
          <Check className="h-4 w-4" />
        </Button>
      </CardFooter>
      
      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Course</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="price">Set Price ($)</Label>
            <Input 
              id="price" 
              type="number" 
              step="0.01" 
              min="0" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="0.00" 
            />
            <p className="text-sm text-muted-foreground mt-1">
              Set the final price for this course. This will be visible to students.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove}>Approve Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Course</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionReason">Rejection Reason</Label>
            <Textarea 
              id="rejectionReason" 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)} 
              placeholder="Provide feedback to the instructor..." 
              rows={3}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              This feedback will be sent to the instructor to help them improve the course.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 