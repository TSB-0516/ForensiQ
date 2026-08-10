import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';

export function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-6', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 shrink-0 text-muted" aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'font-medium',
                    isLast ? 'text-foreground' : 'text-muted'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
