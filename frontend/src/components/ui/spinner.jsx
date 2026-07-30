import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

export function Spinner({ className, size = 'default', label = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} role="status" aria-live="polite">
      <Loader2 className={cn('animate-spin text-accent', sizeClasses[size])} aria-hidden="true" />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

export function PageLoader({ message = 'Loading workstation data...' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 animate-fade-in">
      <Spinner size="lg" label={message} />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
