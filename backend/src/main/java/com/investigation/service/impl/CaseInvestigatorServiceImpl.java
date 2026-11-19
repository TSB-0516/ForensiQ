package com.investigation.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investigation.dto.response.CaseInvestigatorResponse;
import com.investigation.entity.CaseInvestigator;
import com.investigation.entity.InvestigationCase;
import com.investigation.entity.User;
import com.investigation.entity.enums.Role;
import com.investigation.exception.ResourceNotFoundException;
import com.investigation.exception.UnauthorizedActionException;
import com.investigation.repository.CaseInvestigatorRepository;
import com.investigation.repository.CaseRepository;
import com.investigation.repository.UserRepository;
import com.investigation.service.CaseInvestigatorService;

@Service
public class CaseInvestigatorServiceImpl implements CaseInvestigatorService {

    private final CaseInvestigatorRepository caseInvestigatorRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public CaseInvestigatorServiceImpl(CaseInvestigatorRepository caseInvestigatorRepository,
            CaseRepository caseRepository,
            UserRepository userRepository) {
        this.caseInvestigatorRepository = caseInvestigatorRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CaseInvestigatorResponse assignInvestigator(Long caseId, Long investigatorId, String assignedByEmail) {

        InvestigationCase investigationCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + caseId));

        User investigator = userRepository.findById(investigatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + investigatorId));

        // Reject assigning a non-INVESTIGATOR (e.g. accidentally assigning an
        // Admin or Prosecutor account) — this table specifically models
        // investigator-to-case assignment, not general case membership.
        if (investigator.getRole() != Role.INVESTIGATOR) {
            throw new UnauthorizedActionException(
                    "Only users with the INVESTIGATOR role can be assigned to a case.");
        }

        if (caseInvestigatorRepository.existsByInvestigationCaseIdAndInvestigatorId(caseId, investigatorId)) {
            throw new UnauthorizedActionException(
                    "This investigator is already assigned to this case.");
        }

        CaseInvestigator assignment = new CaseInvestigator();
        assignment.setInvestigationCase(investigationCase);
        assignment.setInvestigator(investigator);
        assignment.setAssignedBy(assignedByEmail);
        assignment.setAssignedAt(LocalDateTime.now());

        CaseInvestigator saved = caseInvestigatorRepository.save(assignment);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void unassignInvestigator(Long caseId, Long investigatorId) {
        CaseInvestigator assignment = caseInvestigatorRepository
                .findByInvestigationCaseIdAndInvestigatorId(caseId, investigatorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "No assignment found for case " + caseId + " and investigator " + investigatorId));

        caseInvestigatorRepository.delete(assignment);
    }

    @Override
    public List<CaseInvestigatorResponse> getInvestigatorsForCase(Long caseId) {
        return caseInvestigatorRepository.findByInvestigationCaseId(caseId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private CaseInvestigatorResponse toResponse(CaseInvestigator ci) {
        return new CaseInvestigatorResponse(
                ci.getId(),
                ci.getInvestigator().getId(),
                ci.getInvestigator().getEmail(),
                ci.getInvestigator().getFullName(),
                ci.getAssignedBy(),
                ci.getAssignedAt()
        );
    }
}
