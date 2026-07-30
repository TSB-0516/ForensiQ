package com.investigation.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.investigation.dto.request.EvidenceRegistrationRequest;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.dto.response.EvidenceUploadResponse;

public interface EvidenceService {

    EvidenceUploadResponse uploadEvidence(MultipartFile file, String uploadedByEmail);

    EvidenceResponse registerEvidence(Long evidenceId, EvidenceRegistrationRequest request);

    List<EvidenceResponse> getAllEvidence();

    List<EvidenceResponse> getEvidenceByCurrentUser(String uploadedByEmail);

    EvidenceResponse getEvidenceById(Long id);
}