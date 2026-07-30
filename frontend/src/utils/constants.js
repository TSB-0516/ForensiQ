export const ROLES = {
  ADMIN: 'ADMIN',
  INVESTIGATOR: 'INVESTIGATOR',
};

export const AUTH_STORAGE_KEY = 'ueiip_auth';
export const EVIDENCE_STORAGE_KEY = 'ueiip_evidence';

export const INTEGRITY_FILTER_OPTIONS = ['ALL', 'Verified', 'Pending'];
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const SUPPORTED_FILE_TYPES = {
  images: ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'BMP', 'TIFF'],
  videos: ['MP4', 'AVI', 'MOV', 'MKV', 'WMV', 'WEBM'],
  audio: ['MP3', 'WAV', 'AAC', 'OGG', 'FLAC', 'M4A'],
  documents: ['PDF'],
  archives: ['ZIP', 'RAR', '7Z'],
  gps: ['GPX', 'KML', 'KMZ', 'CSV'],
};

export const EVIDENCE_TYPES = [
  'IMAGE',
  'VIDEO',
  'AUDIO',
  'DOCUMENT',
  'ARCHIVE',
  'GPS',
  'OTHER',
];

export const NAV_ITEMS = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard', section: 'main' },
    { label: 'Evidence Vault', path: '/evidence/vault', icon: 'Archive', section: 'evidence' },
    { label: 'Upload Evidence', path: '/evidence/upload', icon: 'Upload', section: 'evidence' },
    { label: 'Profile', path: '/profile', icon: 'User', section: 'main' },
  ],
  investigator: [
    { label: 'Dashboard', path: '/investigator/dashboard', icon: 'LayoutDashboard', section: 'main' },
    { label: 'Evidence Vault', path: '/evidence/vault', icon: 'Archive', section: 'evidence' },
    { label: 'Upload Evidence', path: '/evidence/upload', icon: 'Upload', section: 'evidence' },
    { label: 'Profile', path: '/profile', icon: 'User', section: 'main' },
  ],
};
