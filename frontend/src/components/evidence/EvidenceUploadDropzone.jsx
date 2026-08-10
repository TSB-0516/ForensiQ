import { useState, useRef } from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";
import { formatFileSize } from "../../utils/formatFileSize";

export default function EvidenceUploadDropzone({ onFileSelected, selectedFile, onClear }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  if (selectedFile) {
    return (
      <div className="border border-outline-variant rounded-lg p-5 bg-surface-container flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded bg-success/10 flex items-center justify-center shrink-0">
            <FileCheck2 size={18} className="text-success" />
          </div>
          <div className="min-w-0">
            <p className="text-body-sm text-on-surface truncate">{selectedFile.name}</p>
            <p className="text-label-sm text-on-surface-variant">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="shrink-0 h-8 w-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
        isDragActive
          ? "border-action bg-action/5"
          : "border-outline-variant bg-surface-container hover:border-outline"
      }`}
    >
      <div className="h-11 w-11 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
        <UploadCloud size={20} className="text-on-surface-variant" strokeWidth={1.75} />
      </div>
      <p className="text-body-md text-on-surface mb-1">
        Drag and drop evidence, or <span className="text-action font-medium">browse</span>
      </p>
      <p className="text-label-sm text-on-surface-variant">
        Images, video, audio, PDF, ZIP, or GPS data files
      </p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
    </div>
  );
}