package com.investigation.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.investigation.entity.enums.EvidenceType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceResponse {

    private Long id;
    private String originalFilename;
    private String sha256Hash;
    private Long fileSizeBytes;
    private LocalDateTime uploadTimestamp;
    private String uploadedBy;
    private boolean registered;

    private String title;
    private String description;
    private EvidenceType evidenceType;
    private LocalDate collectionDate;
    private LocalTime collectionTime;
    private String collectedBy;
    private String collectionLocation;
    private String relatedSuspect;
    private String relatedWitness;
    private String investigationTags;
    private String additionalRemarks;
}