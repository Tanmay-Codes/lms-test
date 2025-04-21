import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const SelectContext = React.createContext({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  triggerRef: null,
});

export function Select({ children, value, onValueChange, defaultValue }) {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "");
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  
  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: selectedValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        triggerRef,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, placeholder }) {
  const { value, open, setOpen, triggerRef } = React.useContext(SelectContext);
  
  return (
    <div
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "cursor-pointer relative",
        open && "ring-2 ring-ring ring-offset-2",
        className
      )}
    >
      {children || <span className="text-muted-foreground">{placeholder || "Select an option"}</span>}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", open && "transform rotate-180")} />
    </div>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext);
  
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ children, className, align = "center" }) {
  const { open, setOpen, triggerRef } = React.useContext(SelectContext);
  const contentRef = React.useRef(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    const updatePosition = () => {
      if (triggerRef.current && open) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [open, setOpen, triggerRef]);
  
  if (!open) return null;
  
  return (
    <div
      ref={contentRef}
      className={cn(
        "fixed z-50 mt-1 max-h-[300px] overflow-auto rounded-md border border-input bg-popover shadow-md",
        className
      )}
      style={{
        top: `${position.top + 5}px`,
        left: align === "start" ? `${position.left}px` : 
              align === "end" ? `${position.left + position.width - (contentRef.current?.offsetWidth || position.width)}px` : 
              `${position.left}px`,
        width: position.width,
        zIndex: 9999,
      }}
    >
      <div className="py-1">{children}</div>
    </div>
  );
}

export function SelectItem({ children, value, className }) {
  const { value: selectedValue, onValueChange } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none text-popover-foreground",
        "hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
        isSelected ? "bg-primary/10 text-primary font-medium" : "",
        className
      )}
      onClick={() => onValueChange(value)}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4 text-primary" />}
      </span>
      <span className="pl-6">{children}</span>
    </div>
  );
}

// Enhanced SimpleSelect using our custom Select components
const SimpleSelect = React.forwardRef(({ 
  className, 
  children,
  value,
  onChange,
  name,
  id,
  placeholder = "Select an option",
  ...props 
}, ref) => {
  // Get options from children
  const options = React.Children.toArray(children)
    .filter(child => child.type === 'option')
    .map(child => ({
      value: child.props.value,
      label: child.props.children
    }));

  // Handle value change
  const handleValueChange = (newValue) => {
    if (onChange) {
      // Create a synthetic event object similar to a native select
      const syntheticEvent = {
        target: {
          name,
          value: newValue
        },
        currentTarget: {
          name,
          value: newValue
        }
      };
      onChange(syntheticEvent);
    }
  };

  // Find the selected label
  const selectedLabel = options.find(option => option.value === value)?.label || placeholder;

  return (
    <div ref={ref} className="relative" {...props}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className={className} id={id}>
          <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Hidden native select for form submission if needed */}
      <select
        name={name}
        value={value || ""}
        onChange={() => {}}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        {children}
      </select>
    </div>
  );
});

SimpleSelect.displayName = "SimpleSelect";

export { SimpleSelect }; 