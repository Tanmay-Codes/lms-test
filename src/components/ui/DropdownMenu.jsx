import React from 'react';
import { cn } from '../../lib/utils';

// A simple dropdown menu implementation
const DropdownMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  triggerRef: null,
  contentRef: null,
});

export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        contentRef.current &&
        !contentRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = React.forwardRef(({ children, asChild, ...props }, forwardedRef) => {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext);

  const ref = React.useMemo(() => {
    return forwardedRef ? forwardedRef : triggerRef;
  }, [forwardedRef, triggerRef]);

  const child = asChild ? React.Children.only(children) : (
    <button
      type="button"
      className="inline-flex justify-center w-full rounded-md border border-input shadow-sm px-4 py-2 bg-background text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
      {...props}
    >
      {children}
    </button>
  );

  return React.cloneElement(child, {
    ref,
    onClick: (e) => {
      setOpen(!open);
      child.props.onClick?.(e);
    },
    ...props,
  });
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent = ({ 
  children, 
  align = 'center', 
  className, 
  ...props 
}) => {
  const { open, contentRef } = React.useContext(DropdownMenuContext);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute mt-2 rounded-md shadow-lg bg-popover border border-input focus:outline-none z-50",
        {
          "left-0": align === 'start',
          "right-0": align === 'end',
          "left-1/2 transform -translate-x-1/2": align === 'center',
        },
        className
      )}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = React.forwardRef(({ 
  children, 
  className, 
  onClick,
  ...props 
}, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  const handleClick = (e) => {
    onClick?.(e);
    setOpen(false);
  };

  return (
    <button
      ref={ref}
      className={cn(
        "text-popover-foreground block w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuLabel = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "text-popover-foreground font-medium px-4 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = ({ 
  className, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "border-t border-input my-1",
        className
      )}
      {...props}
    />
  );
}; 