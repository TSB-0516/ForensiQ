package com.investigation.service;

import java.util.List;

import com.investigation.dto.response.CaseInvestigatorResponse;

public interface CaseInvestigatorService {

    CaseInvestigatorResponse assignInvestigator(Long caseId, Long investigatorId, String assignedByEmail);

    void unassignInvestigator(Long caseId, Long investigatorId);

    List<CaseInvestigatorResponse> getInvestigatorsForCase(Long caseId);
}
