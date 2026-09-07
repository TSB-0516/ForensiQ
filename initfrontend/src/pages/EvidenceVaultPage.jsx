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
  Trash2,
  Loader2,
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
import {
  getAllEvidence,
  getMyEvidence,
  deleteEvidence,
} from '@/services/evidenceService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { EVIDENCE_TYPES, SORT_OPTIONS } from '@/utils/constants';
import { cn, formatDateTime, formatFileSize } from '@/utils/helpers';

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

function RegistrationBadge({ registered }) {
  return (
    <Badge variant={registered ? 'success' : 'secondary'}>
      {registered ? 'Registered' : 'Unregistered'}
    </Badge>
  );
}

export default function EvidenceVaultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, email } = useAuth();

  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [registrationFilter, setRegistrationFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');
  const [highlightId, setHighlightId] = useState(location.state?.highlightId ?? null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadEvidence = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      // Investigators fetch only their own evidence.
      // All other authenticated roles fetch the full evidence list.
      const data = role === 'INVESTIGATOR' ? await getMyEvidence() : await getAllEvidence();

      const mappedData = data.map((item) => ({
        ...item,
        id: String(item.id),
        // Display title; fall back to original filename for unregistered evidence.
        title: item.title || item.originalFilename || 'Untitled Evidence',
        // Normalise the upload timestamp key for sorting.
        uploadDate: item.uploadTimestamp,
        // Parse investigationTags from the backend field.
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
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Could not load evidence from backend';
      setFetchError(message);
      toast.error('Failed to load evidence', { description: message });
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    loadEvidence();
  }, [loadEvidence]);

  useEffect(() => {
    if (highlightId) {
      const timer = setTimeout(() => setHighlightId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  // -----------------------------------------------------------------------
  // Delete logic
  // -----------------------------------------------------------------------

  /**
   * Whether the current user may delete a specific evidence item.
   * This is a UX gate only — backend authorization is authoritative.
   */
  function canDelete(item) {
    if (role === 'ADMIN') return true;
    if (role === 'INVESTIGATOR' && item.registered === false) return true;
    return false;
  }

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteId(null);
  };

  const handleDeleteConfirm = async (id) => {
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      await deleteEvidence(id);
      setEvidence((prev) => prev.filter((e) => e.id !== id));
      toast.success('Evidence deleted', {
        description: `Evidence #${id} has been removed from the vault.`,
      });
    } catch (error) {
      const status = error.response?.status;
      let message;
      if (status === 403) {
        message = 'You do not have permission to delete this evidence.';
      } else if (status === 404) {
        message = 'Evidence not found. It may have already been deleted.';
      } else {
        message =
          error.response?.data?.message ||
          error.message ||
          'Could not delete evidence. Please try again.';
      }
      toast.error('Deletion failed', { description: message });
    } finally {
      setDeletingId(null);
    }
  };

  // -----------------------------------------------------------------------
  // Filtering / sorting (client-side over fetched list)
  // -----------------------------------------------------------------------

  const filteredEvidence = useMemo(() => {
    let result = [...evidence];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          (item.originalFilename || '').toLowerCase().includes(q) ||
          (item.uploadedBy || '').toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== 'ALL') {
      result = result.filter((item) => item.evidenceType === typeFilter);
    }

    if (registrationFilter !== 'ALL') {
      const wantRegistered = registrationFilter === 'REGISTERED';
      result = result.filter((item) => item.registered === wantRegistered);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.uploadDate);
      const dateB = new Date(b.uploadDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [evidence, searchQuery, typeFilter, registrationFilter, sortOrder]);

  const hasActiveFilters =
    typeFilter !== 'ALL' || registrationFilter !== 'ALL' || searchQuery.trim();

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setRegistrationFilter('ALL');
    setSortOrder('newest');
  };

  const handleViewDetails = (item) => {
    navigate('/evidence/register', {
      state: { mode: 'view', evidence: item },
    });
  };

  const registeredCount = evidence.filter((e) => e.registered === true).length;
  const unregisteredCount = evidence.filter((e) => e.registered === false).length;

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------

  function ActionButtons({ item, fullWidth = false }) {
    const isDeleting = deletingId === item.id;
    const isConfirming = confirmDeleteId === item.id;
    const showDelete = canDelete(item);

    return (
      <div className={cn('flex gap-2', fullWidth && 'w-full flex-col')}>
        <Button
          variant="secondary"
          size="sm"
          className={cn('gap-2', fullWidth && 'w-full')}
          onClick={() => handleViewDetails(item)}
          disabled={isDeleting}
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </Button>

        {showDelete && !isConfirming && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2 text-danger hover:bg-danger/10 hover:text-danger',
              fullWidth && 'w-full'
            )}
            onClick={() => handleDeleteClick(item.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        )}

        {showDelete && isConfirming && (
          <div className={cn('flex gap-1', fullWidth && 'w-full')}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-danger hover:bg-danger/10 hover:text-danger"
              onClick={() => handleDeleteConfirm(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Confirm
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------

  return (
    <AppLayout
      title="Evidence Vault"
      subtitle="Central repository for all uploaded digital evidence"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Summary strip */}
        <div className="grid gap-3 sm:grid-cols-3 animate-slide-in">
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Total Evidence</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{evidence.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Registered</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-success">{registeredCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Unregistered</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-accent-secondary">{unregisteredCount}</p>
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

                <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
                  <SelectTrigger aria-label="Filter by registration status">
                    <SelectValue placeholder="Registration Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="REGISTERED">Registered</SelectItem>
                    <SelectItem value="UNREGISTERED">Unregistered</SelectItem>
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
        ) : fetchError ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-sm border border-border bg-card text-center">
            <p className="text-sm text-danger">{fetchError}</p>
            <Button variant="secondary" onClick={loadEvidence}>Retry</Button>
          </div>
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
                              <span className="font-mono text-xs font-medium text-accent">#{item.id}</span>
                              <Badge variant="outline">{item.evidenceType || '—'}</Badge>
                              <RegistrationBadge registered={item.registered} />
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
                            <p className="mt-0.5 text-foreground">{item.uploadedBy || '—'}</p>
                          </div>
                          <div>
                            <span className="text-muted">File Size</span>
                            <p className="mt-0.5 text-foreground">{item.fileSizeBytes ? formatFileSize(item.fileSizeBytes) : '—'}</p>
                          </div>
                          <div>
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
                        <ActionButtons item={item} />
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
                            <span className="font-mono text-xs font-medium text-accent">#{item.id}</span>
                            <RegistrationBadge registered={item.registered} />
                          </div>
                          <h3 className="mt-1 text-sm font-medium text-foreground">{item.title}</h3>
                          <p className="mt-0.5 truncate text-xs text-muted font-mono">{item.originalFilename}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted">Type</span>
                          <p className="mt-0.5 text-foreground">{item.evidenceType || '—'}</p>
                        </div>
                        <div>
                          <span className="text-muted">Uploaded By</span>
                          <p className="mt-0.5 text-foreground truncate">{item.uploadedBy || '—'}</p>
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

                      <ActionButtons item={item} fullWidth />
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
