export const ROLE_LABELS = {
  ADMIN: "Administrator",
  INVESTIGATOR: "Investigator",
  FORENSIC_ANALYST: "Forensic Analyst",
  PROSECUTOR: "Prosecutor",
};

export function formatRole(role) {
  return ROLE_LABELS[role] || role;
}