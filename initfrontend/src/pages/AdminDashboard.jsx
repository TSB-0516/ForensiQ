import { Link } from 'react-router-dom';
import {
  Users,
  UserSearch,
  HardDrive,
  Activity,
  UserPlus,
  Settings,
  Upload,
  Clock,
  FileText,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MOCK_STATS = {
  totalUsers: 48,
  investigators: 32,
  evidenceUploaded: 1247,
};

const MOCK_ACTIVITY = [
  { id: 1, action: 'New investigator registered', user: 'Sarah Chen', time: '12 min ago', type: 'user' },
  { id: 2, action: 'Evidence uploaded — Case #2024-0891', user: 'Mark Rivera', time: '34 min ago', type: 'evidence' },
  { id: 3, action: 'User role updated to Investigator', user: 'Admin', time: '1 hr ago', type: 'user' },
  { id: 4, action: 'Evidence chain verified — Case #2024-0876', user: 'System', time: '2 hr ago', type: 'evidence' },
  { id: 5, action: 'New case assigned — #2024-0902', user: 'Admin', time: '3 hr ago', type: 'case' },
];

export default function AdminDashboard() {
  return (
    <AppLayout
      title="Administrator Dashboard"
      subtitle="System overview and operational controls"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total Users"
            value={MOCK_STATS.totalUsers}
            icon={Users}
            trend="+3 this week"
            accent="accent"
          />
          <StatCard
            label="Investigators"
            value={MOCK_STATS.investigators}
            icon={UserSearch}
            trend="Active operators"
            accent="secondary"
          />
          <StatCard
            label="Evidence Uploaded"
            value={MOCK_STATS.evidenceUploaded.toLocaleString()}
            icon={HardDrive}
            trend="+87 this month"
            accent="success"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" />
                  Recent Activity
                </CardTitle>
                <span className="text-[10px] uppercase tracking-wider text-muted">Live feed</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y divide-border">
                {MOCK_ACTIVITY.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-sidebar">
                      {item.type === 'evidence' ? (
                        <FileText className="h-3.5 w-3.5 text-accent" />
                      ) : item.type === 'user' ? (
                        <Users className="h-3.5 w-3.5 text-accent-secondary" />
                      ) : (
                        <Activity className="h-3.5 w-3.5 text-success" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted">
                        {item.user} · {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-accent-secondary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                <Link to="/register">
                  <UserPlus className="h-4 w-4" />
                  Register New User
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2" disabled>
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                <Link to="/evidence/upload">
                  <Upload className="h-4 w-4" />
                  Upload Evidence
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Authentication Service', status: 'Operational', ok: true },
                { label: 'Evidence Vault', status: 'Operational', ok: true },
                { label: 'Chain of Custody', status: 'Operational', ok: true },
                { label: 'Audit Logging', status: 'Operational', ok: true },
              ].map((item) => (
                <div key={item.label} className="rounded-sm border border-border bg-sidebar p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted">{item.label}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.ok ? 'bg-success' : 'bg-danger'}`} />
                    <span className="text-xs font-medium text-foreground">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
