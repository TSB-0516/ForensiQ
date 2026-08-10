package com.investigation.service;

import com.investigation.dto.request.EvidenceRegistrationRequest;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.dto.response.EvidenceUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EvidenceService {

    EvidenceUploadResponse uploadEvidence(MultipartFile file, String uploadedByEmail);

    EvidenceResponse registerEvidence(Long evidenceId, EvidenceRegistrationRequest request, String requesterEmail);

    List<EvidenceResponse> getAllEvidence();

    List<EvidenceResponse> getEvidenceByCurrentUser(String uploadedByEmail);

    EvidenceResponse getEvidenceById(Long id);
}