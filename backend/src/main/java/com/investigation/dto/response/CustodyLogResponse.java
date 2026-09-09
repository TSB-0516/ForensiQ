package com.investigation.dto.response;

import java.time.LocalDateTime;

import com.investigation.entity.enums.CustodyAction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustodyLogResponse {
    private Long id;
    private CustodyAction action;
    private String performedBy;
    private LocalDateTime timestamp;
    private String remarks;
    private String previousHash;
    private String currentHash;
    private String evidenceOriginalFilename;
    private String evidenceSha256Hash;
}