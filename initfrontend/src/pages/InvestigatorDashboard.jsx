import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HardDrive,
  Activity,
  Upload,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dashboardService from '@/services/dashboardService';

export default function InvestigatorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await dashboardService.getInvestigatorDashboard();
        setData(result);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Investigator Dashboard" subtitle="Your evidence operations">
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Activity className="h-8 w-8 animate-pulse text-accent" />
            <p className="text-sm text-muted">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Investigator Dashboard" subtitle="Your evidence operations">
        <div className="flex h-64 items-center justify-center">
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-danger" />
            <p className="text-sm font-medium text-foreground">Error loading dashboard</p>
            <p className="text-xs text-muted">{error}</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>
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
      subtitle="Your evidence operations"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="My Uploaded Evidence"
            value={data.myUploadedEvidenceCount ?? 0}
            icon={Upload}
            accent="accent"
          />
          <StatCard
            label="My Registered Evidence"
            value={data.myRegisteredEvidenceCount ?? 0}
            icon={HardDrive}
            accent="success"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" />
                  Recent Evidence
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y divide-border">
                {!data.recentEvidence || data.recentEvidence.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted">
                    No recent evidence found.
                  </div>
                ) : (
                  data.recentEvidence.map((item) => (
                    <div key={item.id || Math.random()} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-sidebar">
                        <FileText className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">{item.title}</p>
                        <p className="text-xs text-muted">
                          {item.id && <span className="font-mono text-accent">#{item.id}</span>}
                          {item.id && ' · '}
                          {item.uploadTimestamp ? new Date(item.uploadTimestamp).toLocaleString() : 'Date unknown'}
                          {` · Status: ${item.registered ? 'Registered' : 'Unregistered'}`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
