package com.investigation.service;

import java.util.List;

import com.investigation.dto.response.CaseCustodyEventResponse;
import com.investigation.dto.response.CustodyLogResponse;
import com.investigation.dto.response.CustodyVerifyResponse;
import com.investigation.entity.enums.CustodyAction;

public interface CustodyLogService {

    // No update/delete methods exposed — append-only by service contract.
    void logAction(Long evidenceId, CustodyAction action, String performedBy, String remarks);

    List<CustodyLogResponse> getLogForEvidence(Long evidenceId);

    CustodyVerifyResponse verifyChain(Long evidenceId);

    List<CaseCustodyEventResponse> getCustodyForCase(Long caseId);
}
