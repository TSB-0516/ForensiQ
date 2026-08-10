import { formatRole } from "../../utils/roleLabels";

// Pill badges per DESIGN.md — fully rounded, distinct from interactive buttons.
// Each role gets a fixed color so it's recognizable at a glance across tables/lists.
const ROLE_STYLES = {
  ADMIN: "bg-action/10 text-action border-action/30",
  INVESTIGATOR: "bg-success/10 text-success border-success/30",
  FORENSIC_ANALYST: "bg-warning/10 text-warning border-warning/30",
  PROSECUTOR: "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant",
};

export default function RoleBadge({ role }) {
  const style = ROLE_STYLES[role] || ROLE_STYLES.PROSECUTOR;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-label-sm font-medium ${style}`}
    >
      {formatRole(role)}
    </span>
  );
}