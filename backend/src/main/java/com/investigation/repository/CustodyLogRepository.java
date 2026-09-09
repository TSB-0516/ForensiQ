package com.investigation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.investigation.entity.CustodyLog;

public interface CustodyLogRepository extends JpaRepository<CustodyLog, Long> {

    // Ordered ascending — chain order matters for verification and display.
    List<CustodyLog> findByEvidenceIdOrderByTimestampAsc(Long evidenceId);
}