import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Archive,
  Search,
  Upload,
  Eye,
  Image,
  Video,
  Music,
  FileText,
  MapPin,
  File,
  Filter,
  X,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoader } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllEvidence, INTEGRITY_STATUS } from '@/services/evidenceService';
import { toast } from 'sonner';
import { EVIDENCE_TYPES, SORT_OPTIONS } from '@/utils/constants';
import { cn, formatDateTime } from '@/utils/helpers';

const TYPE_ICONS = {
  IMAGE: Image,
  VIDEO: Video,
  AUDIO: Music,
  DOCUMENT: FileText,
  ARCHIVE: Archive,
  GPS: MapPin,
  OTHER: File,
};

function EvidenceTypeIcon({ type, className }) {
  const Icon = TYPE_ICONS[type] ?? File;
  return <Icon className={className} aria-hidden="true" />;
}

function IntegrityBadge({ status }) {
  const isVerified = status === INTEGRITY_STATUS.VERIFIED;
  return (
    <Badge variant={isVerified ? 'success' : 'secondary'}>
      {status}
    </Badge>
  );
}

export default function EvidenceVaultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [integrityFilter, setIntegrityFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');
  const [highlightId, setHighlightId] = useState(location.state?.highlightId ?? null);

  const loadEvidence = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getAllEvidence();

      const mappedData = data.map((item) => ({
        ...item,

        id: String(item.id),

        title:
          item.title ||
          item.originalFilename ||
          'Unregistered Evidence',

        uploadDate: item.uploadTimestamp,

        integrityStatus: item.registered
          ? INTEGRITY_STATUS.VERIFIED
          : INTEGRITY_STATUS.PENDING,

        tags: item.investigationTags
          ? item.investigationTags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      }));

      setEvidence(mappedData);

    } catch (error) {

      console.error('Failed to load evidence:', error);

      toast.error('Failed to load evidence', {
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Could not load evidence from backend',
      });

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvidence();
  }, [loadEvidence]);

  useEffect(() => {
    if (highlightId) {
      const timer = setTimeout(() => setHighlightId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  const filteredEvidence = useMemo(() => {
    let result = [...evidence];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.originalFilename.toLowerCase().includes(q) ||
          item.uploadedBy.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== 'ALL') {
      result = result.filter((item) => item.evidenceType === typeFilter);
    }

    if (integrityFilter !== 'ALL') {
      result = result.filter((item) => item.integrityStatus === integrityFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.uploadDate);
      const dateB = new Date(b.uploadDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [evidence, searchQuery, typeFilter, integrityFilter, sortOrder]);

  const hasActiveFilters = typeFilter !== 'ALL' || integrityFilter !== 'ALL' || searchQuery.trim();

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setIntegrityFilter('ALL');
    setSortOrder('newest');
  };

  const handleViewDetails = (item) => {
    navigate('/evidence/register', {
      state: { mode: 'view', evidence: item },
    });
  };

  const verifiedCount = evidence.filter((e) => e.integrityStatus === INTEGRITY_STATUS.VERIFIED).length;
  const pendingCount = evidence.filter((e) => e.integrityStatus === INTEGRITY_STATUS.PENDING).length;

  return (
    <AppLayout
      title="Evidence Vault"
      subtitle="Central repository for all uploaded digital evidence — Coimbatore City Police"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Summary strip */}
        <div className="grid gap-3 sm:grid-cols-3 animate-slide-in">
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Total Evidence</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{evidence.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Verified</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-success">{verifiedCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Pending Verification</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-accent-secondary">{pendingCount}</p>
          </Card>
        </div>

        {/* Toolbar */}
        <Card className="animate-slide-in p-4" style={{ animationDelay: '50ms' }}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search by ID, title, filename, uploader, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Search evidence"
                />
              </div>
              <Button className="shrink-0 gap-2" onClick={() => navigate('/evidence/upload')}>
                <Upload className="h-4 w-4" />
                Upload Evidence
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Filters</span>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger aria-label="Filter by evidence type">
                    <SelectValue placeholder="Evidence Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {EVIDENCE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={integrityFilter} onValueChange={setIntegrityFilter}>
                  <SelectTrigger aria-label="Filter by integrity status">
                    <SelectValue placeholder="Integrity Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger aria-label="Sort by upload date">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 shrink-0">
                  <X className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <PageLoader message="Loading evidence repository..." />
        ) : filteredEvidence.length === 0 ? (
          <EmptyState
            icon={Archive}
            title={hasActiveFilters ? 'No matching evidence found' : 'Evidence vault is empty'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filter criteria to find evidence items.'
                : 'Upload your first evidence file to begin building the investigation repository.'
            }
            action={hasActiveFilters ? clearFilters : () => navigate('/evidence/upload')}
            actionLabel={hasActiveFilters ? 'Clear Filters' : 'Upload Evidence'}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              Showing {filteredEvidence.length} of {evidence.length} evidence items
            </p>

            <div className="space-y-3">
              {filteredEvidence.map((item, index) => (
                <Card
                  key={item.id}
                  className={cn(
                    'group p-0 overflow-hidden transition-all duration-300 hover:border-accent/30 animate-slide-in',
                    highlightId === item.id && 'border-success/50 ring-1 ring-success/30 animate-success-pulse'
                  )}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <CardContent className="p-0">
                    {/* Desktop row layout */}
                    <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:gap-4 lg:p-4">
                      <div className="min-w-0 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sidebar border border-border">
                            <EvidenceTypeIcon type={item.evidenceType} className="h-4 w-4 text-accent" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-medium text-accent">{item.id}</span>
                              <Badge variant="outline">{item.evidenceType}</Badge>
                              <IntegrityBadge status={item.integrityStatus} />
                            </div>
                            <h3 className="mt-1 truncate text-sm font-medium text-foreground">{item.title}</h3>
                            <p className="mt-0.5 truncate text-xs text-muted font-mono">{item.originalFilename}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs xl:grid-cols-4">
                          <div>
                            <span className="text-muted">Upload Date</span>
                            <p className="mt-0.5 text-foreground">{formatDateTime(item.uploadDate)}</p>
                          </div>
                          <div>
                            <span className="text-muted">Uploaded By</span>
                            <p className="mt-0.5 text-foreground">{item.uploadedBy}</p>
                          </div>
                          <div className="col-span-2 xl:col-span-2">
                            <span className="text-muted">Tags</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.tags.length > 0 ? (
                                item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-sm bg-sidebar px-1.5 py-0.5 text-[10px] text-muted"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleViewDetails(item)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Mobile card layout */}
                    <div className="lg:hidden p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-sidebar border border-border">
                          <EvidenceTypeIcon type={item.evidenceType} className="h-4 w-4 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-xs font-medium text-accent">{item.id}</span>
                            <IntegrityBadge status={item.integrityStatus} />
                          </div>
                          <h3 className="mt-1 text-sm font-medium text-foreground">{item.title}</h3>
                          <p className="mt-0.5 truncate text-xs text-muted font-mono">{item.originalFilename}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted">Type</span>
                          <p className="mt-0.5 text-foreground">{item.evidenceType}</p>
                        </div>
                        <div>
                          <span className="text-muted">Uploaded By</span>
                          <p className="mt-0.5 text-foreground truncate">{item.uploadedBy}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted">Upload Date</span>
                          <p className="mt-0.5 text-foreground">{formatDateTime(item.uploadDate)}</p>
                        </div>
                      </div>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm bg-sidebar px-1.5 py-0.5 text-[10px] text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleViewDetails(item)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
