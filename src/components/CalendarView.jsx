import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSchedulesSuccess } from '../lib/redux/slices/schedulesSlice';
import { schedules } from '../lib/dummyData';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus } from 'lucide-react';
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  parseISO, 
  isWithinInterval,
  addHours,
  setHours,
  setMinutes,
  differenceInMinutes
} from 'date-fns';
import { cn } from '../lib/utils';

// Time configuration
const CALENDAR_START_HOUR = 8; // 8 AM
const CALENDAR_END_HOUR = 20; // 8 PM
const HOUR_HEIGHT = 60; // 60px per hour

export function CalendarView({ onEventClick }) {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  
  useEffect(() => {
    // Load initial schedules data
    dispatch(fetchSchedulesSuccess(schedules));
  }, [dispatch]);
  
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
  
  // Navigation functions
  const navigateWeek = (direction) => {
    setDate(prev => addDays(prev, direction * 7));
  };

  const navigateToday = () => {
    setDate(new Date());
  };
  
  // Get time blocks
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
  
  // Render event inside day column
  const renderEvent = (schedule, dayIndex) => {
    // Parse schedule time
    const [startTime, endTime] = schedule.time.split(' - ');
    
    // Create time objects
    const scheduleDate = parseISO(schedule.date);
    
    // Extract hours and minutes
    const startParts = startTime.match(/(\d+)(?::(\d+))?\s*(AM|PM)/);
    const endParts = endTime.match(/(\d+)(?::(\d+))?\s*(AM|PM)/);
    
    if (!startParts || !endParts) return null;
    
    let startHour = parseInt(startParts[1]);
    const startMinute = startParts[2] ? parseInt(startParts[2]) : 0;
    const startPeriod = startParts[3];
    
    let endHour = parseInt(endParts[1]);
    const endMinute = endParts[2] ? parseInt(endParts[2]) : 0;
    const endPeriod = endParts[3];
    
    // Convert to 24-hour format
    if (startPeriod === 'PM' && startHour !== 12) startHour += 12;
    if (startPeriod === 'AM' && startHour === 12) startHour = 0;
    if (endPeriod === 'PM' && endHour !== 12) endHour += 12;
    if (endPeriod === 'AM' && endHour === 12) endHour = 0;
    
    // Create date objects
    const startDateTime = setMinutes(setHours(scheduleDate, startHour), startMinute);
    const endDateTime = setMinutes(setHours(scheduleDate, endHour), endMinute);
    
    // Calculate position and height
    const top = (startHour - CALENDAR_START_HOUR) * HOUR_HEIGHT + (startMinute / 60) * HOUR_HEIGHT;
    const duration = differenceInMinutes(endDateTime, startDateTime);
    const height = (duration / 60) * HOUR_HEIGHT;
    
    return (
      <div 
        key={schedule.id}
        className={cn(
          "absolute left-[60px] right-0 rounded-md px-2 py-1 overflow-hidden text-xs",
          schedule.type === 'lesson' ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200" : 
          schedule.type === 'practice' ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200" : 
          schedule.type === 'exam' ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" : 
          "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        )}
        style={{
          top: `${top}px`,
          height: `${height}px`,
        }}
        onClick={() => onEventClick && onEventClick(schedule)}
      >
        <div className="font-medium">
          {schedule.title}
        </div>
        <div className="text-xs opacity-80">
          {startTime} - {endTime}
        </div>
        {schedule.location && (
          <div className="text-xs mt-1 opacity-80 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{schedule.location}</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="calendar-view flex flex-col h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button onClick={navigateToday} variant="outline" size="sm">
            Today
          </Button>
          <div className="flex">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateWeek(-1)}
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateWeek(1)}
              className="rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold">
            {format(startDate, "MMMM d")} - {format(endDate, "MMMM d, yyyy")}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
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
              className="rounded-none"
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
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </div>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-8 border-b mb-2">
        <div className="h-10 flex items-end justify-end pr-2">
          <span className="text-xs text-muted-foreground">GMT-05</span>
        </div>
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className={cn(
              "flex flex-col items-center justify-center py-2",
              isSameDay(day, new Date()) && "bg-primary text-primary-foreground rounded-t-md"
            )}
          >
            <span className="text-xs">{format(day, 'EEE')}</span>
            <span className="text-lg font-semibold">{format(day, 'd')}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar Body */}
      <div className="grid grid-cols-8 flex-grow overflow-auto" style={{
        height: `${(CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1) * HOUR_HEIGHT}px`
      }}>
        {/* Time Gutter */}
        <div className="col-span-1">
          {getTimeBlocks()}
        </div>
        
        {/* Day Columns */}
        {weekDays.map((day, dayIndex) => {
          // Get schedules for this day
          const daySchedules = weekSchedules.filter(schedule => 
            isSameDay(parseISO(schedule.date), day)
          );
          
          return (
            <div key={day.toString()} className="col-span-1 border-l relative">
              {/* Background grid cells */}
              {Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 }).map((_, hourIndex) => (
                <div 
                  key={hourIndex} 
                  className="absolute left-0 right-0 border-t border-border"
                  style={{ top: `${hourIndex * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                />
              ))}
              
              {/* Render day events */}
              {daySchedules.map(schedule => renderEvent(schedule, dayIndex))}
            </div>
          );
        })}
      </div>
    </div>
  );
} 