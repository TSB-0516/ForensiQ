import { Search } from "lucide-react";
import { EVIDENCE_TYPES } from "../../schemas/evidenceSchema";

export default function EvidenceFilterBar({ search, onSearchChange, typeFilter, onTypeFilterChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, filename, or hash..."
          className="w-full bg-surface-container border border-outline-variant rounded pl-9 pr-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-action transition"
        />
      </div>

      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-sm text-on-surface focus:border-action transition"
      >
        <option value="ALL">All types</option>
        {EVIDENCE_TYPES.map((t) => (
          <option key={t} value={t}>
            {t.replace("_", " ")}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-sm text-on-surface focus:border-action transition"
      >
        <option value="ALL">All statuses</option>
        <option value="REGISTERED">Registered</option>
        <option value="PENDING">Pending registration</option>
      </select>
    </div>
  );
}