import api from './api';

export async function createCase(data) {
  const response = await api.post('/cases', data);
  return response.data;
}

export async function getAllCases() {
  const response = await api.get('/cases');
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
