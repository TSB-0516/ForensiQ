package com.investigation.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.investigation.service.FileStorageService;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String store(MultipartFile file) {

        try {

            Path uploadPath = Paths.get(uploadDir);

            // Create uploads directory if it doesn't exist
            Files.createDirectories(uploadPath);

            String originalName = file.getOriginalFilename();

            String extension = "";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(
                        originalName.lastIndexOf(".")
                );
            }

            String storedFilename = UUID.randomUUID() + extension;

            Path targetPath = uploadPath.resolve(storedFilename);

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return storedFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public InputStream loadForHashing(MultipartFile file) {
        try {
            return file.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file for hashing", e);
        }
    }

    @Override
public void delete(String storedFilename) {
    try {
        if (storedFilename == null || storedFilename.isBlank()) {
            return;
        }

        Path uploadPath = Paths.get(uploadDir);
        Path filePath = uploadPath.resolve(storedFilename);

        Files.deleteIfExists(filePath);

    } catch (IOException e) {
        throw new RuntimeException("Failed to delete stored file", e);
    }
}

@Override
public InputStream loadFromDisk(String storedFilename) {
    try {
        Path uploadPath = Paths.get(uploadDir);
        Path filePath = uploadPath.resolve(storedFilename);

        if (!Files.exists(filePath)) {
            throw new RuntimeException("Stored file not found on disk: " + storedFilename);
        }

        return Files.newInputStream(filePath);

    } catch (IOException e) {
        throw new RuntimeException("Failed to load stored file for verification", e);
    }
}

}