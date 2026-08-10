package com.investigation.service.impl;

import com.investigation.dto.response.DashboardStatsResponse;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.entity.Evidence;
import com.investigation.repository.EvidenceRepository;
import com.investigation.repository.UserRepository;
import com.investigation.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final EvidenceRepository evidenceRepository;

    private static final int RECENT_LIMIT = 5;

    public DashboardServiceImpl(UserRepository userRepository,
                                 EvidenceRepository evidenceRepository) {
        this.userRepository = userRepository;
        this.evidenceRepository = evidenceRepository;
    }

    @Override
    public DashboardStatsResponse getAdminStats() {

        long totalUsers = userRepository.count();
        long totalEvidence = evidenceRepository.count();

        List<EvidenceResponse> recent = evidenceRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Evidence::getUploadTimestamp).reversed())
                .limit(RECENT_LIMIT)
                .map(this::toResponse)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                totalUsers,
                totalEvidence,
                null,
                null,
                recent
        );
    }

    @Override
    public DashboardStatsResponse getInvestigatorStats(String investigatorEmail) {

        List<Evidence> myEvidence = evidenceRepository.findByUploadedBy(investigatorEmail);

        long uploadedCount = myEvidence.size();
        long registeredCount = myEvidence.stream()
                .filter(Evidence::isRegistered)
                .count();

        List<EvidenceResponse> recent = myEvidence.stream()
                .sorted(Comparator.comparing(Evidence::getUploadTimestamp).reversed())
                .limit(RECENT_LIMIT)
                .map(this::toResponse)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                null,
                null,
                uploadedCount,
                registeredCount,
                recent
        );
    }

    // Kept in sync with EvidenceResponse's constructor order — if you add
    // fields to EvidenceResponse again, this mapping breaks at compile time
    // (good — it fails loud instead of silently misaligning fields).
    private EvidenceResponse toResponse(Evidence e) {
        return new EvidenceResponse(
                e.getId(),
                e.getOriginalFilename(),
                e.getSha256Hash(),
                e.getFileSizeBytes(),
                e.getUploadTimestamp(),
                e.getUploadedBy(),
                e.isRegistered(),
                e.getCaseId(),
                e.getTitle(),
                e.getDescription(),
                e.getEvidenceType(),
                e.getCollectionDate(),
                e.getCollectionTime(),
                e.getCollectedBy(),
                e.getCollectionLocation(),
                e.getRelatedSuspect(),
                e.getRelatedWitness(),
                e.getInvestigationTags(),
                e.getAdditionalRemarks()
        );
    }
}