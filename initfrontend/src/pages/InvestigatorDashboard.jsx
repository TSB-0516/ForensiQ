import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Upload,
  Archive,
  AlertCircle,
  Briefcase,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCases } from '@/services/caseService';
import { formatDateTime } from '@/utils/helpers';

function StatusBadge({ status }) {
  const variant = status === 'OPEN' ? 'success' : status === 'IN_PROGRESS' ? 'accent' : 'default';

  return <Badge variant={variant}>{(status || 'UNKNOWN').replace('_', ' ')}</Badge>;
}

export default function InvestigatorDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCases = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyCases();
      setCases(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load assigned cases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const openCount = cases.filter((item) => item.status === 'OPEN').length;
  const inProgressCount = cases.filter((item) => item.status === 'IN_PROGRESS').length;
  const closedCount = cases.filter((item) => item.status === 'CLOSED').length;

  if (loading) {
    return <AppLayout title="Investigator Dashboard" subtitle="Your assigned investigations">
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Activity className="h-8 w-8 animate-pulse text-accent" />
          <p className="text-sm text-muted">Loading assigned cases...</p>
        </div>
      </div>
    </AppLayout>;
  }

  if (error) {
    return (
      <AppLayout title="Investigator Dashboard" subtitle="Your assigned investigations">
        <div className="flex h-64 items-center justify-center">
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-danger" />
            <p className="text-sm font-medium text-foreground">Error loading assigned cases</p>
            <p className="text-xs text-muted">{error}</p>
            <Button variant="secondary" onClick={loadCases}>
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Investigator Dashboard"
      subtitle="Your assigned investigations"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="My Cases"
            value={cases.length}
            icon={Briefcase}
            accent="accent"
          />
          <StatCard
            label="Open"
            value={openCount}
            icon={Activity}
            accent="success"
          />
          <StatCard label="In Progress" value={inProgressCount} icon={Activity} accent="secondary" />
          <StatCard label="Closed" value={closedCount} icon={Archive} accent="secondary" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-accent" />
              My Assigned Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cases.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No cases assigned"
                description="You currently have no investigations assigned to you."
              />
            ) : (
              <div className="space-y-3">
                {cases.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid gap-4 rounded-sm border border-border p-4 transition-colors hover:border-accent/30 lg:grid-cols-[1fr_auto] animate-slide-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="min-w-0 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-sidebar">
                          <Briefcase className="h-4 w-4 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-medium text-accent">{item.caseNumber}</span>
                            <StatusBadge status={item.status} />
                          </div>
                          <h3 className="mt-1 text-sm font-medium text-foreground">{item.title}</h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3 xl:grid-cols-5">
                        <div><span className="text-muted">Created Date</span><p className="mt-0.5 text-foreground">{formatDateTime(item.createdAt)}</p></div>
                        <div><span className="text-muted">Created By</span><p className="mt-0.5 truncate text-foreground">{item.createdBy || '—'}</p></div>
                        <div><span className="text-muted">Evidence Count</span><p className="mt-0.5 text-foreground">{item.evidenceCount ?? 0}</p></div>
                        <div><span className="text-muted">Last Updated</span><p className="mt-0.5 text-foreground">{formatDateTime(item.updatedAt)}</p></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="secondary" size="sm" className="w-full gap-2 lg:w-auto" onClick={() => navigate(`/cases/${item.id}`)}>
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-accent-secondary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                <Link to="/evidence/upload">
                  <Upload className="h-4 w-4" />
                  Upload Evidence
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                <Link to="/evidence/vault">
                  <Archive className="h-4 w-4" />
                  Evidence Vault
                </Link>
              </Button>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
