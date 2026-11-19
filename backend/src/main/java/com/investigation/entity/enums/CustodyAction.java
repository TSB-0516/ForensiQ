package com.investigation.entity.enums;

public enum CustodyAction {
    UPLOADED,
    REGISTERED,
    CASE_ASSIGNED,
    INTEGRITY_VERIFIED,
    INTEGRITY_FAILURE,
    // Not yet wired to any endpoint — reserved for future features.
    DOWNLOADED,
    TRANSFERRED,
    VIEWED,
    RECEIVED,
    EXAMINED,
    RETURNED,
    COURT_SUBMISSION
}