import React, { useState, useEffect, useRef, cloneElement } from 'react';
import { cn } from '../../lib/utils';

const PopoverContext = React.createContext({
  open: false,
  setOpen: () => {},
});

export function Popover({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false);
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);
  
  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild = false }) {
  const { setOpen } = React.useContext(PopoverContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    setOpen(prev => !prev);
    
    // If the child already has an onClick handler, call it
    if (children.props.onClick) {
      children.props.onClick(e);
    }
  };
  
  if (asChild) {
    return cloneElement(children, {
      onClick: handleClick,
    });
  }
  
  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}

export function PopoverContent({ 
  children, 
  className, 
  align = 'center',
  ...props 
}) {
  const { open, setOpen } = React.useContext(PopoverContext);
  const popoverRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);
  
  if (!open) return null;
  
  const alignClass = align === 'start' ? 'left-0' : 
                     align === 'end' ? 'right-0' : 
                     'left-1/2 transform -translate-x-1/2';
  
  return (
    <div
      ref={popoverRef}
      className={cn(
        "absolute z-50 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700",
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 