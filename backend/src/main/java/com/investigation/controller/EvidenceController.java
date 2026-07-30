package com.investigation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.investigation.dto.request.EvidenceRegistrationRequest;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.dto.response.EvidenceUploadResponse;
import com.investigation.service.EvidenceService;

@RestController
@RequestMapping("/evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    // Module 4 — Evidence Upload
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<EvidenceUploadResponse> upload(@RequestParam("file") MultipartFile file,
                                                          Authentication authentication) {

        String uploadedBy = authentication.getName();
        EvidenceUploadResponse response = evidenceService.uploadEvidence(file, uploadedBy);

        return ResponseEntity.ok(response);
    }

    // Module 5 — Evidence Registration
    @PutMapping("/{id}/register")
    public ResponseEntity<EvidenceResponse> register(@PathVariable Long id,
                                                      @RequestBody EvidenceRegistrationRequest request) {

        return ResponseEntity.ok(evidenceService.registerEvidence(id, request));
    }

    // Module 3 — Evidence Vault (list all)
    @GetMapping
    public ResponseEntity<List<EvidenceResponse>> getAll() {
        return ResponseEntity.ok(evidenceService.getAllEvidence());
    }

    // Investigator's own uploaded evidence
    @GetMapping("/mine")
    public ResponseEntity<List<EvidenceResponse>> getMine(Authentication authentication) {
        return ResponseEntity.ok(evidenceService.getEvidenceByCurrentUser(authentication.getName()));
    }

    // Module 6 — Evidence Details
    @GetMapping("/{id}")
    public ResponseEntity<EvidenceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(evidenceService.getEvidenceById(id));
    }
}