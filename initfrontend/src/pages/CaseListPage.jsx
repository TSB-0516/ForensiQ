import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Plus,
  Eye,
  Filter,
  X,
  RefreshCw,
  FolderOpen,
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
import { getAllCases } from '@/services/caseService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn, formatDateTime } from '@/utils/helpers';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

function StatusBadge({ status }) {
  let variant = 'secondary';
  if (status === 'OPEN') variant = 'success';
  if (status === 'IN_PROGRESS') variant = 'accent';
  if (status === 'CLOSED') variant = 'default';

  return (
    <Badge variant={variant}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

export default function CaseListPage() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');

  const canCreateCase = role === 'ADMIN' || role === 'INVESTIGATOR';

  const loadCases = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setFetchError(null);

    try {
      const data = await getAllCases();
      setCases(data);
      if (isRefresh) toast.success('Cases refreshed');
    } catch (error) {
      console.error('Failed to load cases:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Could not load cases from backend';
      setFetchError(message);
      toast.error('Failed to load cases', { description: message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const handleRefresh = () => {
    loadCases(true);
  };

  const filteredCases = useMemo(() => {
    let result = [...cases];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.caseNumber.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q) ||
          (item.createdBy || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((item) => item.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [cases, searchQuery, statusFilter, sortOrder]);

  const hasActiveFilters = statusFilter !== 'ALL' || searchQuery.trim();

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSortOrder('newest');
  };

  const handleViewDetails = (id) => {
    navigate(`/cases/${id}`);
  };

  const openCount = cases.filter((c) => c.status === 'OPEN').length;
  const inProgressCount = cases.filter((c) => c.status === 'IN_PROGRESS').length;
  const closedCount = cases.filter((c) => c.status === 'CLOSED').length;

  return (
    <AppLayout
      title="Case Management"
      subtitle="Centralized registry for all active and archived investigations"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Summary strip */}
        <div className="grid gap-3 sm:grid-cols-4 animate-slide-in">
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Total Cases</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{cases.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Open</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-success">{openCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">In Progress</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">{inProgressCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Closed</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-muted">{closedCount}</p>
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
                  placeholder="Search by case number, title, status, or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Search cases"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleRefresh} title="Refresh Cases" className="px-3 shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                {canCreateCase && (
                  <Button className="shrink-0 gap-2" onClick={() => navigate('/cases/new')}>
                    <Plus className="h-4 w-4" />
                    Create Case
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Filters</span>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger aria-label="Filter by status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger aria-label="Sort by creation date">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
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
          <PageLoader message="Loading cases..." />
        ) : fetchError ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-sm border border-border bg-card text-center">
            <p className="text-sm text-danger">{fetchError}</p>
            <Button variant="secondary" onClick={() => loadCases(false)}>Retry</Button>
          </div>
        ) : filteredCases.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={hasActiveFilters ? 'No matching cases found' : 'No cases available'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new case for investigation.'
            }
            action={hasActiveFilters ? clearFilters : canCreateCase ? () => navigate('/cases/new') : undefined}
            actionLabel={hasActiveFilters ? 'Clear Filters' : canCreateCase ? 'Create Case' : undefined}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              Showing {filteredCases.length} of {cases.length} cases
            </p>

            <div className="space-y-3">
              {filteredCases.map((item, index) => (
                <Card
                  key={item.id}
                  className="group p-0 overflow-hidden transition-all duration-300 hover:border-accent/30 animate-slide-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <CardContent className="p-0">
                    {/* Desktop row layout */}
                    <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:gap-4 lg:p-4">
                      <div className="min-w-0 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sidebar border border-border">
                            <Briefcase className="h-4 w-4 text-accent" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-medium text-accent">{item.caseNumber}</span>
                              <StatusBadge status={item.status} />
                            </div>
                            <h3 className="mt-1 truncate text-sm font-medium text-foreground">{item.title}</h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs xl:grid-cols-4">
                          <div>
                            <span className="text-muted">Created Date</span>
                            <p className="mt-0.5 text-foreground">{formatDateTime(item.createdAt)}</p>
                          </div>
                          <div>
                            <span className="text-muted">Created By</span>
                            <p className="mt-0.5 text-foreground">{item.createdBy || '—'}</p>
                          </div>
                          <div>
                            <span className="text-muted">Evidence Items</span>
                            <p className="mt-0.5 text-foreground">{item.evidenceCount || 0}</p>
                          </div>
                          <div>
                            <span className="text-muted">Last Updated</span>
                            <p className="mt-0.5 text-foreground">{formatDateTime(item.updatedAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleViewDetails(item.id)}
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
                          <Briefcase className="h-4 w-4 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-xs font-medium text-accent">{item.caseNumber}</span>
                            <StatusBadge status={item.status} />
                          </div>
                          <h3 className="mt-1 text-sm font-medium text-foreground">{item.title}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted">Created Date</span>
                          <p className="mt-0.5 text-foreground">{formatDateTime(item.createdAt)}</p>
                        </div>
                        <div>
                          <span className="text-muted">Evidence</span>
                          <p className="mt-0.5 text-foreground truncate">{item.evidenceCount || 0} items</p>
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleViewDetails(item.id)}
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
