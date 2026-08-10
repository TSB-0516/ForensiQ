import axiosInstance from "./axiosInstance";

export const dashboardApi = {
  getAdminStats: () => axiosInstance.get("/dashboard/admin"),
  getInvestigatorStats: () => axiosInstance.get("/dashboard/investigator"),
};