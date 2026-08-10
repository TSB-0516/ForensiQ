package com.investigation.dto.response;

import com.investigation.entity.enums.EvidenceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceUploadResponse {

    private Long evidenceId;
    private String originalFilename;
    private String sha256Hash;
    private Long fileSizeBytes;
    private LocalDateTime uploadTimestamp;

    // Best-effort guess to pre-fill the registration form; not authoritative.
    private EvidenceType suggestedEvidenceType;
}