import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { CheckIcon } from 'lucide-react';

const Checkbox = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <div
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      ref={ref}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      data-state={checked ? "checked" : "unchecked"}
      {...props}
    >
      {checked && (
        <CheckIcon className="h-3 w-3 text-current" />
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox }; 