import axiosInstance from "./axiosInstance";

export const evidenceApi = {
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post("/evidence/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },

  register: (evidenceId, payload) =>
    axiosInstance.put(`/evidence/${evidenceId}/register`, payload),

  getAll: () => axiosInstance.get("/evidence"),

  getMine: () => axiosInstance.get("/evidence/mine"),

  getById: (id) => axiosInstance.get(`/evidence/${id}`),
};