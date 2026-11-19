import api from './api';

export async function getLogForEvidence(evidenceId) {
  const response = await api.get(`/custody/${evidenceId}`);
  return response.data;
}

export async function verifyEvidenceChain(evidenceId) {
  const response = await api.get(`/custody/${evidenceId}/verify`);
  return response.data;
}
