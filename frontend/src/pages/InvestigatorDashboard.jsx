import { Link } from 'react-router-dom';
import {
  Briefcase,
  HardDrive,
  Activity,
  Upload,
  FolderOpen,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MOCK_STATS = {
  assignedCases: 7,
  evidenceUploaded: 34,
};

const MOCK_CASES = [
  { id: '2024-0891', title: 'Financial Fraud Investigation', status: 'Active', priority: 'High' },
  { id: '2024-0876', title: 'Digital Asset Recovery', status: 'Active', priority: 'Medium' },
  { id: '2024-0854', title: 'Corporate Espionage Case', status: 'Review', priority: 'High' },
];

const MOCK_ACTIVITY = [
  { id: 1, action: 'Evidence submitted — surveillance footage', caseId: '2024-0891', time: '28 min ago' },
  { id: 2, action: 'Case note added — witness interview summary', caseId: '2024-0876', time: '1 hr ago' },
  { id: 3, action: 'Evidence verified — mobile device dump', caseId: '2024-0854', time: '3 hr ago' },
  { id: 4, action: 'New assignment — Case #2024-0902', caseId: '2024-0902', time: '5 hr ago' },
];

export default function InvestigatorDashboard() {
  return (
    <AppLayout
      title="Investigator Dashboard"
      subtitle="Your assigned cases and evidence operations"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Assigned Cases"
            value={MOCK_STATS.assignedCases}
            icon={Briefcase}
            trend="2 high priority"
            accent="accent"
          />
          <StatCard
            label="Evidence Uploaded"
            value={MOCK_STATS.evidenceUploaded}
            icon={HardDrive}
            trend="+5 this week"
            accent="success"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-accent" />
                  Assigned Cases
                </CardTitle>
                <Button variant="ghost" size="sm" disabled>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_CASES.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between rounded-sm border border-border bg-sidebar p-3 transition-colors hover:border-accent/20"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-accent">#{caseItem.id}</span>
                        <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                          caseItem.priority === 'High'
                            ? 'bg-danger/10 text-danger'
                            : 'bg-accent-secondary/10 text-accent-secondary'
                        }`}>
                          {caseItem.priority}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-foreground">{caseItem.title}</p>
                    </div>
                    <span className="shrink-0 rounded-sm bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                      {caseItem.status}
                    </span>
                  </div>
                ))}
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
              <Button variant="secondary" className="w-full justify-start gap-2" disabled>
                <FolderOpen className="h-4 w-4" />
                View Assigned Cases
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-border">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-sidebar">
                    <FileText className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{item.action}</p>
                    <p className="text-xs text-muted">
                      Case #{item.caseId} · {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 rounded-sm border border-accent-secondary/20 bg-accent-secondary/5 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-accent-secondary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Case #2024-0854 — Review pending</p>
            <p className="mt-0.5 text-xs text-muted">
              Digital asset recovery case requires evidence verification before submission.
            </p>
          </div>
          <Clock className="ml-auto h-4 w-4 shrink-0 text-muted" />
        </div>
      </div>
    </AppLayout>
  );
}
