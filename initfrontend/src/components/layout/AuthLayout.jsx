import { Shield, Fingerprint } from 'lucide-react';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between border-r border-border bg-sidebar p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">UEIIP</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">
              Unified Evidence & Investigation Intelligence Platform
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground leading-tight">
              Secure Digital Evidence<br />Management System
            </h2>
            <p className="text-sm text-muted max-w-sm">
              Professional investigation workstation for evidence collection,
              chain of custody, and decision support operations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Evidence Vault', value: 'Encrypted' },
              { label: 'Chain of Custody', value: 'Verified' },
              { label: 'Access Control', value: 'Role-Based' },
              { label: 'Audit Trail', value: 'Complete' },
            ].map((item) => (
              <div key={item.label} className="rounded-sm border border-border bg-card p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-accent">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <Fingerprint className="h-3.5 w-3.5" />
          <span>Authorized personnel only — All access is logged</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-10">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Shield className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold">UEIIP</span>
        </div>

        <div className="w-full max-w-md animate-slide-in">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
