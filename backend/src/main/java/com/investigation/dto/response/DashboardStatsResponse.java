package com.investigation.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // Admin-facing
    private Long totalUsers;
    private Long totalEvidenceCount;

    // Investigator-facing
    private Long myUploadedEvidenceCount;
    private Long myRegisteredEvidenceCount;

    // Shared — recent activity feed
    private List<EvidenceResponse> recentEvidence;
}