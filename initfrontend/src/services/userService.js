import api from './api';

export async function getAllUsers() {
  const response = await api.get('/users');
  return response.data;
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateUserRole(id, role) {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
