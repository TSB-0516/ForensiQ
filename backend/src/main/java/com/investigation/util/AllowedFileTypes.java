package com.investigation.util;

import java.util.Set;

public class AllowedFileTypes {

    // Matches Module 4's supported categories: Images, Videos, Audio, PDF, ZIP, GPS data
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "bmp", "webp", "gif",
            "mp4", "mov", "avi", "mkv", "webm",
            "mp3", "wav", "m4a", "aac", "ogg",
            "pdf",
            "zip", "rar", "7z",
            "gpx", "kml", "kmz"
    );

    public static boolean isAllowed(String filename) {

        if (filename == null || !filename.contains(".")) {
            return false;
        }

        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(ext);
    }
}