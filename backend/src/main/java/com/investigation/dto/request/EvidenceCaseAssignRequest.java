package com.investigation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceCaseAssignRequest {

    private Long caseId; // null = unassign from any case
}
