package com.investigation.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /**
     * Stores the file on disk under a random name and returns the stored filename.
     */
    String store(MultipartFile file);

    java.io.InputStream loadForHashing(MultipartFile file);
}