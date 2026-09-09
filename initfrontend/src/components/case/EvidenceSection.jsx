import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime } from '@/utils/helpers';
import { getCaseEvidence } from '@/mock/caseEvidenceData';
import { getEvidenceById } from '@/mock/evidenceData';

export default function EvidenceSection({ caseId }) {
  const evidenceIds = getCaseEvidence(caseId);
  const evidences = evidenceIds.map((id) => getEvidenceById(id)).filter(Boolean);

  if (evidences.length === 0) {
    return <p className="text-muted">No evidence linked to this case.</p>;
  }

  return (
    <div className="space-y-4">
      {evidences.map((ev) => (
        <Card key={ev.id} className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge variant="secondary">{ev.id}</Badge>
              {ev.filename}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className={cn('text-sm', 'text-muted')}>Uploaded: {formatDateTime(ev.uploadedAt)}</p>
            <p className={cn('text-sm', 'text-muted')}>Uploader: {ev.uploader}</p>
            <p className="font-mono text-xs break-all">Hash: {ev.hash}</p>
            <p className="text-sm">{ev.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
