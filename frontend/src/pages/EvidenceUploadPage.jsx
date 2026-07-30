import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  File,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SUPPORTED_FILE_TYPES } from '@/utils/constants';
import { cn, formatFileSize, isSupportedEvidenceFile } from '@/utils/helpers';

const FILE_CATEGORIES = [
  { label: 'Images', icon: Image, types: SUPPORTED_FILE_TYPES.images },
  { label: 'Videos', icon: Video, types: SUPPORTED_FILE_TYPES.videos },
  { label: 'Audio', icon: Music, types: SUPPORTED_FILE_TYPES.audio },
  { label: 'PDF', icon: FileText, types: SUPPORTED_FILE_TYPES.documents },
  { label: 'ZIP', icon: Archive, types: SUPPORTED_FILE_TYPES.archives },
  { label: 'GPS', icon: MapPin, types: SUPPORTED_FILE_TYPES.gps },
];

export default function EvidenceUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = useCallback((file) => {
    if (!file) return;

    if (!isSupportedEvidenceFile(file)) {
      toast.error('Unsupported file type', {
        description: 'Please upload an image, video, audio, PDF, ZIP, or GPS file.',
      });
      return;
    }

    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleProceed = () => {
    if (!selectedFile) return;

    navigate('/evidence/register', {
      state: {
        file: {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
        },
        fileObject: selectedFile,
      },
    });
  };

  return (
    <AppLayout
      title="Evidence Upload"
      subtitle="Secure intake for digital evidence files"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative rounded-sm border-2 border-dashed transition-colors',
            isDragging
              ? 'border-accent bg-accent/5'
              : selectedFile
                ? 'border-success/50 bg-success/5'
                : 'border-border bg-card hover:border-accent/30'
          )}
        >
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className={cn(
              'mb-4 flex h-14 w-14 items-center justify-center rounded-sm',
              isDragging ? 'bg-accent/20' : 'bg-sidebar'
            )}>
              <Upload className={cn('h-6 w-6', isDragging ? 'text-accent' : 'text-muted')} />
            </div>

            {selectedFile ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <File className="h-4 w-4 text-success" />
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                </div>
                <p className="text-xs text-muted">
                  {formatFileSize(selectedFile.size)} · Ready for registration
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">
                  Drag and drop evidence file here
                </p>
                <p className="mt-1 text-xs text-muted">
                  or use the browse button below
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.mp4,.avi,.mov,.mkv,.wmv,.webm,.mp3,.wav,.aac,.ogg,.flac,.m4a,.pdf,.zip,.rar,.7z,.gpx,.kml,.kmz,.csv"
              onChange={handleInputChange}
            />

            <div className="mt-6 flex gap-3">
              <Button variant="secondary" onClick={handleBrowse}>
                Browse Files
              </Button>
              {selectedFile && (
                <Button onClick={handleProceed}>
                  Proceed to Registration
                </Button>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supported File Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FILE_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.label}
                    className="flex items-start gap-3 rounded-sm border border-border bg-sidebar p-3"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{category.label}</p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {category.types.join(', ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 rounded-sm border border-border bg-sidebar p-4">
          <AlertTriangle className="h-4 w-4 shrink-0 text-accent-secondary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Chain of Custody Notice</p>
            <p className="mt-0.5 text-xs text-muted">
              All uploaded evidence is logged with operator identity, timestamp, and file hash.
              Do not modify original files before upload.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
