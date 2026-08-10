package com.investigation.service;

import com.investigation.dto.response.DashboardStatsResponse;

public interface DashboardService {

    DashboardStatsResponse getAdminStats();

    DashboardStatsResponse getInvestigatorStats(String investigatorEmail);
}