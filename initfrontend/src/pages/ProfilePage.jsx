import { Shield, Mail, UserCircle, Key } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/helpers';

export default function ProfilePage() {
  const { email, role } = useAuth();
  const roleLabel = isAdminRole(role) ? 'Administrator' : 'Investigator';

  return (
    <AppLayout
      title="Operator Profile"
      subtitle="Account information and access credentials"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-accent" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-sm border border-border bg-sidebar p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-accent/10">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{email}</p>
                <span className="mt-1 inline-block rounded-sm bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-sm border border-border p-3">
                <Mail className="h-4 w-4 text-muted" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Email</p>
                  <p className="text-sm text-foreground">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-sm border border-border p-3">
                <Shield className="h-4 w-4 text-muted" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Role</p>
                  <p className="text-sm text-foreground">{roleLabel} ({role})</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-sm border border-border p-3">
                <Key className="h-4 w-4 text-muted" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Authentication</p>
                  <p className="text-sm text-foreground">JWT — Session active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
