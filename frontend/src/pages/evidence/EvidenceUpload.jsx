import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import EvidenceUploadDropzone from "../../components/evidence/EvidenceUploadDropzone";
import { evidenceApi } from "../../api/evidenceApi";

export default function EvidenceUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const { data } = await evidenceApi.upload(file, (e) => {
        setProgress(Math.round((e.loaded / e.total) * 100));
      });

      toast.success("File uploaded. SHA-256 hash verified.");
      // Straight into registration — an uploaded-but-unregistered item
      // isn't useful on its own (Module 5 requirement).
      navigate(`/evidence/register/${data.evidenceId}`, {
        state: { suggestedType: data.suggestedEvidenceType, originalFilename: data.originalFilename },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-headline-sm mb-1">Upload Evidence</h2>
        <p className="text-body-sm text-on-surface-variant">
          The file's original name is preserved exactly as received — it will never be renamed.
          A SHA-256 hash is generated automatically to verify integrity.
        </p>
      </div>

      <EvidenceUploadDropzone
        selectedFile={file}
        onFileSelected={setFile}
        onClear={() => setFile(null)}
      />

      {isUploading && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-action transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-label-sm text-on-surface-variant">Uploading... {progress}%</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="self-start flex items-center gap-2 bg-action text-action-on font-medium text-body-sm px-5 py-2.5 rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isUploading && <Loader2 size={15} className="animate-spin" />}
        {isUploading ? "Uploading..." : "Upload & Continue to Registration"}
      </button>
    </div>
  );
}