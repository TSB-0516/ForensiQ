package com.investigation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investigation.dto.request.CaseCreateRequest;
import com.investigation.dto.request.CaseStatusUpdateRequest;
import com.investigation.dto.response.CaseResponse;
import com.investigation.service.CaseService;

@RestController
@RequestMapping("/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
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

    // v1 scope: no assignment table yet — all authenticated roles can view all cases,
    // matching GET /evidence's open-read pattern.
    @GetMapping
    public ResponseEntity<List<CaseResponse>> getAll() {
        return ResponseEntity.ok(caseService.getAllCases());
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
}
