import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-sidebar/50 px-6 py-12 text-center animate-fade-in',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-sm bg-card border border-border">
          <Icon className="h-6 w-6 text-muted" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted">{description}</p>
      )}
      {action && actionLabel && (
        <Button className="mt-6" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
