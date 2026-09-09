import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime } from '@/utils/helpers';
import { getTimelineEvents } from '@/mock/timelineData';

export default function TimelineSection({ caseId }) {
  const events = getTimelineEvents(caseId);

  if (!events || events.length === 0) {
    return <p className="text-muted">No timeline events for this case.</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.eventId} className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge variant="secondary">{event.type}</Badge>
              <span>{formatDateTime(event.timestamp)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className={cn('text-sm', 'text-muted')}>Title: {event.title}</p>
            {event.relatedEvidenceId && (
              <p className={cn('text-sm', 'text-muted')}>Evidence: {event.relatedEvidenceId}</p>
            )}
            <p className="text-sm">{event.description}</p>
            <p className={cn('text-sm', 'text-muted')}>By: {event.performedBy}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
