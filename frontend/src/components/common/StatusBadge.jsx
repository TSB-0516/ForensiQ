const STATUS_CONFIG = {
  registered: { label: "Registered", dot: "bg-success", text: "text-success" },
  pending: { label: "Pending Registration", dot: "bg-warning", text: "text-warning" },
};

export default function StatusBadge({ registered }) {
  const config = registered ? STATUS_CONFIG.registered : STATUS_CONFIG.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 text-label-sm font-medium ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}