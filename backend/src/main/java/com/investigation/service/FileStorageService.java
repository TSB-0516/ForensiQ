package com.investigation.service;

import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String store(MultipartFile file);

    InputStream loadForHashing(MultipartFile file);

    // Re-reads an already-stored file from disk by its stored filename —
    // used for integrity re-verification, distinct from loadForHashing()
    // which only handles an in-flight upload's MultipartFile.
    InputStream loadFromDisk(String storedFilename);

    void delete(String storedFilename);
}