import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Briefcase, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { createCase } from '@/services/caseService';
import { useAuth } from '@/contexts/AuthContext';
import { associateTimelineWithCase } from '@/mock/timelineData';

const caseSchema = z.object({
  title: z.string().min(1, 'Case title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Case description is required').max(1000, 'Description is too long'),
});

export default function CreateCasePage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // If a user navigates here directly and is not authorized, we should ideally block them.
  // The ProtectedRoute handles the main block, but checking just in case.
  const canCreateCase = role === 'ADMIN' || role === 'INVESTIGATOR';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  if (!canCreateCase) {
    return (
      <AppLayout title="Access Denied">
        <div className="flex h-64 items-center justify-center text-muted">
          You do not have permission to create cases.
        </div>
      </AppLayout>
    );
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const result = await createCase(data);
      console.log('Case created successfully:', result);
      associateTimelineWithCase({ ...result, title: result.title || data.title });

      setShowSuccess(true);
      toast.success('Case created successfully', {
        description: `Case ${result.caseNumber} has been logged in the system.`,
        duration: 4000,
      });

      setTimeout(() => {
        navigate('/cases');
      }, 1200);
    } catch (error) {
      console.error('Case creation error:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unable to create case. Please try again.';

      toast.error('Case creation failed', {
        description: message,
      });
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Create Case"
      subtitle="Initialize a new investigation record"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <Breadcrumb
          items={[
            { label: 'Case Management', href: '/cases' },
            { label: 'Create Case' },
          ]}
        />

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted hover:text-foreground -mt-2"
          onClick={() => navigate('/cases')}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Cases
        </Button>

        {showSuccess && (
          <div className="flex items-center gap-3 rounded-sm border border-success/30 bg-success/10 p-4 animate-success-pulse" role="status">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-success">Case created successfully</p>
              <p className="text-xs text-muted mt-0.5">Redirecting to Case Management...</p>
            </div>
          </div>
        )}

        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-accent" aria-hidden="true" />
              Case Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              
              <div className="space-y-2">
                <Label htmlFor="title">Case Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Online Financial Fraud Investigation" 
                  {...register('title')} 
                  aria-invalid={!!errors.title} 
                />
                {errors.title && <p className="text-xs text-danger" role="alert">{errors.title.message}</p>}
                <p className="text-[10px] text-muted">A clear, concise name for this investigation.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the suspected incident, context, and scope..."
                  rows={4}
                  {...register('description')}
                  aria-invalid={!!errors.description}
                />
                {errors.description && <p className="text-xs text-danger" role="alert">{errors.description.message}</p>}
                <p className="text-[10px] text-muted">Provide enough context for investigators and analysts.</p>
              </div>

              <div className="rounded-sm border border-border bg-sidebar p-3 mb-5">
                <p className="text-[10px] uppercase tracking-wider text-muted mb-1">System Generated Fields</p>
                <p className="text-xs text-muted">
                  Case Number, Status, and Creator fields will be automatically generated and assigned by the system upon creation.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => navigate('/cases')} 
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating Case...' : 'Create Case'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
