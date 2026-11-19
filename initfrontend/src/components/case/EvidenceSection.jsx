import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatDateTime } from '@/utils/helpers';
import { getCaseEvidence } from '@/services/caseService';
import { getAllEvidence, assignEvidenceToCase } from '@/services/evidenceService';
import { toast } from 'sonner';
import { PageLoader } from '@/components/ui/spinner';
import { Upload, Link } from 'lucide-react';

export default function EvidenceSection({ caseId }) {
  const navigate = useNavigate();
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Assign evidence state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableEvidence, setAvailableEvidence] = useState([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const data = await getCaseEvidence(caseId);
      setEvidences(data);
    } catch (error) {
      toast.error('Failed to load case evidence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [caseId]);

  const openAssignModal = async () => {
    try {
      const allEv = await getAllEvidence();
      // Filter out evidence that is already assigned to THIS case
      // (Backend might allow assigning unassigned, but just to be safe)
      const unassigned = allEv.filter(ev => String(ev.caseId) !== String(caseId));
      setAvailableEvidence(unassigned);
      setSelectedEvidenceId('');
      setShowAssignModal(true);
    } catch (error) {
      toast.error('Failed to fetch available evidence');
    }
  };

  const handleAssignConfirm = async () => {
    if (!selectedEvidenceId) return;
    try {
      setAssigning(true);
      await assignEvidenceToCase(selectedEvidenceId, caseId);
      toast.success('Evidence assigned successfully');
      setShowAssignModal(false);
      fetchEvidence();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign evidence');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <PageLoader message="Loading evidence..." />;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-4">
        <Button onClick={openAssignModal} variant="outline" className="gap-2">
          <Link className="h-4 w-4" /> Assign Evidence
        </Button>
        <Button onClick={() => navigate(`/evidence/upload?caseId=${caseId}`)} className="gap-2">
          <Upload className="h-4 w-4" /> Upload Evidence to This Case
        </Button>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-lg w-[400px] p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Assign Existing Evidence</h2>
            <div className="space-y-4">
              <Select value={selectedEvidenceId} onValueChange={setSelectedEvidenceId} disabled={assigning}>
                <SelectTrigger>
                  <SelectValue placeholder="Select evidence to assign" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvidence.map(ev => (
                    <SelectItem key={ev.id} value={ev.id.toString()}>
                      {ev.id} - {ev.originalFilename || ev.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowAssignModal(false)} disabled={assigning}>Cancel</Button>
                <Button onClick={handleAssignConfirm} disabled={!selectedEvidenceId || assigning}>
                  {assigning ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {evidences.length === 0 ? (
        <p className="text-muted">No evidence linked to this case.</p>
      ) : (
        evidences.map((ev) => (
          <Card key={ev.id} className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Badge variant="secondary">{ev.id}</Badge>
                {ev.originalFilename || ev.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={cn('text-sm', 'text-muted')}>Uploaded: {formatDateTime(ev.uploadTimestamp)}</p>
              <p className={cn('text-sm', 'text-muted')}>Uploader: {ev.uploadedBy}</p>
              <p className={cn('text-sm', 'text-muted')}>Status: {ev.registrationStatus}</p>
              {ev.evidenceType && <p className={cn('text-sm', 'text-muted')}>Type: {ev.evidenceType}</p>}
              {ev.hash && <p className="font-mono text-xs break-all text-muted mt-2">Hash: {ev.hash}</p>}
              {ev.description && <p className="text-sm mt-2">{ev.description}</p>}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
