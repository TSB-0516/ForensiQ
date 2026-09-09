package com.investigation.entity;

import java.time.LocalDateTime;

import com.investigation.entity.enums.CustodyAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "custody_log")
public class CustodyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evidence_id")
    private Evidence evidence;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustodyAction action;

    // Email, consistent with Evidence.uploadedBy / InvestigationCase.createdBy convention.
    @Column(name = "performed_by", nullable = false)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 2000)
    private String remarks;

    // Null only for the first record in a given evidence item's chain.
    @Column(name = "previous_hash")
    private String previousHash;

    // SHA-256 of evidenceId|action|performedBy|timestamp|remarks|previousHash.
    // Deliberately excludes id — lets the hash be computed before insert,
    // avoiding a two-step write.
    @Column(name = "current_hash", nullable = false, updatable = false)
    private String currentHash;

    @Column(name = "evidence_original_filename")
private String evidenceOriginalFilename;

@Column(name = "evidence_sha256_hash")
private String evidenceSha256Hash;

    public CustodyLog() {
    }

    // ---- Getters & Setters (no setter for currentHash after construction —
    // see CustodyLogServiceImpl; entity itself doesn't enforce immutability,
    // repository does, per the no-update/no-delete design decision) ----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Evidence getEvidence() {
        return evidence;
    }

    public void setEvidence(Evidence evidence) {
        this.evidence = evidence;
    }

    public CustodyAction getAction() {
        return action;
    }

    public void setAction(CustodyAction action) {
        this.action = action;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public void setPreviousHash(String previousHash) {
        this.previousHash = previousHash;
    }

    public String getCurrentHash() {
        return currentHash;
    }

    public void setCurrentHash(String currentHash) {
        this.currentHash = currentHash;
    }

    public String getEvidenceOriginalFilename() {
    return evidenceOriginalFilename;
}

public void setEvidenceOriginalFilename(String evidenceOriginalFilename) {
    this.evidenceOriginalFilename = evidenceOriginalFilename;
}

public String getEvidenceSha256Hash() {
    return evidenceSha256Hash;
}

public void setEvidenceSha256Hash(String evidenceSha256Hash) {
    this.evidenceSha256Hash = evidenceSha256Hash;
}

}