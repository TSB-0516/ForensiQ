import * as React from 'react';
import { cn } from '@/utils/helpers';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-sm border border-border bg-sidebar px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
