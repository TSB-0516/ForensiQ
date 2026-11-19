package com.investigation.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseInvestigatorResponse {

    private Long id;
    private Long investigatorId;
    private String investigatorEmail;
    private String investigatorFullName;
    private String assignedBy;
    private LocalDateTime assignedAt;
}
