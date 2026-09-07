package com.investigation.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.investigation.dto.request.CaseCreateRequest;
import com.investigation.dto.request.CaseStatusUpdateRequest;
import com.investigation.dto.response.CaseResponse;
import com.investigation.entity.InvestigationCase;
import com.investigation.entity.enums.CaseStatus;
import com.investigation.exception.ResourceNotFoundException;
import com.investigation.repository.CaseRepository;
import com.investigation.service.CaseService;
import com.investigation.util.CaseNumberGenerator;

@Service
public class CaseServiceImpl implements CaseService {

    private final CaseRepository caseRepository;
    private final CaseNumberGenerator caseNumberGenerator;

    public CaseServiceImpl(CaseRepository caseRepository, CaseNumberGenerator caseNumberGenerator) {
        this.caseRepository = caseRepository;
        this.caseNumberGenerator = caseNumberGenerator;
    }

    @Override
    public CaseResponse createCase(CaseCreateRequest request, String createdByEmail) {

        InvestigationCase investigationCase = new InvestigationCase();
        investigationCase.setCaseNumber(caseNumberGenerator.generate());
        investigationCase.setTitle(request.getTitle());
        investigationCase.setDescription(request.getDescription());
        investigationCase.setStatus(CaseStatus.OPEN);
        investigationCase.setCreatedBy(createdByEmail);

        InvestigationCase saved = caseRepository.save(investigationCase);
        return toResponse(saved);
    }

    @Override
    public CaseResponse getCaseById(Long id) {
        InvestigationCase investigationCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));
        return toResponse(investigationCase);
    }

    @Override
    public List<CaseResponse> getAllCases() {
        return caseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CaseResponse updateStatus(Long id, CaseStatusUpdateRequest request) {
        InvestigationCase investigationCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));

        investigationCase.setStatus(request.getStatus());
        InvestigationCase saved = caseRepository.save(investigationCase);
        return toResponse(saved);
    }

    private CaseResponse toResponse(InvestigationCase c) {
        long count = c.getEvidenceList() != null ? c.getEvidenceList().size() : 0;
        return new CaseResponse(
                c.getId(),
                c.getCaseNumber(),
                c.getTitle(),
                c.getDescription(),
                c.getStatus(),
                c.getCreatedBy(),
                c.getCreatedAt(),
                c.getUpdatedAt(),
                count
        );
    }
}
