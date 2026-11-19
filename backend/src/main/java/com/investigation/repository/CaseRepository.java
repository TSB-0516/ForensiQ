package com.investigation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.investigation.entity.InvestigationCase;

public interface CaseRepository extends JpaRepository<InvestigationCase, Long> {

    Optional<InvestigationCase> findByCaseNumber(String caseNumber);

    @Query("SELECT ci.investigationCase FROM CaseInvestigator ci WHERE ci.investigator.email = :email")
    List<InvestigationCase> findCasesByInvestigatorEmail(@Param("email") String email);
}
