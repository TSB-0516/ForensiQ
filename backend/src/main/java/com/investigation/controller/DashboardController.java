package com.investigation.controller;

import com.investigation.dto.response.DashboardStatsResponse;
import com.investigation.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<DashboardStatsResponse> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }

    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
    @GetMapping("/investigator")
    public ResponseEntity<DashboardStatsResponse> getInvestigatorStats(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getInvestigatorStats(authentication.getName()));
    }
}