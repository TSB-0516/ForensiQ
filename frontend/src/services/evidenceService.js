/**
 * Evidence service — mock implementation ready for backend swap.
 * Replace internal storage calls with api.get/post when endpoints exist.
 */

import { EVIDENCE_STORAGE_KEY } from '@/utils/constants';

export const INTEGRITY_STATUS = {
  VERIFIED: 'Verified',
  PENDING: 'Pending',
};

const SEED_EVIDENCE = [
  {
    id: 'EV-00021',
    title: 'CCTV Footage — RS Puram Junction',
    originalFilename: 'Camera4_12072026.mp4',
    evidenceType: 'VIDEO',
    uploadDate: '2026-07-12T09:14:00',
    uploadedBy: 'Inspector Rahul Sharma',
    integrityStatus: INTEGRITY_STATUS.VERIFIED,
    tags: ['cctv', 'surveillance', 'night-recording'],
    fileSize: 524288000,
    fileType: 'MP4',
    description: 'Night-time CCTV capture from RS Puram traffic junction showing suspect vehicle movement.',
    collectionDate: '2026-07-12',
    collectionTime: '02:45',
    collectedBy: 'Inspector Rahul Sharma',
    location: 'RS Puram Junction, Coimbatore',
    relatedSuspect: 'Unknown — White Innova KA-03-MH-4821',
    relatedWitness: 'Constable Venkatesh M.',
    remarks: 'Footage timestamp verified against NTP server logs.',
    sha256Hash: 'a3f5c8d9e2b1...7f4e2a9c',
    department: 'Coimbatore City Police',
  },
  {
    id: 'EV-00020',
    title: 'WhatsApp Image — Crime Scene Exterior',
    originalFilename: 'IMG-20260712-WA0007.jpg',
    evidenceType: 'IMAGE',
    uploadDate: '2026-07-12T11:32:00',
    uploadedBy: 'Sub-Inspector Priya Nair',
    integrityStatus: INTEGRITY_STATUS.VERIFIED,
    tags: ['whatsapp', 'crime-scene', 'exterior'],
    fileSize: 3145728,
    fileType: 'JPEG',
    description: 'Exterior photograph of premises received via witness WhatsApp transfer.',
    collectionDate: '2026-07-12',
    collectionTime: '08:20',
    collectedBy: 'Sub-Inspector Priya Nair',
    location: 'Gandhipuram, Coimbatore',
    relatedSuspect: '',
    relatedWitness: 'Witness — Lakshmi Devi',
    remarks: 'EXIF metadata preserved. Original transfer receipt attached in case file.',
    sha256Hash: 'b7e2a1c4d9f3...8a1c5e7b',
    department: 'Coimbatore City Police',
  },
  {
    id: 'EV-00019',
    title: 'FSL Forensic Analysis Report',
    originalFilename: 'FSL_Report_218.pdf',
    evidenceType: 'DOCUMENT',
    uploadDate: '2026-07-11T16:45:00',
    uploadedBy: 'Inspector Rahul Sharma',
    integrityStatus: INTEGRITY_STATUS.VERIFIED,
    tags: ['fsl', 'forensic', 'lab-report'],
    fileSize: 2097152,
    fileType: 'PDF',
    description: 'Forensic Science Laboratory report on recovered digital storage device.',
    collectionDate: '2026-07-10',
    collectionTime: '14:00',
    collectedBy: 'FSL Chennai — Dr. Karthik Rajan',
    location: 'Forensic Science Laboratory, Chennai',
    relatedSuspect: 'Accused — Mohan Kumar S.',
    relatedWitness: '',
    remarks: 'Official FSL seal verified. Report reference FSL/TN/2026/218.',
    sha256Hash: 'c9d4e7f2a1b8...3d6f9e2c',
    department: 'Coimbatore City Police',
  },
  {
    id: 'EV-00018',
    title: 'Mobile Phone Audio Recording — Witness Statement',
    originalFilename: 'Witness_Stmt_11072026.m4a',
    evidenceType: 'AUDIO',
    uploadDate: '2026-07-11T10:22:00',
    uploadedBy: 'Constable Arjun Reddy',
    integrityStatus: INTEGRITY_STATUS.PENDING,
    tags: ['witness', 'audio', 'statement'],
    fileSize: 8388608,
    fileType: 'M4A',
    description: 'Audio recording of witness statement taken at Peelamedu police station.',
    collectionDate: '2026-07-11',
    collectionTime: '10:00',
    collectedBy: 'Constable Arjun Reddy',
    location: 'Peelamedu Police Station, Coimbatore',
    relatedSuspect: '',
    relatedWitness: 'Witness — Ramesh Babu',
    remarks: 'Awaiting integrity hash verification from digital forensics unit.',
    sha256Hash: null,
    department: 'Coimbatore City Police',
  },
  {
    id: 'EV-00017',
    title: 'Seized Device Backup Archive',
    originalFilename: 'Device_Backup_Samsung_A54.zip',
    evidenceType: 'ARCHIVE',
    uploadDate: '2026-07-10T14:08:00',
    uploadedBy: 'Inspector Rahul Sharma',
    integrityStatus: INTEGRITY_STATUS.VERIFIED,
    tags: ['mobile', 'backup', 'seized-device'],
    fileSize: 1073741824,
    fileType: 'ZIP',
    description: 'Full logical backup of seized Samsung Galaxy A54 using Cellebrite UFED.',
    collectionDate: '2026-07-10',
    collectionTime: '11:30',
    collectedBy: 'Digital Forensics Unit — Coimbatore',
    location: 'Cyber Crime Cell, Coimbatore City Police',
    relatedSuspect: 'Accused — Mohan Kumar S.',
    relatedWitness: '',
    remarks: 'Write-blocker used during acquisition. Hash logged in seizure memo.',
    sha256Hash: 'd1f8a3c6e9b2...5a7d3f1e',
    department: 'Coimbatore City Police',
  },
  {
    id: 'EV-00016',
    title: 'GPS Track Log — Suspect Vehicle Route',
    originalFilename: 'Route_Track_09072026.gpx',
    evidenceType: 'GPS',
    uploadDate: '2026-07-09T17:55:00',
    uploadedBy: 'Sub-Inspector Priya Nair',
    integrityStatus: INTEGRITY_STATUS.VERIFIED,
    tags: ['gps', 'tracking', 'vehicle-route'],
    fileSize: 524288,
    fileType: 'GPX',
    description: 'GPS track log extracted from fleet management system for suspect vehicle.',
    collectionDate: '2026-07-09',
    collectionTime: '15:00',
    collectedBy: 'Sub-Inspector Priya Nair',
    location: 'Singanallur to Saibaba Colony route',
    relatedSuspect: 'Unknown — White Innova KA-03-MH-4821',
    relatedWitness: '',
    remarks: 'Coordinates cross-referenced with ANPR camera timestamps.',
    sha256Hash: 'e4a7b2d9c1f6...9e3a8b4d',
    department: 'Coimbatore City Police',
  },
  {
    id: 'EV-00015',
    title: 'Bank Transaction Statement Scan',
    originalFilename: 'SBI_Statement_Jun2026.pdf',
    evidenceType: 'DOCUMENT',
    uploadDate: '2026-07-09T09:30:00',
    uploadedBy: 'Inspector Rahul Sharma',
    integrityStatus: INTEGRITY_STATUS.PENDING,
    tags: ['financial', 'bank-statement', 'fraud'],
    fileSize: 1572864,
    fileType: 'PDF',
    description: 'Scanned SBI account statement for accused — June 2026 transactions.',
    collectionDate: '2026-07-08',
    collectionTime: '16:00',
    collectedBy: 'Inspector Rahul Sharma',
    location: 'State Bank of India, Race Course Branch',
    relatedSuspect: 'Accused — Mohan Kumar S.',
    relatedWitness: 'Bank Manager — Mr. Srinivasan',
    remarks: 'Pending verification against original bank-issued document.',
    sha256Hash: null,
    department: 'Coimbatore City Police',
  },
  {
    id: 'EV-00014',
    title: 'Crime Scene Photograph — Entry Point',
    originalFilename: 'CS_Photo_Entry_08072026.jpg',
    evidenceType: 'IMAGE',
    uploadDate: '2026-07-08T18:12:00',
    uploadedBy: 'Constable Arjun Reddy',
    integrityStatus: INTEGRITY_STATUS.VERIFIED,
    tags: ['crime-scene', 'photograph', 'entry-point'],
    fileSize: 4194304,
    fileType: 'JPEG',
    description: 'Photograph of forced entry point at commercial premises, Saibaba Colony.',
    collectionDate: '2026-07-08',
    collectionTime: '07:45',
    collectedBy: 'Constable Arjun Reddy',
    location: 'Saibaba Colony, Coimbatore',
    relatedSuspect: '',
    relatedWitness: 'Security Guard — Mr. Palanisamy',
    remarks: 'Scale reference included in frame. GPS coordinates embedded in EXIF.',
    sha256Hash: 'f2b9c4e7a3d1...6c8e5a2f',
    department: 'Coimbatore City Police',
  },
];

function loadStoredEvidence() {
  try {
    const raw = localStorage.getItem(EVIDENCE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredEvidence(items) {
  localStorage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(items));
}

function generateEvidenceId(existingItems) {
  const allIds = [...SEED_EVIDENCE, ...existingItems].map((e) => {
    const num = parseInt(e.id.replace('EV-', ''), 10);
    return Number.isNaN(num) ? 0 : num;
  });
  const next = Math.max(0, ...allIds) + 1;
  return `EV-${String(next).padStart(5, '0')}`;
}

function generateMockHash() {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Simulates API delay for realistic UX.
 */
function simulateDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /evidence — list all evidence
 */
export async function getEvidenceList() {
  await simulateDelay(300);
  const stored = loadStoredEvidence();
  return [...stored, ...SEED_EVIDENCE].sort(
    (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
  );
}

/**
 * GET /evidence/:id — single evidence item
 */
export async function getEvidenceById(id) {
  await simulateDelay(200);
  const all = [...loadStoredEvidence(), ...SEED_EVIDENCE];
  return all.find((item) => item.id === id) ?? null;
}

/**
 * POST /evidence/register — register new evidence
 */
export async function registerEvidence(data) {
  await simulateDelay(800);

  const stored = loadStoredEvidence();
  const now = new Date();
  const tags = data.tags
    ? data.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const newItem = {
    id: generateEvidenceId(stored),
    title: data.title,
    originalFilename: data.originalFilename,
    evidenceType: data.evidenceType,
    uploadDate: now.toISOString(),
    uploadedBy: data.collectedBy || 'Unknown Operator',
    integrityStatus: INTEGRITY_STATUS.PENDING,
    tags,
    fileSize: data.fileSize ?? 0,
    fileType: data.fileType ?? 'UNKNOWN',
    description: data.description ?? '',
    collectionDate: data.collectionDate,
    collectionTime: data.collectionTime,
    collectedBy: data.collectedBy,
    location: data.location,
    relatedSuspect: data.relatedSuspect ?? '',
    relatedWitness: data.relatedWitness ?? '',
    remarks: data.remarks ?? '',
    sha256Hash: generateMockHash(),
    department: 'Coimbatore City Police',
  };

  saveStoredEvidence([newItem, ...stored]);
  return { success: true, evidence: newItem };
}

/**
 * Stats helper for dashboards — derived from evidence list.
 */
export async function getEvidenceStats() {
  const list = await getEvidenceList();
  const verified = list.filter((e) => e.integrityStatus === INTEGRITY_STATUS.VERIFIED).length;
  const pending = list.filter((e) => e.integrityStatus === INTEGRITY_STATUS.PENDING).length;
  return {
    total: list.length,
    verified,
    pending,
    recent: list.slice(0, 5),
  };
}
