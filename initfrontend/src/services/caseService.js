import api from './api';

export async function createCase(data) {
  const response = await api.post('/cases', data);
  return response.data;
}

export async function getAllCases() {
  const response = await api.get('/cases');
  return response.data;
}

export async function getMyCases() {
  const response = await api.get('/cases/mine');
  return response.data;
}

export async function getCaseById(id) {
  const response = await api.get(`/cases/${id}`);
  return response.data;
}

export async function updateCaseStatus(id, status) {
  const response = await api.patch(`/cases/${id}/status`, { status });
  return response.data;
}

export async function getInvestigatorsForCase(caseId) {
  const response = await api.get(`/cases/${caseId}/investigators`);
  return response.data;
}

export async function assignInvestigatorToCase(caseId, investigatorId) {
  const response = await api.post(`/cases/${caseId}/investigators`, { investigatorId });
  return response.data;
}

export async function unassignInvestigatorFromCase(caseId, investigatorId) {
  await api.delete(`/cases/${caseId}/investigators/${investigatorId}`);
}

export async function getCaseEvidence(caseId) {
  const response = await api.get(`/cases/${caseId}/evidence`);
  return response.data;
}

export async function getCaseCustody(caseId) {
  const response = await api.get(`/cases/${caseId}/custody`);
  return response.data;
}
