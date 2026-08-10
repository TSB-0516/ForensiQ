import { Link } from "react-router-dom";
import { FileImage, FileVideo, FileAudio, FileText, FileArchive, MapPin, File, Eye } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import { formatFileSize } from "../../utils/formatFileSize";

const TYPE_ICONS = {
  IMAGE: FileImage,
  VIDEO: FileVideo,
  AUDIO: FileAudio,
  DOCUMENT: FileText,
  ZIP: FileArchive,
  GPS_DATA: MapPin,
  OTHER: File,
};

export default function EvidenceCard({ evidence }) {
  const Icon = TYPE_ICONS[evidence.evidenceType] || File;
  const destination = evidence.registered
    ? `/evidence/${evidence.id}`
    : `/evidence/register/${evidence.id}`;

  return (
    <Link
      to={destination}
      className="group relative bg-surface-container border border-outline-variant rounded-lg p-4 hover:border-action/40 transition flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="h-9 w-9 rounded bg-surface-container-high flex items-center justify-center shrink-0">
          <Icon size={17} className="text-on-surface-variant" strokeWidth={1.75} />
        </div>
        <Eye
          size={16}
          className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition mt-1"
        />
      </div>

      <div className="min-w-0">
        <p className="text-body-md text-on-surface font-medium truncate">
          {evidence.title || evidence.originalFilename}
        </p>
        <p className="text-label-sm text-on-surface-variant truncate mt-0.5">
          {evidence.originalFilename} · {formatFileSize(evidence.fileSizeBytes)}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant/60">
        <span className="text-label-sm text-on-surface-variant">
          {formatDateTime(evidence.uploadTimestamp)}
        </span>
        <StatusBadge registered={evidence.registered} />
      </div>
    </Link>
  );
}