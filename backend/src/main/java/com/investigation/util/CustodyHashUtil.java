package com.investigation.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

import com.investigation.entity.enums.CustodyAction;

public class CustodyHashUtil {

    // Canonical, deterministic serialization. Field order and delimiter are
    // part of the contract — changing either invalidates every previously
    // computed hash in the table. Do not "clean this up" casually later.
    public static String buildCanonicalString(
            Long evidenceId,
            CustodyAction action,
            String performedBy,
            LocalDateTime timestamp,
            String remarks,
            String previousHash) {

        return evidenceId + "|" +
                action + "|" +
                performedBy + "|" +
                timestamp + "|" +
                (remarks == null ? "" : remarks) + "|" +
                (previousHash == null ? "" : previousHash);
    }

    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}