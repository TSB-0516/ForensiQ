import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime } from '@/utils/helpers';
import { getCaseCustody } from '@/services/caseService';
import { toast } from 'sonner';
import { PageLoader } from '@/components/ui/spinner';

export default function CustodySection({ caseId }) {
  const [custodyEvents, setCustodyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustody = async () => {
      try {
        setLoading(true);
        const data = await getCaseCustody(caseId);
        setCustodyEvents(data);
      } catch (error) {
        toast.error('Failed to load custody history');
      } finally {
        setLoading(false);
      }
    };
    fetchCustody();
  }, [caseId]);

  if (loading) return <PageLoader message="Loading chain of custody..." />;

  if (custodyEvents.length === 0) {
    return <p className="text-muted">No custody events recorded for this case.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {custodyEvents.map((event) => (
          <Card key={event.custodyLogId} className="animate-fade-in border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{event.action}</Badge>
                  <span className="text-foreground">Evidence: {event.evidenceTitle}</span>
                  <span className="text-xs text-muted ml-2">ID: {event.evidenceId}</span>
                </div>
                <span className="text-sm font-normal text-muted">{formatDateTime(event.timestamp)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={cn('text-sm', 'text-muted')}>Performed By: {event.performedBy}</p>
              {event.remarks && <p className="text-sm mt-2">{event.remarks}</p>}
              <div className="mt-4 pt-3 border-t border-border grid gap-2">
                {event.previousHash && (
                  <div>
                    <p className="text-xs text-muted">Previous Hash</p>
                    <p className="font-mono text-xs break-all text-muted-foreground">{event.previousHash}</p>
                  </div>
                )}
                {event.currentHash && (
                  <div>
                    <p className="text-xs text-muted">Current Hash</p>
                    <p className="font-mono text-xs break-all text-foreground">{event.currentHash}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
