package com.investigation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseCreateRequest {

    private String title;
    private String description;
    // No caseNumber, no status, no createdBy — all server-assigned.
}
