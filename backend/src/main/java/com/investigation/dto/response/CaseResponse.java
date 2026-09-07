package com.investigation.dto.response;

import java.time.LocalDateTime;

import com.investigation.entity.enums.CaseStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseResponse {

    private Long id;
    private String caseNumber;
    private String title;
    private String description;
    private CaseStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long evidenceCount;
}
