import React from 'react';
import { cn } from '../../lib/utils';

export const Switch = React.forwardRef(({ 
  className, 
  checked, 
  onCheckedChange,
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);
  
  React.useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);
  
  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    onCheckedChange?.(newValue);
  };
  
  return (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
      <div className={cn(
        "relative w-11 h-6 bg-gray-200 rounded-full transition-colors",
        isChecked ? "bg-primary" : "bg-gray-200"
      )}>
        <div className={cn(
          "absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform",
          isChecked ? "transform translate-x-5" : ""
        )} />
      </div>
    </label>
  );
});

Switch.displayName = "Switch"; 