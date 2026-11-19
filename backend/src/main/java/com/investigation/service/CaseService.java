package com.investigation.service;

import java.util.List;

import com.investigation.dto.request.CaseCreateRequest;
import com.investigation.dto.request.CaseStatusUpdateRequest;
import com.investigation.dto.response.CaseResponse;

public interface CaseService {

    CaseResponse createCase(CaseCreateRequest request, String createdByEmail);

    CaseResponse getCaseById(Long id);

    List<CaseResponse> getAllCases();

    List<CaseResponse> getMyCases(String email);

    CaseResponse updateStatus(Long id, CaseStatusUpdateRequest request);
}
