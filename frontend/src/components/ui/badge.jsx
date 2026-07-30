import { cn } from '@/utils/helpers';

const variants = {
  default: 'bg-accent/10 text-accent border-accent/20',
  secondary: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20',
  success: 'bg-success/10 text-success border-success/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  muted: 'bg-sidebar text-muted border-border',
  outline: 'bg-transparent text-foreground border-border',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
