package com.investigation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.investigation.entity.InvestigationCase;

public interface CaseRepository extends JpaRepository<InvestigationCase, Long> {

    Optional<InvestigationCase> findByCaseNumber(String caseNumber);
}
