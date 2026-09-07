package com.investigation.entity;

import java.util.List;

import com.investigation.entity.enums.CaseStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "investigation_cases")
public class InvestigationCase extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Human-facing identifier, e.g. CASE-2026-001. Distinct from id.
    // Unique + immutable, generated server-side at creation — never client-supplied.
    @Column(name = "case_number", unique = true, nullable = false, updatable = false)
    private String caseNumber;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status = CaseStatus.OPEN;

    // Email of the user who created the case, consistent with
    // Evidence.uploadedBy's convention of storing email rather than a User FK.
    @Column(name = "created_by", nullable = false, updatable = false)
    private String createdBy;

    @OneToMany(mappedBy = "investigationCase")
    private List<Evidence> evidenceList;

    public InvestigationCase() {
    }

    // ---- Getters & Setters ----
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<Evidence> getEvidenceList() {
        return evidenceList;
    }

    public void setEvidenceList(List<Evidence> evidenceList) {
        this.evidenceList = evidenceList;
    }
}
