package com.investigation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustodyVerifyResponse {
    private boolean valid;
    private Long brokenAtLogId; // null if valid
    private String message;
}