package com.investigation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investigation.dto.request.CaseCreateRequest;
import com.investigation.dto.request.CaseInvestigatorAssignRequest;
import com.investigation.dto.request.CaseStatusUpdateRequest;
import com.investigation.dto.response.CaseCustodyEventResponse;
import com.investigation.dto.response.CaseInvestigatorResponse;
import com.investigation.dto.response.CaseResponse;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.service.CaseInvestigatorService;
import com.investigation.service.CaseService;
import com.investigation.service.CustodyLogService;
import com.investigation.service.EvidenceService;

@RestController
@RequestMapping("/cases")
public class CaseController {

    private final CaseService caseService;
    private final CustodyLogService custodyLogService;
    private final CaseInvestigatorService caseInvestigatorService;
    private final EvidenceService evidenceService;

    public CaseController(CaseService caseService,
            CustodyLogService custodyLogService,
            CaseInvestigatorService caseInvestigatorService,
            EvidenceService evidenceService) {
        this.caseService = caseService;
        this.custodyLogService = custodyLogService;
        this.caseInvestigatorService = caseInvestigatorService;
        this.evidenceService = evidenceService;
    }

    // v1 scope: creation allowed for both ADMIN and INVESTIGATOR.
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<CaseResponse> create(
            @RequestBody CaseCreateRequest request,
            Authentication authentication) {

        CaseResponse response = caseService.createCase(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    // v1 slice: Admin-only assignment, metadata only — does not change who can
// view/act on the case (that stays open to all investigators, unchanged).
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{caseId}/investigators")
    public ResponseEntity<CaseInvestigatorResponse> assignInvestigator(
            @PathVariable Long caseId,
            @RequestBody CaseInvestigatorAssignRequest request,
            Authentication authentication) {

        CaseInvestigatorResponse response = caseInvestigatorService.assignInvestigator(
                caseId, request.getInvestigatorId(), authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{caseId}/investigators/{investigatorId}")
    public ResponseEntity<Void> unassignInvestigator(
            @PathVariable Long caseId,
            @PathVariable Long investigatorId) {

        caseInvestigatorService.unassignInvestigator(caseId, investigatorId);
        return ResponseEntity.noContent().build();
    }

// Open read — matches GET /evidence and GET /cases pattern.
    @GetMapping("/{caseId}/investigators")
    public ResponseEntity<List<CaseInvestigatorResponse>> getInvestigators(@PathVariable Long caseId) {
        return ResponseEntity.ok(caseInvestigatorService.getInvestigatorsForCase(caseId));
    }

    // v1 scope: no assignment table yet — all authenticated roles can view all cases,
    // matching GET /evidence's open-read pattern.
    @GetMapping
    public ResponseEntity<List<CaseResponse>> getAll() {
        return ResponseEntity.ok(caseService.getAllCases());
    }

    // New — separate endpoint for "my assigned cases" (e.g. investigator dashboard).
@PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
@GetMapping("/mine")
public ResponseEntity<List<CaseResponse>> getMyCases(Authentication authentication) {
    return ResponseEntity.ok(caseService.getMyCases(authentication.getName()));
}

    @GetMapping("/{id}")
    public ResponseEntity<CaseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(caseService.getCaseById(id));
    }

    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<CaseResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody CaseStatusUpdateRequest request) {

        return ResponseEntity.ok(caseService.updateStatus(id, request));
    }

    // Open read, matching GET /evidence and GET /cases pattern.
    @GetMapping("/{caseId}/evidence")
    public ResponseEntity<List<EvidenceResponse>> getEvidenceForCase(@PathVariable Long caseId) {
        return ResponseEntity.ok(evidenceService.getEvidenceByCase(caseId));
    }

    @GetMapping("/{caseId}/custody")
    public ResponseEntity<List<CaseCustodyEventResponse>> getCustodyForCase(@PathVariable Long caseId) {
        return ResponseEntity.ok(custodyLogService.getCustodyForCase(caseId));
    }
}
