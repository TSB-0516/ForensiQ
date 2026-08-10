export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-3.5 bg-surface-container-high rounded animate-pulse"
              style={{ width: `${100 / cols}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 bg-surface-container rounded-lg animate-pulse" />
      ))}
    </div>
  );
}