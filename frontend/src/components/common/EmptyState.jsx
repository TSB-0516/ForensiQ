export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center mb-4">
          <Icon size={22} className="text-on-surface-variant" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-headline-sm mb-1.5">{title}</h3>
      {description && (
        <p className="text-body-sm text-on-surface-variant max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}