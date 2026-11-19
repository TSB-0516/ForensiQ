import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  Calendar,
  User,
  File,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCaseById, updateCaseStatus } from '@/services/caseService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn, formatDateTime, isAdminRole } from '@/utils/helpers';
import EvidenceSection from '@/components/case/EvidenceSection';
import CustodySection from '@/components/case/CustodySection';
import TimelineSection from '@/components/case/TimelineSection';
import AssignedInvestigators from '@/components/case/AssignedInvestigators';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

function StatusBadge({ status }) {
  let variant = 'secondary';
  if (status === 'OPEN') variant = 'success';
  if (status === 'IN_PROGRESS') variant = 'accent';
  if (status === 'CLOSED') variant = 'default';

  return (
    <Badge variant={variant}>
      {status?.replace('_', ' ')}
    </Badge>
  );
}

function DetailField({ label, value, icon: Icon, mono, multiline }) {
  return (
    <div className="rounded-sm border border-border bg-sidebar p-3 h-full">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
        {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
        {label}
      </p>
      <p className={cn(
        'mt-1.5 text-sm text-foreground break-words',
        mono && 'font-mono text-xs',
        multiline && 'whitespace-pre-wrap'
      )}>
        {value !== null && value !== undefined && value !== '' ? value : '—'}
      </p>
    </div>
  );
}

export default function CaseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const canUpdateStatus = isAdminRole(role);

  const loadCase = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getCaseById(id);
      setCaseData(data);
    } catch (error) {
      console.error('Failed to load case:', error);
      setFetchError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Case not found or access denied.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  const commitStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateCaseStatus(id, newStatus);
      setCaseData(prev => ({ ...prev, status: newStatus }));
      toast.success('Case status updated', {
        description: `Case ${caseData.caseNumber} is now ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status', {
        description: error.response?.data?.message || 'An error occurred while updating the status.',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    if (!caseData || newStatus === caseData.status) return;
    if (newStatus === 'CLOSED') {
      setShowCloseConfirm(true);
    } else {
      commitStatusUpdate(newStatus);
    }
  };

  const confirmClose = () => {
    commitStatusUpdate('CLOSED');
    setShowCloseConfirm(false);
  };

  const cancelClose = () => {
    setShowCloseConfirm(false);
  };

  if (loading) {
    return <PageLoader message="Loading case details..." />;
  }

  if (fetchError || !caseData) {
    return (
      <AppLayout title="Case Details">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -mt-2 text-muted"
            onClick={() => navigate('/cases')}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cases
          </Button>
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-sm border border-border bg-card text-center">
            <AlertTriangle className="h-8 w-8 text-danger" />
            <p className="text-sm text-danger">{fetchError}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Case Details"
      subtitle={`${caseData.caseNumber} — Investigation Workspace`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -mt-2 text-muted"
        onClick={() => navigate('/cases')}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Cases
      </Button>

      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="custody">Chain of Custody</TabsTrigger>
          <TabsTrigger value="timeline">Investigation Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="h-5 w-5 text-accent" aria-hidden="true" />
                    {caseData.title}
                  </CardTitle>
                  <p className="mt-1 font-mono text-sm text-muted">{caseData.caseNumber}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={caseData.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {canUpdateStatus && (
                <div className="rounded-sm border border-border bg-sidebar p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Manage Case Status</p>
                    <p className="text-xs text-muted mt-0.5">Update the current lifecycle stage of this investigation.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {showCloseConfirm ? (
                      <div className="flex items-center gap-2 bg-danger/10 p-2 rounded-sm border border-danger/20">
                        <p className="text-xs text-danger font-medium mr-2">Confirm close?</p>
                        <Button variant="ghost" size="sm" onClick={cancelClose} className="h-7 text-xs px-2" disabled={updatingStatus}>Cancel</Button>
                        <Button variant="default" size="sm" onClick={confirmClose} className="h-7 text-xs px-3 bg-danger hover:bg-danger/90 text-white" disabled={updatingStatus}>
                          {updatingStatus ? 'Closing...' : 'Close Case'}
                        </Button>
                      </div>
                    ) : (
                      <div className="w-48">
                        <Select value={caseData.status} onValueChange={handleStatusChange} disabled={updatingStatus}>
                          <SelectTrigger aria-label="Update status" className={updatingStatus ? 'opacity-50' : ''}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailField label="Case Number" value={caseData.caseNumber} icon={Briefcase} mono />
                <DetailField label="Created By" value={caseData.createdBy} icon={User} />
                <DetailField label="Created Date" value={formatDateTime(caseData.createdAt)} icon={Calendar} />
                <DetailField label="Last Updated" value={formatDateTime(caseData.updatedAt)} icon={Clock} />
              </div>
              <div className="grid gap-3 sm:grid-cols-1">
                <DetailField label="Description" value={caseData.description} multiline />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailField label="Evidence Items" value={caseData.evidenceCount?.toString() || '0'} icon={File} />
              </div>

              <div className="rounded-sm border border-border bg-sidebar p-4 mt-6">
                <AssignedInvestigators caseId={caseData.id} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          <EvidenceSection caseId={caseData.id} />
        </TabsContent>

        <TabsContent value="custody" className="mt-4">
          <CustodySection caseId={caseData.id} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <TimelineSection caseId={caseData.id} caseTitle={caseData.title} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
