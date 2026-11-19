package com.investigation.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.investigation.dto.request.EvidenceRegistrationRequest;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.dto.response.EvidenceUploadResponse;
import com.investigation.dto.response.IntegrityVerificationResponse;

public interface EvidenceService {

    EvidenceUploadResponse uploadEvidence(MultipartFile file, String uploadedByEmail, Long caseId);

    EvidenceResponse registerEvidence(Long evidenceId, EvidenceRegistrationRequest request, String requesterEmail, boolean isAdmin);

    List<EvidenceResponse> getAllEvidence();

    List<EvidenceResponse> getEvidenceByCurrentUser(String uploadedByEmail);

    EvidenceResponse getEvidenceById(Long id);

    EvidenceResponse assignToCase(Long evidenceId, Long caseId, String requesterEmail, boolean isAdmin);

    IntegrityVerificationResponse verifyIntegrity(Long evidenceId, String requesterEmail);

    void deleteEvidence(Long evidenceId, String requesterEmail, boolean isAdmin);

    List<EvidenceResponse> getEvidenceByCase(Long caseId);
}
