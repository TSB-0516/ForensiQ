import { cn } from '@/utils/helpers';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-sm border border-border bg-card p-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-3 flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-sm font-semibold text-foreground tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-xs text-muted', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, accent = 'accent' }) {
  const accentColors = {
    accent: 'text-accent',
    secondary: 'text-accent-secondary',
    success: 'text-success',
    danger: 'text-danger',
  };

  return (
    <Card className="group transition-colors hover:border-accent/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-muted">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={cn('rounded-sm bg-sidebar p-2', accentColors[accent])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </Card>
  );
}
