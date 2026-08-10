package com.investigation.entity.enums;

public enum EvidenceType {
    IMAGE,
    VIDEO,
    AUDIO,
    DOCUMENT,
    ZIP,
    GPS_DATA,
    OTHER;

    /**
     * Best-effort guess from file extension, used only to pre-fill the
     * registration form for the investigator — never trusted as the
     * authoritative evidence type. The investigator confirms/corrects it
     * during registration (Module 5).
     */
    public static EvidenceType guessFromFilename(String filename) {

        if (filename == null || !filename.contains(".")) {
            return OTHER;
        }

        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (ext) {
            case "jpg", "jpeg", "png", "bmp", "webp", "gif" -> IMAGE;
            case "mp4", "mov", "avi", "mkv", "webm" -> VIDEO;
            case "mp3", "wav", "m4a", "aac", "ogg" -> AUDIO;
            case "pdf", "doc", "docx", "txt" -> DOCUMENT;
            case "zip", "rar", "7z" -> ZIP;
            case "gpx", "kml", "kmz" -> GPS_DATA;
            default -> OTHER;
        };
    }
}