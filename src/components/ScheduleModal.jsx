import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Clock, MapPin, Calendar, User, Users, ExternalLink, Check, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../lib/auth-context';
import { useDispatch } from 'react-redux';
import { updateSchedule } from '../lib/redux/slices/schedulesSlice';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export function ScheduleModal({ isOpen, onClose, schedule }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(isOpen || false);
  const [availability, setAvailability] = useState(
    schedule?.attendees?.find(a => a.studentId === user?.id)?.status || 'pending'
  );

  useEffect(() => {
    setOpen(isOpen || false);
  }, [isOpen]);

  useEffect(() => {
    if (schedule) {
      setAvailability(
        schedule?.attendees?.find(a => a.studentId === user?.id)?.status || 'pending'
      );
    }
  }, [schedule, user?.id]);

  if (!schedule) return null;

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' && schedule.teacherId === user?.id;
  const canUpdateAvailability = isStudent && !['past', 'canceled'].includes(schedule.status || '');
  
  // Parse date strings to Date objects
  const eventDate = parseISO(schedule.date || new Date().toISOString().split('T')[0]);
  
  // Get schedule time parts with fallback
  const [startTime, endTime] = (schedule.time || '9:00 AM - 10:00 AM').split(' - ');
  
  // Helper to determine if the event is in the past
  const isPastEvent = () => {
    try {
      const today = new Date();
      const eventEndDateTime = new Date(`${schedule.date}T${endTime.replace(/AM|PM/g, '')}`);
      return eventEndDateTime < today;
    } catch (error) {
      return false;
    }
  };
  
  // Helper to get event type badge
  const getEventTypeBadge = () => {
    const eventType = schedule.type || (schedule.recurring ? 'recurring' : 'one-time');
    
    switch(eventType) {
      case 'lesson':
        return <Badge className="bg-blue-500">Lesson</Badge>;
      case 'practice':
        return <Badge className="bg-green-500">Practice</Badge>;
      case 'exam':
        return <Badge className="bg-red-500">Exam</Badge>;
      case 'recurring':
        return <Badge className="bg-purple-500">Recurring</Badge>;
      case 'office-hours':
        return <Badge className="bg-amber-500">Office Hours</Badge>;
      case 'workshop':
        return <Badge className="bg-cyan-500">Workshop</Badge>;
      case 'meeting':
        return <Badge className="bg-indigo-500">Meeting</Badge>;
      default:
        return <Badge className="bg-slate-500">Event</Badge>;
    }
  };
  
  // Helper to get status badge
  const getStatusBadge = () => {
    if (isPastEvent()) return <Badge variant="outline" className="bg-slate-200">Completed</Badge>;
    
    switch(schedule.status) {
      case 'canceled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Canceled</Badge>;
      case 'rescheduled':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Rescheduled</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Scheduled</Badge>;
    }
  };
  
  // Function to handle availability change
  const handleAvailabilityChange = (status) => {
    setAvailability(status);
    
    // Create a new attendees array with the updated status
    const updatedAttendees = [...(schedule.attendees || [])];
    const studentIndex = updatedAttendees.findIndex(a => a.studentId === user?.id);
    
    if (studentIndex >= 0) {
      updatedAttendees[studentIndex] = {
        ...updatedAttendees[studentIndex],
        status
      };
    } else {
      updatedAttendees.push({
        studentId: user?.id,
        studentName: user?.name,
        status
      });
    }
    
    // Dispatch update to Redux store
    dispatch(updateSchedule({
      id: schedule.id,
      attendees: updatedAttendees
    }));
    
    // Close modal
    handleClose();
  };
  
  // Handle joining the virtual class
  const handleJoinClass = () => {
    // In a real app, this would navigate to the virtual classroom
    window.open(`/virtual-classroom/${schedule.courseId}`, '_blank');
  };

  // Handle dialog open/close
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };
  
  const handleOpenChange = (open) => {
    setOpen(open);
    if (!open) {
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-y-auto max-h-[85vh]"
        >
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary/60 to-primary/30 p-6">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center justify-between">
                <span className="text-2xl font-bold">{schedule.title || 'Untitled Event'}</span>
                <div className="flex space-x-2">
                  {getEventTypeBadge()}
                  {getStatusBadge()}
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="space-y-4 p-6">
            {/* Date and time */}
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-start"
            >
              <Calendar className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">{format(eventDate, 'EEEE, MMMM d, yyyy')}</p>
                <p className="text-sm text-gray-500">{schedule.time || 'Time not specified'}</p>
                {schedule.recurring && (
                  <p className="text-xs text-gray-500 mt-1 italic">Recurring event</p>
                )}
              </div>
            </motion.div>
            
            {/* Location */}
            {schedule.location && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-start"
              >
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">{schedule.location}</p>
                  {schedule.location.toLowerCase().includes('virtual') && (
                    <Button 
                      variant="link" 
                      className="h-8 p-0 text-sm"
                      onClick={handleJoinClass}
                    >
                      Join virtual class <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Course info */}
            {schedule.courseId && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex items-start"
              >
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Course: {schedule.title || 'Untitled Course'}</p>
                  {schedule.description && (
                    <p className="text-sm text-gray-500">{schedule.description}</p>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Instructor */}
            {schedule.teacher && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-start"
              >
                <User className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Instructor: {schedule.teacher}</p>
                </div>
              </motion.div>
            )}
            
            {/* Attendees, visible only to instructors */}
            {isTeacher && schedule.attendees && schedule.attendees.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-start"
              >
                <Users className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Attendees ({schedule.attendees.length})</p>
                  <ul className="mt-2 space-y-2">
                    {schedule.attendees.map((attendee, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{attendee.studentName}</span>
                        <Badge className={cn(
                          "ml-2",
                          attendee.status === 'confirmed' && "bg-green-100 text-green-800 border-green-300",
                          attendee.status === 'declined' && "bg-red-100 text-red-800 border-red-300",
                          attendee.status === 'pending' && "bg-amber-100 text-amber-800 border-amber-300"
                        )}>
                          {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
            
            {/* Description */}
            {schedule.description && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="mt-6 border-t pt-4"
              >
                <p className="font-medium mb-2">Description</p>
                <p className="text-sm text-gray-600">{schedule.description}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <DialogFooter className="p-4 border-t">
          {canUpdateAvailability ? (
            <div className="flex w-full justify-between items-center">
              <div className="text-sm text-gray-500">
                Will you attend this event?
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={availability === 'confirmed' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleAvailabilityChange('confirmed')}
                  className={availability === 'confirmed' ? "bg-green-600" : ""}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button 
                  variant={availability === 'declined' ? "destructive" : "outline"} 
                  size="sm"
                  onClick={() => handleAvailabilityChange('declined')}
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          ) : null}
          
          {(isTeacher || user?.role === 'admin') && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
              >
                Cancel Event
              </Button>
            </div>
          )}

          {(!canUpdateAvailability && !isTeacher && user?.role !== 'admin') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClose}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 