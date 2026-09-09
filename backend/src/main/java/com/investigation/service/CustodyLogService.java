package com.investigation.service;

import com.investigation.dto.response.CustodyLogResponse;
import com.investigation.dto.response.CustodyVerifyResponse;
import com.investigation.entity.enums.CustodyAction;

import java.util.List;

public interface CustodyLogService {

    // No update/delete methods exposed — append-only by service contract.
    void logAction(Long evidenceId, CustodyAction action, String performedBy, String remarks);

    List<CustodyLogResponse> getLogForEvidence(Long evidenceId);

    CustodyVerifyResponse verifyChain(Long evidenceId);
}