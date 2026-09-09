export const caseEvidenceData = {
  1: ['EV-00042', 'EV-00043', 'EV-00044'],
};

export function getCaseEvidence(caseId) {
  // Accept numeric backend ID or string case number for compatibility
  const key = typeof caseId === 'number' ? caseId : caseId;
  return caseEvidenceData[key] || [];
}
