package com.investigation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investigation.dto.response.CustodyLogResponse;
import com.investigation.dto.response.CustodyVerifyResponse;
import com.investigation.service.CustodyLogService;

@RestController
@RequestMapping("/custody")
public class CustodyLogController {

    private final CustodyLogService custodyLogService;

    public CustodyLogController(CustodyLogService custodyLogService) {
        this.custodyLogService = custodyLogService;
    }

    // Open to all authenticated roles, matching GET /evidence's read pattern —
    // Prosecutor/Forensic Analyst need custody visibility without upload/register rights.
    @GetMapping("/{evidenceId}")
    public ResponseEntity<List<CustodyLogResponse>> getLog(@PathVariable Long evidenceId) {
        return ResponseEntity.ok(custodyLogService.getLogForEvidence(evidenceId));
    }

    @GetMapping("/{evidenceId}/verify")
    public ResponseEntity<CustodyVerifyResponse> verify(@PathVariable Long evidenceId) {
        return ResponseEntity.ok(custodyLogService.verifyChain(evidenceId));
    }
}