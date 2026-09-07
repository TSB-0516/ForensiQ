package com.investigation.dto.request;

import com.investigation.entity.enums.CaseStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseStatusUpdateRequest {

    private CaseStatus status;
}
