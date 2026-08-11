import api from './api';

export const INTEGRITY_STATUS = {
  VERIFIED: 'VERIFIED',
  PENDING: 'PENDING',
};

export async function uploadEvidence(file) {
  if (!file) {
    throw new Error('No file selected');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/evidence/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function registerEvidence(evidenceId, data) {
  const requestData = {
    title: data.title,
    description: data.description || null,
    evidenceType: data.evidenceType,
    collectionDate: data.collectionDate,
    collectionTime: data.collectionTime,
    collectedBy: data.collectedBy,
    collectionLocation: data.location,
    relatedSuspect: data.relatedSuspect || null,
    relatedWitness: data.relatedWitness || null,
    investigationTags: data.tags || null,
    additionalRemarks: data.remarks || null,
  };

  const response = await api.put(
    `/evidence/${evidenceId}/register`,
    requestData
  );

  return response.data;
}

export async function getAllEvidence() {
  const response = await api.get('/evidence');
  return response.data;
}

export async function getMyEvidence() {
  const response = await api.get('/evidence/mine');
  return response.data;
}

export async function getEvidenceById(id) {
  const response = await api.get(`/evidence/${id}`);
  return response.data;
}