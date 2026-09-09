import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime } from '@/utils/helpers';
import { getCaseEvidence } from '@/mock/caseEvidenceData';
import { getCustodyHistory } from '@/mock/custodyData';

export default function CustodySection({ caseId }) {
  const evidenceIds = getCaseEvidence(caseId);
  const [selectedId, setSelectedId] = useState(evidenceIds[0] || '');
  const custodyEvents = selectedId ? getCustodyHistory(selectedId) : [];

  return (
    <div className="space-y-6">
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select evidence" />
        </SelectTrigger>
        <SelectContent>
          {evidenceIds.map((id) => (
            <SelectItem key={id} value={id}>
              {id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {custodyEvents.length === 0 ? (
        <p className="text-muted">No custody events for the selected evidence.</p>
      ) : (
        <div className="space-y-4">
          {custodyEvents.map((event) => (
            <Card key={event.eventId} className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Badge variant="secondary">{event.action}</Badge>
                  <span>{formatDateTime(event.timestamp)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className={cn('text-sm', 'text-muted')}>Performed By: {event.performedBy}</p>
                <p className={cn('text-sm', 'text-muted')}>Role: {event.role}</p>
                {event.location && <p className={cn('text-sm', 'text-muted')}>Location: {event.location}</p>}
                {event.fromLocation && event.toLocation && (
                  <p className={cn('text-sm', 'text-muted')}>
                    Transfer: {event.fromLocation} → {event.toLocation}
                  </p>
                )}
                <p className="text-sm">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
