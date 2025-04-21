import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Calendar } from './Calendar';
import { Calendar as CalendarIcon } from 'lucide-react';

export function DateRangePicker({ 
  date, 
  onDateChange, 
  className,
  showAsPopover = true,
  formatString = "MMMM d, yyyy",
  hideNavigation = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  
  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);
  
  const handleSelect = (newDate) => {
    if (!newDate) return;
    
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
    setIsOpen(false);
  };
  
  const formattedDate = selectedDate ? format(selectedDate, formatString) : "Select date";
  
  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formattedDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            defaultMonth={selectedDate}   
            className="rounded-md border"
            hideNavigation={hideNavigation}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 