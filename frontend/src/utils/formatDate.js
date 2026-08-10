export function formatDateTime(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateOnly(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}