package com.investigation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IntegrityVerificationResponse {
    private Long evidenceId;
    private boolean matched;
    private String storedHash;
    private String recomputedHash;
    private String message;
}