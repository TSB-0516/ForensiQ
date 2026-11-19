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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.investigation.dto.request.EvidenceCaseAssignRequest;
import com.investigation.dto.request.EvidenceRegistrationRequest;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.dto.response.EvidenceUploadResponse;
import com.investigation.dto.response.IntegrityVerificationResponse;
import com.investigation.service.EvidenceService;

@RestController
@RequestMapping("/evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    // Module 4 — Evidence Upload. Admins can also upload on behalf of setup/testing;
    // Forensic Analysts and Prosecutors have no reason to originate evidence.
@PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
@PostMapping(value = "/upload", consumes = "multipart/form-data")
public ResponseEntity<EvidenceUploadResponse> upload(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "caseId", required = false) Long caseId,
        Authentication authentication) {

    String uploadedBy = authentication.getName();
    EvidenceUploadResponse response = evidenceService.uploadEvidence(file, uploadedBy, caseId);

    return ResponseEntity.ok(response);
}

    // Module 5 — Evidence Registration. Ownership is enforced in the service layer.
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
@PutMapping("/{id}/register")
public ResponseEntity<EvidenceResponse> register(
        @PathVariable Long id,
        @RequestBody EvidenceRegistrationRequest request,
        Authentication authentication) {

    boolean isAdmin = authentication.getAuthorities()
            .stream()
            .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_ADMIN"));

    EvidenceResponse response =
            evidenceService.registerEvidence(
                    id,
                    request,
                    authentication.getName(),
                    isAdmin);

    return ResponseEntity.ok(response);
}

    // Module 3 — Evidence Vault (list all). Every role can view; Prosecutors and
    // Forensic Analysts need read access even though they can't upload/register.
    @GetMapping
    public ResponseEntity<List<EvidenceResponse>> getAll() {
        return ResponseEntity.ok(evidenceService.getAllEvidence());
    }

    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
    @GetMapping("/mine")
    public ResponseEntity<List<EvidenceResponse>> getMine(Authentication authentication) {
        return ResponseEntity.ok(evidenceService.getEvidenceByCurrentUser(authentication.getName()));
    }

    // Module 6 — Evidence Details. Open to all authenticated roles (see /GET above).
    @GetMapping("/{id}")
    public ResponseEntity<EvidenceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(evidenceService.getEvidenceById(id));
    }

    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(
        @PathVariable Long id,
        Authentication authentication) {

    boolean isAdmin = authentication.getAuthorities()
            .stream()
            .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_ADMIN"));

    evidenceService.deleteEvidence(
            id,
            authentication.getName(),
            isAdmin);

    return ResponseEntity.noContent().build();
}

@PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
@PatchMapping("/{id}/case")
public ResponseEntity<EvidenceResponse> assignToCase(
        @PathVariable Long id,
        @RequestBody EvidenceCaseAssignRequest request,
        Authentication authentication) {

    boolean isAdmin = authentication.getAuthorities()
            .stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

    EvidenceResponse response = evidenceService.assignToCase(
            id, request.getCaseId(), authentication.getName(), isAdmin);

    return ResponseEntity.ok(response);
}

// Open to all authenticated roles — this is a read-only integrity check,
// not a mutation of evidence content; unlike register/delete/assignToCase,
// no ownership restriction applies.
@PostMapping("/{id}/verify-integrity")
public ResponseEntity<IntegrityVerificationResponse> verifyIntegrity(
        @PathVariable Long id,
        Authentication authentication) {

    IntegrityVerificationResponse response =
            evidenceService.verifyIntegrity(id, authentication.getName());

    return ResponseEntity.ok(response);
}

}