package com.investigation.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceUploadResponse {

    private Long evidenceId;
    private String originalFilename;
    private String sha256Hash;
    private Long fileSizeBytes;
    private LocalDateTime uploadTimestamp;
}