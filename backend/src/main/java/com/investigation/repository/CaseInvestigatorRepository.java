package com.investigation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.investigation.entity.CaseInvestigator;

public interface CaseInvestigatorRepository extends JpaRepository<CaseInvestigator, Long> {

    List<CaseInvestigator> findByInvestigationCaseId(Long caseId);

    List<CaseInvestigator> findByInvestigatorId(Long investigatorId);

    Optional<CaseInvestigator> findByInvestigationCaseIdAndInvestigatorId(Long caseId, Long investigatorId);

    boolean existsByInvestigationCaseIdAndInvestigatorId(Long caseId, Long investigatorId);
}
