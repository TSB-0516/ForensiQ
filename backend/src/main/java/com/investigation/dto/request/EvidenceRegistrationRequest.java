package com.investigation.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.investigation.entity.enums.EvidenceType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceRegistrationRequest {

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