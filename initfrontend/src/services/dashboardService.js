import api from './api';

const dashboardService = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getInvestigatorDashboard: async () => {
    const response = await api.get('/dashboard/investigator');
    return response.data;
  },
};

export default dashboardService;
