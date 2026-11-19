package com.investigation.dto.response;

import java.time.LocalDateTime;

import com.investigation.entity.enums.CustodyAction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseCustodyEventResponse {

    private Long custodyLogId;
    private Long evidenceId;
    private String evidenceTitle;         // title if registered, else original filename
    private CustodyAction action;
    private String performedBy;
    private LocalDateTime timestamp;
    private String remarks;
    private String previousHash;
    private String currentHash;
}
