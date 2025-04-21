import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { addSchedule } from '../lib/redux/slices/schedulesSlice';
import { format } from 'date-fns';
import { DateRangePicker } from './ui/DateRangePicker';
import { useAuth } from '../lib/auth-context';
import { Clock, MapPin, Calendar, User, Info, Check } from 'lucide-react';

export function NewEventModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const initialFormData = {
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    type: 'lesson',
    recurring: false,
    description: '',
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [open, setOpen] = useState(isOpen || false);
  
  useEffect(() => {
    setOpen(isOpen || false);
  }, [isOpen]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };
  
  const formatTimeForDisplay = (hours, minutes) => {
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${period}`;
  };
  
  // Generate time options for dropdown (30 min intervals)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourString = hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        const timeValue = `${hourString}:${minuteString}`;
        const displayTime = formatTimeForDisplay(hourString, minuteString);
        options.push({ value: timeValue, label: displayTime });
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format time strings to AM/PM format
    const [startHours, startMinutes] = formData.startTime.split(':');
    const [endHours, endMinutes] = formData.endTime.split(':');
    
    const startTimeFormatted = formatTimeForDisplay(startHours, startMinutes);
    const endTimeFormatted = formatTimeForDisplay(endHours, endMinutes);

    // Create ISO-format date strings for the start and end times
    const startDate = new Date(formData.date);
    startDate.setHours(parseInt(startHours), parseInt(startMinutes));
    
    const endDate = new Date(formData.date);
    endDate.setHours(parseInt(endHours), parseInt(endMinutes));
    
    const newEvent = {
      id: `event-${Date.now()}`, // Generate unique ID
      title: formData.title,
      date: format(formData.date, 'yyyy-MM-dd'),
      startTime: startDate.toISOString(), // Store as ISO strings for consistent handling
      endTime: endDate.toISOString(),
      time: `${startTimeFormatted} - ${endTimeFormatted}`,
      location: formData.location,
      type: formData.type,
      recurring: formData.recurring,
      description: formData.description,
      teacherId: user?.id || '',
      teacher: user?.name || '',
      attendees: [],
      courseId: null, // Set to actual course ID if this is related to a course
      status: 'scheduled'
    };
    
    dispatch(addSchedule(newEvent));
    setFormData(initialFormData);
    handleClose();
  };
  
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };
  
  const handleOpenChange = (open) => {
    setOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Create New Event
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-medium">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Date
              </div>
            </Label>
            <DateRangePicker
              date={formData.date}
              onDateChange={handleDateChange}
              className="w-full"
              formatString="EEEE, MMMM d, yyyy"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="startTime" className="text-base font-medium">Start Time</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => handleSelectChange('startTime', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="endTime" className="text-base font-medium">End Time</Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) => handleSelectChange('endTime', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="location" className="text-base font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location
              </div>
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Physical location or 'Virtual'"
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="type" className="text-base font-medium">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Event Type
              </div>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lesson">Lesson</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="office-hours">Office Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <input
              type="checkbox"
              id="recurring"
              name="recurring"
              checked={formData.recurring}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="recurring" className="cursor-pointer flex items-center gap-2">
              <Check className={`h-4 w-4 ${formData.recurring ? 'text-primary' : 'text-gray-300'}`} />
              Make this a recurring event
            </Label>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details about this event"
              rows={3}
              className="w-full resize-none"
            />
          </div>
          
          <DialogFooter className="pt-4 space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Calendar className="h-4 w-4" />
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 