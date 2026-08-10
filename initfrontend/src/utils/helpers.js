import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export function getFileExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : 'UNKNOWN';
}

export function isSupportedEvidenceFile(file) {
  const supported = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff',
    'mp4', 'avi', 'mov', 'mkv', 'wmv', 'webm',
    'mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a',
    'pdf',
    'zip', 'rar', '7z',
    'gpx', 'kml', 'kmz', 'csv',
  ];
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return supported.includes(ext);
}

export function getEvidenceTypeFromExtension(filename) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'];
  const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'webm'];
  const audioExts = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'];
  const gpsExts = ['gpx', 'kml', 'kmz', 'csv'];

  if (imageExts.includes(ext)) return 'IMAGE';
  if (videoExts.includes(ext)) return 'VIDEO';
  if (audioExts.includes(ext)) return 'AUDIO';
  if (ext === 'pdf') return 'DOCUMENT';
  if (['zip', 'rar', '7z'].includes(ext)) return 'ARCHIVE';
  if (gpsExts.includes(ext)) return 'GPS';
  return 'OTHER';
}

export function isAdminRole(role) {
  if (!role) return false;
  const normalized = role.toUpperCase();
  return normalized === 'ADMIN' || normalized === 'ADMINISTRATOR';
}

export function isInvestigatorRole(role) {
  if (!role) return false;
  const normalized = role.toUpperCase();
  return normalized === 'INVESTIGATOR' || normalized === 'USER';
}

export function getDashboardPath(role) {
  if (isAdminRole(role)) return '/admin/dashboard';
  return '/investigator/dashboard';
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getEvidenceTypeIcon(type) {
  const map = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: 'document',
    ARCHIVE: 'archive',
    GPS: 'gps',
    OTHER: 'file',
  };
  return map[type] ?? 'file';
}
