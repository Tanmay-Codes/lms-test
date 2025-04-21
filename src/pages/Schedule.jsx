import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSchedulesSuccess } from '../lib/redux/slices/schedulesSlice';
import { schedules } from '../lib/dummyData';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Plus, 
  Calendar as CalendarIcon,
  List,
  Grid,
  Info
} from 'lucide-react';
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  parseISO, 
  isWithinInterval,
  setHours,
  setMinutes,
  differenceInMinutes,
  addMonths,
  subMonths,
  subDays,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getHours,
  getMinutes,
  isToday
} from 'date-fns';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth-context';
import { ScheduleModal } from '../components/ScheduleModal';
import { NewEventModal } from '../components/NewEventModal';
import { DateRangePicker } from '../components/ui/DateRangePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

// Time configuration for day and week views
const CALENDAR_START_HOUR = 0; // 12 AM (midnight)
const CALENDAR_END_HOUR = 23; // 11 PM
const HOUR_HEIGHT = 60; // 60px per hour

// Create array of hour slots for the calendar
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = CALENDAR_START_HOUR; hour <= CALENDAR_END_HOUR; hour++) {
    slots.push(hour);
  }
  return slots;
};

export function Schedule() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const calendarBodyRef = useRef(null);
  const currentTimeRef = useRef(null);
  const containerRef = useRef(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Generate time slots for the calendar
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  
  useEffect(() => {
    // Load initial schedules data
    dispatch(fetchSchedulesSuccess(schedules));
  }, [dispatch]);
  
  useEffect(() => {
    if (view === 'week') {
      setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 0 }));
    }
  }, [date, view]);
  
  // Scroll to current time on initial render and when view changes
  useEffect(() => {
    if ((view === 'day' || view === 'week') && calendarBodyRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const scrollPosition = currentHour * HOUR_HEIGHT + 
                             (currentMinutes / 60) * HOUR_HEIGHT;
      
      // Scroll to current time minus some offset to center it in the viewport
      const offset = calendarBodyRef.current.clientHeight / 3;
      calendarBodyRef.current.scrollTop = Math.max(0, scrollPosition - offset);
    }
  }, [view]);
  
  // Current time indicator
  useEffect(() => {
    if (view === 'day' || view === 'week') {
      const updateCurrentTimePosition = () => {
        if (currentTimeRef.current) {
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinutes = now.getMinutes();
          
          const top = currentHour * HOUR_HEIGHT + 
                       (currentMinutes / 60) * HOUR_HEIGHT;
          
          currentTimeRef.current.style.top = `${top}px`;
          currentTimeRef.current.style.display = 'block';
        }
      };
      
      updateCurrentTimePosition();
      const interval = setInterval(updateCurrentTimePosition, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [view]);
  
  const allSchedules = useSelector(state => state.schedules.schedules);
  
  // Get week dates
  const startDate = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
  const endDate = endOfWeek(date, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => 
    addDays(startDate, i)
  );
  
  // Filter schedules for the selected week
  const weekSchedules = allSchedules.filter(schedule => {
    const scheduleDate = parseISO(schedule.date);
    return isWithinInterval(scheduleDate, { start: startDate, end: endDate });
  });
  
  // Group schedules by day for month view
  const schedulesByDay = weekDays.map(day => {
    return {
      date: day,
      schedules: weekSchedules.filter(schedule => 
        isSameDay(parseISO(schedule.date), day)
      ).sort((a, b) => (a.time || "").localeCompare(b.time || ""))
    };
  });
  
  // Navigation functions
  const navigateDate = (direction) => {
    if (view === 'day') {
      setDate(prev => addDays(prev, direction));
    } else if (view === 'week') {
      setDate(prev => addDays(prev, direction * 7));
    } else if (view === 'month') {
      // For month view, navigate by months
      setDate(prev => direction > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

  const navigateToday = () => {
    setDate(new Date());
  };
  
  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  // Handle new event modal
  const handleNewEvent = () => {
    setShowNewEventModal(true);
  };

  // Handle closing event modal
  const handleCloseEventModal = () => {
    setShowEventModal(false);
  };

  // Handle closing new event modal
  const handleCloseNewEventModal = () => {
    setShowNewEventModal(false);
  };
  
  // Get time blocks for day/week view
  const getTimeBlocks = () => {
    const blocks = [];
    for (let hour = CALENDAR_START_HOUR; hour <= CALENDAR_END_HOUR; hour++) {
      blocks.push(
        <div key={hour} className="time-block flex border-t border-border h-[60px]">
          <div className="time-label w-[60px] pr-2 text-xs text-right text-muted-foreground -mt-2.5">
            {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
          </div>
        </div>
      );
    }
    return blocks;
  };
  
  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    return weekSchedules.filter(schedule => 
      isSameDay(parseISO(schedule.date), day)
    );
  };

  const calculateEventPosition = (event) => {
    if (!event.startTime || !event.endTime) {
      // For legacy events that don't have startTime and endTime
      return { top: '0px', height: '30px' };
    }
    
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    
    // Calculate position relative to calendar start hour (now 0)
    const startMinutesFromCalendarStart = (startHour * 60) + startMinute;
    const endMinutesFromCalendarStart = (endHour * 60) + endMinute;
    
    // Convert to pixels (60px per hour = 1px per minute)
    const top = startMinutesFromCalendarStart;
    const height = endMinutesFromCalendarStart - startMinutesFromCalendarStart;
    
    return {
      top: `${top}px`,
      height: `${Math.max(height, 20)}px`, // Ensure minimum height
    };
  };
  
  // Function to get the appropriate color based on event type or course
  const getEventColor = (event) => {
    // Map event types to colors
    const colorMap = {
      'lecture': 'bg-blue-100 border-blue-500 text-blue-800',
      'exam': 'bg-red-100 border-red-500 text-red-800',
      'workshop': 'bg-green-100 border-green-500 text-green-800',
      'assignment': 'bg-purple-100 border-purple-500 text-purple-800',
      'meeting': 'bg-amber-100 border-amber-500 text-amber-800',
      'practice': 'bg-cyan-100 border-cyan-500 text-cyan-800',
      'lesson': 'bg-indigo-100 border-indigo-500 text-indigo-800'
    };
    
    // Return color based on event type or default to primary
    return colorMap[event.type?.toLowerCase()] || 'bg-primary/10 border-primary text-primary-foreground';
  };

  // Improve overlapping events handling
  const calculateOverlappingEventStyles = (events, event, index) => {
    // Find events that overlap with this one
    const overlappingEvents = events.filter((e, i) => {
      if (i === index) return false;
      
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      const eStart = new Date(e.startTime);
      const eEnd = new Date(e.endTime);
      
      return (
        (eStart >= eventStart && eStart < eventEnd) || 
        (eEnd > eventStart && eEnd <= eventEnd) ||
        (eStart <= eventStart && eEnd >= eventEnd)
      );
    });
    
    if (overlappingEvents.length === 0) {
      return { width: '95%', left: '2.5%' };
    }
    
    // Group overlapping events
    const overlappingGroup = [event, ...overlappingEvents].sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );
    
    const position = overlappingGroup.findIndex(e => e.id === event.id);
    const width = `${95 / overlappingGroup.length}%`;
    const left = `${2.5 + (position * (95 / overlappingGroup.length))}%`;
    
    return { width, left };
  };

  const renderDayEvents = (day) => {
    const eventsForDay = getEventsForDay(day);
    
    return eventsForDay.map((event, index) => {
      const { top, height } = calculateEventPosition(event);
      const { width, left } = calculateOverlappingEventStyles(eventsForDay, event, index);
      const colorClass = getEventColor(event);
      
      return (
        <div
          key={event.id}
          className={`absolute rounded-md p-2 overflow-hidden border-l-4 shadow-sm hover:shadow-md transition-shadow ${colorClass}`}
          style={{
            top,
            height,
            width,
            left,
            zIndex: 5
          }}
          title={`${event.title} - ${format(new Date(event.startTime), 'h:mm a')} to ${format(new Date(event.endTime), 'h:mm a')}`}
          onClick={() => handleEventClick(event)}
        >
          <div className="text-xs font-semibold truncate">{event.title}</div>
          {height > 40 && (
            <div className="text-xs truncate">
              {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
            </div>
          )}
          {height > 60 && (
            <div className="text-xs truncate mt-1">{event.location}</div>
          )}
        </div>
      );
    });
  };

  const renderDayColumn = (day, index) => {
    const isToday = isSameDay(day, new Date());
    
    return (
      <div key={index} className="day-column flex-1 relative border-r border-border last:border-r-0">
        <div className={cn(
          "sticky top-0 z-10 bg-background border-b border-border p-2 text-center",
          isToday && "bg-primary/5"
        )}>
          <div className="text-xs font-medium">{format(day, 'EEE')}</div>
          <div className={cn(
            "text-sm font-bold rounded-full mx-auto w-7 h-7 flex items-center justify-center",
            isToday && "bg-primary text-primary-foreground"
          )}>
            {format(day, 'd')}
          </div>
        </div>
        <div className="relative">
          {timeSlots.map((hour) => (
            <div 
              key={hour} 
              className={cn(
                "time-slot h-[60px] border-b border-border",
                hour >= 9 && hour <= 17 && "bg-gray-50 dark:bg-gray-900/20" // Highlight business hours
              )}
            ></div>
          ))}
          {renderDayEvents(day)}
          {isToday && (
            <div 
              className="current-time absolute w-full h-0.5 bg-red-500 z-10"
              style={{ 
                top: `${(new Date().getHours() * 60) + new Date().getMinutes()}px`,
              }}
            >
              <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = weekDays;
    
    return (
      <div className="week-view flex h-full overflow-hidden">
        <div ref={calendarBodyRef} className="flex-grow overflow-auto">
          <div className="flex">
            {/* Empty corner for header alignment */}
            <div className="time-gutter-header w-16 h-[60px] bg-background border-r border-b border-border z-20 sticky top-0 left-0"></div>
            
            {/* Day headers */}
            <div className="flex flex-1 sticky top-0 z-20">
              {days.map((day, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex-1 border-r border-b border-border p-2 text-center bg-background",
                    isToday(day) && "bg-primary/5"
                  )}
                >
                  <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                  <div className={cn(
                    "text-sm font-bold rounded-full mx-auto w-7 h-7 flex items-center justify-center",
                    isToday(day) && "bg-primary text-primary-foreground"
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
            {renderTimeGutter()}
            <div className="flex flex-1">
              {days.map((day, index) => (
                <div key={index} className="day-column flex-1 relative border-r border-border last:border-r-0">
                  <div className="relative">
                    {timeSlots.map((hour) => (
                      <div 
                        key={hour} 
                        className={cn(
                          "time-slot h-[60px] border-b border-border",
                          hour >= 9 && hour <= 17 && "bg-gray-50 dark:bg-gray-900/20" // Highlight business hours
                        )}
                      ></div>
                    ))}
                    {renderDayEvents(day)}
                    {isToday(day) && (
                      <div 
                        className="current-time absolute w-full h-0.5 bg-red-500 z-10"
                        style={{ 
                          top: `${(new Date().getHours() * 60) + new Date().getMinutes()}px`,
                        }}
                      >
                        <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render content based on view
  const renderContent = () => {
    if (view === 'day') {
      // Day view - single column with hours
      return (
        <div className="border rounded-md overflow-hidden flex-grow flex flex-col">
          <div className="bg-background sticky top-0 z-20 border-b">
            <div className="h-12 flex items-center justify-center">
              <span className="text-lg font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
            </div>
          </div>
          
          <div className="flex-grow relative">
            <div 
              ref={calendarBodyRef}
              className="overflow-auto absolute inset-0"
            >
              <div className="min-w-full relative"
                style={{ height: `${(CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1) * HOUR_HEIGHT}px` }}
              >
                {/* Time column and grid */}
                <div className="absolute left-0 top-0 bottom-0 w-[60px] bg-background z-10 border-r">
                  {getTimeBlocks().map((block, i) => (
                    <div key={i} className="relative">{block}</div>
                  ))}
                </div>
                
                {/* Events area */}
                <div className="absolute left-[60px] right-0 top-0 bottom-0">
                  {/* Grid lines */}
                  {Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 }).map((_, hourIndex) => (
                    <div 
                      key={hourIndex} 
                      className="absolute left-0 right-0 border-t border-border"
                      style={{ top: `${hourIndex * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                    />
                  ))}
                
                  {/* Current time indicator */}
                  <div 
                    ref={currentTimeRef}
                    className="absolute left-0 right-0 border-t-2 border-red-500 z-20"
                  >
                    <div className="absolute -top-2 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  
                  {/* Day events */}
                  {weekSchedules
                    .filter(schedule => isSameDay(parseISO(schedule.date), date))
                    .map((schedule, idx) => (
                      <div key={`${schedule.id}-${idx}`} className="absolute inset-0">
                        {renderDayEvents(schedule.date)}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (view === 'week') {
      // Week view - multiple columns with days and hours
      return renderWeekView();
    } else {
      // Month view - grid with days
      return (
        <div className="border rounded-md p-4 overflow-hidden flex-grow flex flex-col">
          {/* Month Header */}
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold">{format(startDate, "MMMM yyyy")}</h3>
          </div>
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 overflow-auto flex-grow" style={{ maxHeight: 'calc(100vh - 260px)' }}>
            {schedulesByDay.map((day) => (
              <div 
                key={day.date.toString()} 
                className="border rounded-md overflow-hidden flex flex-col min-h-[120px]"
              >
                <div 
                  className={cn(
                    "text-center p-2 font-medium border-b sticky top-0 z-10 bg-background",
                    isSameDay(day.date, new Date()) ? "bg-primary text-primary-foreground" : ""
                  )}
                >
                  <div>{format(day.date, 'd')}</div>
                </div>
                <div className="p-1 overflow-auto" style={{ maxHeight: '180px' }}>
                  {day.schedules.length > 0 ? (
                    day.schedules.map((schedule, idx) => (
                      <div key={`${schedule.id || idx}`}>
                        {renderTimeSlot(schedule)}
                      </div>
                    ))
                  ) : (
                    <div className="h-12 flex items-center justify-center text-xs text-muted-foreground">
                      No events
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };
  
  const handleDateChange = (date) => {
    setDate(date);
  };

  const goToPreviousDay = () => {
    setDate(subDays(date, 1));
  };

  const goToNextDay = () => {
    setDate(addDays(date, 1));
  };

  const goToPreviousWeek = () => {
    setDate(subWeeks(date, 1));
  };

  const goToNextWeek = () => {
    setDate(addWeeks(date, 1));
  };

  const goToToday = () => {
    setDate(new Date());
  };

  // Render a time slot for month view
  const renderTimeSlot = (schedule) => {
    const colorClass = getEventColor(schedule);
    
    return (
      <div 
        key={schedule.id}
        className={cn(
          "p-2 rounded-md mb-2 cursor-pointer border-l-4 hover:shadow-md transition-shadow",
          colorClass
        )}
        onClick={() => handleEventClick(schedule)}
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm truncate max-w-[70%]">{schedule.title}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-background/50">
            {schedule.type ? schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1) : 'Event'}
          </span>
        </div>
        <div className="flex items-center text-xs mt-1">
          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {format(new Date(schedule.startTime), 'h:mm a')} - {format(new Date(schedule.endTime), 'h:mm a')}
          </span>
        </div>
        {schedule.location && (
          <div className="flex items-center text-xs mt-0.5">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{schedule.location}</span>
          </div>
        )}
      </div>
    );
  };

  // Function to render the time gutter
  const renderTimeGutter = () => {
    return (
      <div className="time-gutter w-16 bg-background border-r border-border z-10 sticky left-0">
        {timeSlots.map((hour) => (
          <div key={hour} className="time-slot h-[60px] flex items-start justify-end pr-2 pb-8 text-xs text-muted-foreground">
            {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Schedule</h2>
          <p className="text-muted-foreground">Manage your lessons, practice sessions, and exams</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* View Selector */}
          <div className="flex">
            <Button 
              variant={view === 'day' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setView('day')}
              className="rounded-r-none"
            >
              Day
            </Button>
            <Button 
              variant={view === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setView('week')}
              className="rounded-none border-x-0"
            >
              Week
            </Button>
            <Button 
              variant={view === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setView('month')}
              className="rounded-l-none"
            >
              Month
            </Button>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button onClick={goToToday} variant="outline" size="sm">
              Today
            </Button>
            {view === 'day' ? (
              <div className="flex">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={goToPreviousDay}
                  className="rounded-r-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={goToNextDay}
                  className="rounded-l-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={goToPreviousWeek}
                  className="rounded-r-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={goToNextWeek}
                  className="rounded-l-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Date Picker */}
            <div className="relative">
              <DateRangePicker 
                date={date} 
                onDateChange={handleDateChange} 
                className="w-[260px]" 
              />
            </div>
          </div>
          
          {/* Actions */}
          <Button size="sm" onClick={handleNewEvent}>
            <Plus className="h-4 w-4 mr-1" />
            New Event
          </Button>
        </div>
      </div>
      
      {/* Calendar Content */}
      <div className="flex-grow overflow-hidden">
        {renderContent()}
      </div>
      
      {/* Event Modals */}
      {selectedEvent && (
        <ScheduleModal 
          isOpen={showEventModal} 
          onClose={handleCloseEventModal} 
          schedule={selectedEvent} 
        />
      )}
      
      <NewEventModal 
        isOpen={showNewEventModal} 
        onClose={handleCloseNewEventModal} 
      />
    </div>
  );
} 