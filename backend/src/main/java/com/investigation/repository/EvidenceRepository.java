package com.investigation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.investigation.entity.Evidence;
import com.investigation.entity.enums.EvidenceType;

public interface EvidenceRepository extends JpaRepository<Evidence, Long> {

    List<Evidence> findByUploadedBy(String uploadedBy);

    List<Evidence> findByEvidenceType(EvidenceType evidenceType);

    List<Evidence> findByTitleContainingIgnoreCase(String keyword);
}