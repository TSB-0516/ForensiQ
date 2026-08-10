import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { evidenceApi } from "../../api/evidenceApi";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDateTime, formatDateOnly } from "../../utils/formatDate";
import { formatFileSize } from "../../utils/formatFileSize";

export default function EvidenceDetails() {
  const { id } = useParams();
  const [evidence, setEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hashCopied, setHashCopied] = useState(false);

  useEffect(() => {
    evidenceApi
      .getById(id)
      .then(({ data }) => setEvidence(data))
      .catch(() => toast.error("Could not load evidence"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const copyHash = () => {
    navigator.clipboard.writeText(evidence.sha256Hash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 1500);
  };

  if (isLoading) return <p className="text-body-sm text-on-surface-variant">Loading...</p>;
  if (!evidence) return <p className="text-body-sm text-on-surface-variant">Evidence not found.</p>;

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Link to="/evidence" className="flex items-center gap-1.5 text-body-sm text-on-surface-variant hover:text-on-surface w-fit transition">
        <ArrowLeft size={15} />
        Back to Evidence Vault
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-headline-md mb-1">{evidence.title || evidence.originalFilename}</h2>
          <p className="text-body-sm text-on-surface-variant">{evidence.description}</p>
        </div>
        <StatusBadge registered={evidence.registered} />
      </div>

      <Section title="System Information">
        <Row label="Original Filename" value={evidence.originalFilename} mono />
        <Row
          label="SHA-256 Hash"
          value={
            <button onClick={copyHash} className="flex items-center gap-2 text-left group">
              <span className="font-mono text-body-sm break-all">{evidence.sha256Hash}</span>
              {hashCopied ? (
                <Check size={13} className="text-success shrink-0" />
              ) : (
                <Copy size={13} className="text-on-surface-variant opacity-0 group-hover:opacity-100 shrink-0 transition" />
              )}
            </button>
          }
        />
        <Row label="File Size" value={formatFileSize(evidence.fileSizeBytes)} />
        <Row label="Upload Timestamp" value={formatDateTime(evidence.uploadTimestamp)} />
        <Row label="Uploaded By" value={evidence.uploadedBy} />
      </Section>

      {evidence.registered && (
        <Section title="Registration Details">
          <Row label="Evidence Type" value={evidence.evidenceType?.replace("_", " ")} />
          <Row label="Collection Date" value={formatDateOnly(evidence.collectionDate)} />
          <Row label="Collection Time" value={evidence.collectionTime} />
          <Row label="Collected By" value={evidence.collectedBy} />
          <Row label="Collection Location" value={evidence.collectionLocation} />
          <Row label="Related Suspect" value={evidence.relatedSuspect || "—"} />
          <Row label="Related Witness" value={evidence.relatedWitness || "—"} />
          <Row label="Investigation Tags" value={evidence.investigationTags || "—"} />
          <Row label="Additional Remarks" value={evidence.additionalRemarks || "—"} />
        </Section>
      )}

      {!evidence.registered && (
        <Link
          to={`/evidence/register/${evidence.id}`}
          className="self-start bg-action text-action-on font-medium text-body-sm px-5 py-2.5 rounded hover:brightness-110 transition"
        >
          Complete Registration
        </Link>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-outline-variant">
        <p className="text-label-md text-on-surface-variant uppercase">{title}</p>
      </div>
      <div className="divide-y divide-outline-variant/60">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-6 px-4 py-3">
      <span className="text-body-sm text-on-surface-variant shrink-0">{label}</span>
      <span className={`text-body-sm text-on-surface text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}