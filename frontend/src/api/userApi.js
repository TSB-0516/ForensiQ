import axiosInstance from "./axiosInstance";

export const userApi = {
  getAll: () => axiosInstance.get("/users"),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  updateRole: (id, role) => axiosInstance.put(`/users/${id}/role`, { role }),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};