import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

const DialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

export function Dialog({ children, open = false, onOpenChange }) {
  // Use a ref to track previous prop values
  const previousOpenRef = React.useRef(open);
  const [isOpen, setIsOpen] = React.useState(open);
  
  // Only update internal state if the prop actually changed
  React.useEffect(() => {
    if (previousOpenRef.current !== open) {
      setIsOpen(open);
      previousOpenRef.current = open;
    }
  }, [open]);
  
  // Only notify parent about changes that originated internally
  const handleOpenChange = React.useCallback((newOpen) => {
    if (newOpen !== isOpen) {
      setIsOpen(newOpen);
      
      if (onOpenChange) {
        onOpenChange(newOpen);
      }
    }
  }, [isOpen, onOpenChange]);
  
  // Handle ESC key to close dialog
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleOpenChange(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, handleOpenChange]);
  
  const contextValue = React.useMemo(() => ({
    open: isOpen,
    setOpen: handleOpenChange
  }), [isOpen, handleOpenChange]);
  
  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild, ...props }) {
  const { setOpen } = React.useContext(DialogContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick,
    });
  }
  
  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export function DialogContent({ children, className, ...props }) {
  const { open, setOpen } = React.useContext(DialogContext);
  
  if (!open) return null;
  
  // Prevent clicks inside DialogContent from closing the dialog
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Click on the backdrop (outside the content) should close the dialog
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "relative bg-background rounded-lg shadow-lg w-full max-w-md p-6 max-h-[85vh] overflow-y-auto",
          className
        )}
        onClick={handleContentClick}
        {...props}
      >
        <button
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-accent"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("mb-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
} 