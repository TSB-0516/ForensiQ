package com.investigation.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investigation.dto.response.CaseCustodyEventResponse;
import com.investigation.dto.response.CustodyLogResponse;
import com.investigation.dto.response.CustodyVerifyResponse;
import com.investigation.entity.CustodyLog;
import com.investigation.entity.Evidence;
import com.investigation.entity.enums.CustodyAction;
import com.investigation.exception.ResourceNotFoundException;
import com.investigation.repository.CustodyLogRepository;
import com.investigation.repository.EvidenceRepository;
import com.investigation.service.CustodyLogService;
import com.investigation.util.CustodyHashUtil;

@Service
public class CustodyLogServiceImpl implements CustodyLogService {

    private final CustodyLogRepository custodyLogRepository;
    private final EvidenceRepository evidenceRepository;

    public CustodyLogServiceImpl(CustodyLogRepository custodyLogRepository,
            EvidenceRepository evidenceRepository) {
        this.custodyLogRepository = custodyLogRepository;
        this.evidenceRepository = evidenceRepository;
    }

    private CustodyLogResponse toResponse(CustodyLog log) {
        return new CustodyLogResponse(
                log.getId(),
                log.getAction(),
                log.getPerformedBy(),
                log.getTimestamp(),
                log.getRemarks(),
                log.getPreviousHash(),
                log.getCurrentHash(),
                log.getEvidenceOriginalFilename(),
                log.getEvidenceSha256Hash()
        );
    }

    @Override
    @Transactional
    public void logAction(Long evidenceId, CustodyAction action, String performedBy, String remarks) {

        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with id: " + evidenceId));

        List<CustodyLog> existingChain = custodyLogRepository.findByEvidenceIdOrderByTimestampAsc(evidenceId);
        String previousHash = existingChain.isEmpty()
                ? null
                : existingChain.get(existingChain.size() - 1).getCurrentHash();

        LocalDateTime timestamp = LocalDateTime.now();

        String canonical = CustodyHashUtil.buildCanonicalString(
                evidenceId, action, performedBy, timestamp, remarks, previousHash);
        String currentHash = CustodyHashUtil.sha256(canonical);

        CustodyLog log = new CustodyLog();
        log.setEvidence(evidence);
        log.setEvidenceOriginalFilename(evidence.getOriginalFilename());
        log.setEvidenceSha256Hash(evidence.getSha256Hash());
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setTimestamp(timestamp);
        log.setRemarks(remarks);
        log.setPreviousHash(previousHash);
        log.setCurrentHash(currentHash);

        custodyLogRepository.save(log);
    }

    @Override
    public List<CustodyLogResponse> getLogForEvidence(Long evidenceId) {
        return custodyLogRepository.findByEvidenceIdOrderByTimestampAsc(evidenceId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CustodyVerifyResponse verifyChain(Long evidenceId) {

        List<CustodyLog> chain = custodyLogRepository.findByEvidenceIdOrderByTimestampAsc(evidenceId);

        String expectedPreviousHash = null;

        for (CustodyLog log : chain) {

            String recomputed = CustodyHashUtil.sha256(
                    CustodyHashUtil.buildCanonicalString(
                            evidenceId,
                            log.getAction(),
                            log.getPerformedBy(),
                            log.getTimestamp(),
                            log.getRemarks(),
                            log.getPreviousHash()
                    )
            );

            boolean previousHashMatches
                    = (expectedPreviousHash == null && log.getPreviousHash() == null)
                    || (expectedPreviousHash != null && expectedPreviousHash.equals(log.getPreviousHash()));

            boolean currentHashMatches = recomputed.equals(log.getCurrentHash());

            if (!previousHashMatches || !currentHashMatches) {
                return new CustodyVerifyResponse(false, log.getId(),
                        "Chain broken at custody log id " + log.getId());
            }

            expectedPreviousHash = log.getCurrentHash();
        }

        return new CustodyVerifyResponse(true, null, "Chain intact.");
    }

    @Override
    public List<CaseCustodyEventResponse> getCustodyForCase(Long caseId) {
        return custodyLogRepository.findByEvidence_InvestigationCase_IdOrderByTimestampAsc(caseId)
                .stream()
                .map(this::toCaseResponse)
                .collect(Collectors.toList());
    }

    private CaseCustodyEventResponse toCaseResponse(CustodyLog log) {
        Evidence evidence = log.getEvidence();
        String displayTitle = (evidence.getTitle() != null && !evidence.getTitle().isBlank())
                ? evidence.getTitle()
                : evidence.getOriginalFilename();

        return new CaseCustodyEventResponse(
                log.getId(),
                evidence.getId(),
                displayTitle,
                log.getAction(),
                log.getPerformedBy(),
                log.getTimestamp(),
                log.getRemarks(),
                log.getPreviousHash(),
                log.getCurrentHash()
        );
    }

}
