import {
  BriefcaseBusiness,
  CarFront,
  ClipboardList,
  FileSearch,
  FileText,
  GitBranch,
  Lightbulb,
  MapPin,
  MessageSquareQuote,
  ScanSearch,
  ShieldCheck,
  UserRoundSearch,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTimelineEvents } from '@/mock/timelineData';

const EVENT_STYLES = {
  'CASE REPORTED': { icon: BriefcaseBusiness, color: 'text-accent', background: 'bg-accent/10', badge: 'default' },
  OBSERVATION: { icon: ScanSearch, color: 'text-accent-secondary', background: 'bg-accent-secondary/10', badge: 'secondary' },
  EVIDENCE: { icon: FileSearch, color: 'text-success', background: 'bg-success/10', badge: 'success' },
  'INVESTIGATIVE ACTION': { icon: ClipboardList, color: 'text-accent', background: 'bg-accent/10', badge: 'default' },
  INFERENCE: { icon: Lightbulb, color: 'text-accent-secondary', background: 'bg-accent-secondary/10', badge: 'outline' },
  'WITNESS INTERVIEW': { icon: MessageSquareQuote, color: 'text-accent-secondary', background: 'bg-accent-secondary/10', badge: 'secondary' },
  'INVESTIGATIVE FINDING': { icon: UserRoundSearch, color: 'text-accent', background: 'bg-accent/10', badge: 'default' },
  'EVIDENCE VERIFICATION': { icon: ShieldCheck, color: 'text-success', background: 'bg-success/10', badge: 'success' },
  'NEW LEAD': { icon: CarFront, color: 'text-accent-secondary', background: 'bg-accent-secondary/10', badge: 'outline' },
  CORROBORATION: { icon: GitBranch, color: 'text-success', background: 'bg-success/10', badge: 'success' },
  DECISION: { icon: ShieldCheck, color: 'text-success', background: 'bg-success/10', badge: 'success' },
};

function RelationshipBlock({ label, children, tone = 'default' }) {
  const toneClass = tone === 'success'
    ? 'border-success/25 bg-success/5'
    : tone === 'accent'
      ? 'border-accent/25 bg-accent/5'
      : 'border-border bg-sidebar/70';

  return (
    <div className={`rounded-sm border p-3 ${toneClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <div className="mt-1 text-xs leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

function EventDetails({ event }) {
  const relationships = [
    ['INVESTIGATIVE INFERENCE', event.inference, 'accent'],
    ['TRIGGERED BY', event.triggeredBy],
    ['WITNESS STATEMENT', event.witnessStatement],
    ['CLAIMED LOCATION', event.claimedLocation],
    ['LEAD', event.lead, 'accent'],
    ['INVESTIGATIVE IMPLICATION', event.implication],
    ['FINDING', event.finding, 'success'],
    ['PREVIOUS INFERENCE', event.previousInference],
    ['DECISION', event.decision, 'success'],
    ['NEXT ACTION', event.nextAction, 'accent'],
    ['RESULT', event.result, 'success'],
  ].filter(([, value]) => value);

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-foreground/90">{event.description}</p>

      {event.resultBadge && (
        <Badge variant="success" className="px-2.5 py-1 text-xs">{event.resultBadge}</Badge>
      )}

      {relationships.map(([label, value, tone]) => (
        <RelationshipBlock key={label} label={label} tone={tone}>
          {value}
        </RelationshipBlock>
      ))}

      {event.relationship && (
        <RelationshipBlock label="EVIDENCE RELATIONSHIP" tone="success">
          <div className="flex flex-wrap items-center gap-2">
            <span>{event.relationship[0]}</span>
            <span className="text-success" aria-hidden="true">+</span>
            <span>{event.relationship[1]}</span>
            <span className="text-success" aria-hidden="true">→</span>
            <strong>{event.relationship[2]}</strong>
          </div>
        </RelationshipBlock>
      )}

      {event.evidence && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Evidence</span>
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-success/20 bg-success/5 px-2.5 py-1.5 text-xs text-success">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {event.evidence}
          </span>
        </div>
      )}

      {(event.actor || event.location) && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-3 text-xs text-muted">
          {event.actor && <span>Recorded by <strong className="font-medium text-foreground">{event.actor}</strong></span>}
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {event.location}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function formatDateHeading(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).toUpperCase();
}

export default function TimelineSection({ caseId, caseTitle }) {
  const events = getTimelineEvents(caseId, caseTitle);

  if (!events || events.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-border bg-sidebar/50 px-6 py-12 text-center">
        <GitBranch className="mx-auto h-6 w-6 text-muted" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-foreground">No investigation timeline available for this case yet.</p>
      </div>
    );
  }

  const eventsByDate = events.reduce((groups, event) => {
    (groups[event.date] ||= []).push(event);
    return groups;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(eventsByDate).map(([date, dateEvents]) => (
        <section key={date} aria-label={formatDateHeading(date)}>
          <div className="mb-5 flex items-center gap-4">
            <h3 className="shrink-0 font-mono text-xs font-semibold tracking-wider text-accent-secondary">
              {formatDateHeading(date)}
            </h3>
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted">{dateEvents.length} EVENTS</span>
          </div>

          <ol className="space-y-4">
            {dateEvents.map((event, index) => {
              const style = EVENT_STYLES[event.type] || EVENT_STYLES['INVESTIGATIVE ACTION'];
              const Icon = style.icon;

              return (
                <li key={event.id} className="grid grid-cols-[5.25rem_2.5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[6rem_3rem_minmax(0,1fr)] sm:gap-3">
                  <div className="pt-3 text-right">
                    <time className="font-mono text-xs font-medium tabular-nums text-muted">{event.timestamp}</time>
                  </div>

                  <div className="relative flex justify-center">
                    {index < dateEvents.length - 1 && (
                      <span className="absolute bottom-[-1rem] top-10 w-px bg-border" aria-hidden="true" />
                    )}
                    <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-sm border border-border ${style.background}`}>
                      <Icon className={`h-4 w-4 ${style.color}`} aria-hidden="true" />
                    </span>
                  </div>

                  <Card className="min-w-0 animate-fade-in p-0">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h4 className="min-w-0 text-sm font-semibold leading-snug text-foreground sm:text-base">{event.title}</h4>
                        <Badge variant={style.badge}>{event.type}</Badge>
                      </div>
                      <EventDetails event={event} />
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
