package com.investigation.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.investigation.entity.enums.EvidenceType;

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
@Table(name = "evidence")
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---- System generated at upload time ----
    private String originalFilename;
    private String storedFilename;
    private String storagePath;
    private String sha256Hash;
    private Long fileSizeBytes;
    private LocalDateTime uploadTimestamp;
    private String uploadedBy; // email of investigator

    private boolean registered = false;

    // ---- Filled during Evidence Registration ----
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private EvidenceType evidenceType;

    private LocalDate collectionDate;
    private LocalTime collectionTime;
    private String collectedBy;
    private String collectionLocation;
    private String relatedSuspect;
    private String relatedWitness;
    private String investigationTags;

    @Column(length = 2000)
    private String additionalRemarks;

    // Phase II: real relationship to InvestigationCase. Nullable — evidence can
// exist unassigned to any case (see Evidence Registration lifecycle notes).
// ON DELETE SET NULL at the DB level: deleting a case must not delete or
// orphan-fail the evidence attached to it.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id")
    private InvestigationCase investigationCase;

    public Evidence() {
    }

    // ---- Getters & Setters ----
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getStoredFilename() {
        return storedFilename;
    }

    public void setStoredFilename(String storedFilename) {
        this.storedFilename = storedFilename;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String storagePath) {
        this.storagePath = storagePath;
    }

    public String getSha256Hash() {
        return sha256Hash;
    }

    public void setSha256Hash(String sha256Hash) {
        this.sha256Hash = sha256Hash;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(Long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public LocalDateTime getUploadTimestamp() {
        return uploadTimestamp;
    }

    public void setUploadTimestamp(LocalDateTime uploadTimestamp) {
        this.uploadTimestamp = uploadTimestamp;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public boolean isRegistered() {
        return registered;
    }

    public void setRegistered(boolean registered) {
        this.registered = registered;
    }

    public InvestigationCase getInvestigationCase() {
        return investigationCase;
    }

    public void setInvestigationCase(InvestigationCase investigationCase) {
        this.investigationCase = investigationCase;
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

    public EvidenceType getEvidenceType() {
        return evidenceType;
    }

    public void setEvidenceType(EvidenceType evidenceType) {
        this.evidenceType = evidenceType;
    }

    public LocalDate getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(LocalDate collectionDate) {
        this.collectionDate = collectionDate;
    }

    public LocalTime getCollectionTime() {
        return collectionTime;
    }

    public void setCollectionTime(LocalTime collectionTime) {
        this.collectionTime = collectionTime;
    }

    public String getCollectedBy() {
        return collectedBy;
    }

    public void setCollectedBy(String collectedBy) {
        this.collectedBy = collectedBy;
    }

    public String getCollectionLocation() {
        return collectionLocation;
    }

    public void setCollectionLocation(String collectionLocation) {
        this.collectionLocation = collectionLocation;
    }

    public String getRelatedSuspect() {
        return relatedSuspect;
    }

    public void setRelatedSuspect(String relatedSuspect) {
        this.relatedSuspect = relatedSuspect;
    }

    public String getRelatedWitness() {
        return relatedWitness;
    }

    public void setRelatedWitness(String relatedWitness) {
        this.relatedWitness = relatedWitness;
    }

    public String getInvestigationTags() {
        return investigationTags;
    }

    public void setInvestigationTags(String investigationTags) {
        this.investigationTags = investigationTags;
    }

    public String getAdditionalRemarks() {
        return additionalRemarks;
    }

    public void setAdditionalRemarks(String additionalRemarks) {
        this.additionalRemarks = additionalRemarks;
    }
}
