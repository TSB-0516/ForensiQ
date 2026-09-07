package com.investigation.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.investigation.dto.request.EvidenceRegistrationRequest;
import com.investigation.dto.response.EvidenceResponse;
import com.investigation.dto.response.EvidenceUploadResponse;
import com.investigation.entity.Evidence;
import com.investigation.entity.enums.EvidenceType;
import com.investigation.exception.ResourceNotFoundException;
import com.investigation.exception.UnauthorizedActionException;
import com.investigation.repository.EvidenceRepository;
import com.investigation.service.EvidenceService;
import com.investigation.service.FileStorageService;
import com.investigation.util.AllowedFileTypes;
import com.investigation.util.HashUtil;

@Service
public class EvidenceServiceImpl implements EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final FileStorageService fileStorageService;

    public EvidenceServiceImpl(EvidenceRepository evidenceRepository,
            FileStorageService fileStorageService) {
        this.evidenceRepository = evidenceRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public EvidenceUploadResponse uploadEvidence(MultipartFile file, String uploadedByEmail) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("No file provided");
        }

        if (!AllowedFileTypes.isAllowed(file.getOriginalFilename())) {
            throw new RuntimeException(
                    "Unsupported file type. Allowed: images, video, audio, PDF, ZIP, GPS data files.");
        }

        String hash = HashUtil.sha256(fileStorageService.loadForHashing(file));
        String storedFilename = fileStorageService.store(file);

        Evidence evidence = new Evidence();
        evidence.setOriginalFilename(file.getOriginalFilename());
        evidence.setStoredFilename(storedFilename);
        evidence.setStoragePath("uploads/" + storedFilename);
        evidence.setSha256Hash(hash);
        evidence.setFileSizeBytes(file.getSize());
        evidence.setUploadTimestamp(LocalDateTime.now());
        evidence.setUploadedBy(uploadedByEmail);
        evidence.setRegistered(false);

        Evidence saved = evidenceRepository.save(evidence);

        EvidenceType suggestedType = EvidenceType.guessFromFilename(saved.getOriginalFilename());

        return new EvidenceUploadResponse(
                saved.getId(),
                saved.getOriginalFilename(),
                saved.getSha256Hash(),
                saved.getFileSizeBytes(),
                saved.getUploadTimestamp(),
                suggestedType
        );
    }

    @Override
    public EvidenceResponse registerEvidence(
            Long evidenceId,
            EvidenceRegistrationRequest request,
            String requesterEmail,
            boolean isAdmin) {

        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Evidence not found with id: " + evidenceId));

        // Investigators can only register evidence they uploaded.
        // Admins can register any evidence.
        if (!isAdmin && !evidence.getUploadedBy().equals(requesterEmail)) {
            throw new UnauthorizedActionException(
                    "You can only register evidence that you uploaded.");
        }

        evidence.setTitle(request.getTitle());
        evidence.setDescription(request.getDescription());
        evidence.setEvidenceType(request.getEvidenceType());
        evidence.setCollectionDate(request.getCollectionDate());
        evidence.setCollectionTime(request.getCollectionTime());
        evidence.setCollectedBy(request.getCollectedBy());
        evidence.setCollectionLocation(request.getCollectionLocation());
        evidence.setRelatedSuspect(request.getRelatedSuspect());
        evidence.setRelatedWitness(request.getRelatedWitness());
        evidence.setInvestigationTags(request.getInvestigationTags());
        evidence.setAdditionalRemarks(request.getAdditionalRemarks());
        evidence.setRegistered(true);

        Evidence saved = evidenceRepository.save(evidence);

        return toResponse(saved);
    }

    @Override
    public List<EvidenceResponse> getAllEvidence() {
        return evidenceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EvidenceResponse> getEvidenceByCurrentUser(String uploadedByEmail) {
        return evidenceRepository.findByUploadedBy(uploadedByEmail)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EvidenceResponse getEvidenceById(Long id) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with id: " + id));
        return toResponse(evidence);
    }

    private EvidenceResponse toResponse(Evidence e) {
        return new EvidenceResponse(
                e.getId(),
                e.getOriginalFilename(),
                e.getSha256Hash(),
                e.getFileSizeBytes(),
                e.getUploadTimestamp(),
                e.getUploadedBy(),
                e.isRegistered(),
                e.getInvestigationCase() != null ? e.getInvestigationCase().getId() : null,
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

    @Override
    @Transactional
    public void deleteEvidence(Long evidenceId, String requesterEmail, boolean isAdmin) {

        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with id: " + evidenceId));

        if (isAdmin) {
            evidenceRepository.delete(evidence);
            fileStorageService.delete(evidence.getStoredFilename());
            return;
        }

        if (!evidence.getUploadedBy().equals(requesterEmail)) {
            throw new UnauthorizedActionException("You can only delete evidence that you uploaded.");
        }

        if (evidence.isRegistered()) {
            throw new UnauthorizedActionException("Registered evidence cannot be deleted by an investigator.");
        }

        evidenceRepository.delete(evidence);
        fileStorageService.delete(evidence.getStoredFilename());
    }
}
