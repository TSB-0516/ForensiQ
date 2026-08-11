import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useForm, Controller } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import { toast } from 'sonner';

import {

  File,

  Loader2,

  ArrowLeft,

  Hash,

  Calendar,

  MapPin,

  CheckCircle2,

  Shield,

  User,

  Tag,

} from 'lucide-react';

import { AppLayout } from '@/components/layout/AppLayout';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

import { Badge } from '@/components/ui/badge';

import { Breadcrumb } from '@/components/ui/breadcrumb';

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from '@/components/ui/select';

import {
  uploadEvidence,
  registerEvidence,
  INTEGRITY_STATUS,
} from '@/services/evidenceService';

import { EVIDENCE_TYPES } from '@/utils/constants';

import { formatFileSize, getFileExtension, getEvidenceTypeFromExtension, formatDateTime, cn } from '@/utils/helpers';

import { useAuth } from '@/contexts/AuthContext';



const evidenceSchema = z.object({

  title: z.string().min(1, 'Evidence title is required'),

  description: z.string().optional(),

  collectionDate: z.string().min(1, 'Collection date is required'),

  collectionTime: z.string().min(1, 'Collection time is required'),

  collectedBy: z.string().min(1, 'Collected by is required'),

  location: z.string().min(1, 'Location is required'),

  evidenceType: z.string().min(1, 'Evidence type is required'),

  tags: z.string().optional(),

  relatedSuspect: z.string().optional(),

  relatedWitness: z.string().optional(),

  remarks: z.string().optional(),

});



function DetailField({ label, value, icon: Icon, mono }) {

  return (

    <div className="rounded-sm border border-border bg-sidebar p-3">

      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">

        {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}

        {label}

      </p>

      <p className={cn('mt-1.5 text-sm text-foreground break-words', mono && 'font-mono text-xs')}>

        {value || '—'}

      </p>

    </div>

  );

}



export default function EvidenceRegistrationPage() {

  const location = useLocation();

  const navigate = useNavigate();

  const { email } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);



  const isViewMode = location.state?.mode === 'view';

  const evidence = location.state?.evidence;

  const fileInfo = location.state?.file;

  const fileObject = location.state?.fileObject;



  useEffect(() => {

    if (isViewMode && !evidence) {

      navigate('/evidence/vault', { replace: true });

    } else if (!isViewMode && !fileInfo) {

      navigate('/evidence/vault', { replace: true });

    }

  }, [isViewMode, evidence, fileInfo, navigate]);



  const detectedType = fileInfo ? getEvidenceTypeFromExtension(fileInfo.name) : 'OTHER';



  const {

    register,

    handleSubmit,

    control,

    formState: { errors },

  } = useForm({

    resolver: zodResolver(evidenceSchema),

    defaultValues: {

      title: fileInfo?.name?.replace(/\.[^/.]+$/, '') ?? '',

      description: '',

      collectionDate: new Date().toISOString().split('T')[0],

      collectionTime: new Date().toTimeString().slice(0, 5),

      collectedBy: '',

      location: '',

      evidenceType: detectedType,

      tags: '',

      relatedSuspect: '',

      relatedWitness: '',

      remarks: '',

    },

  });



  if ((isViewMode && !evidence) || (!isViewMode && !fileInfo)) return null;



const onSubmit = async (data) => {
  setSubmitting(true);

  try {
    // ---------------------------------------
    // STEP 1: Upload actual file
    // ---------------------------------------
    const uploadResult = await uploadEvidence(fileObject);

    console.log('Upload response:', uploadResult);

    // Backend returns:
    // {
    //   evidenceId,
    //   originalFilename,
    //   sha256Hash,
    //   fileSizeBytes,
    //   uploadTimestamp,
    //   suggestedEvidenceType
    // }

    const evidenceId = uploadResult.evidenceId;

    if (!evidenceId) {
      throw new Error('Backend did not return an evidence ID');
    }

    // ---------------------------------------
    // STEP 2: Register metadata
    // ---------------------------------------
    const result = await registerEvidence(evidenceId, data);

    console.log('Registration response:', result);

    setShowSuccess(true);

    toast.success('Evidence registered successfully', {
      description: `Evidence #${result.id} has been logged in the vault.`,
      duration: 4000,
    });

    setTimeout(() => {
      navigate('/evidence/vault', {
        state: {
          highlightId: result.id,
        },
      });
    }, 1200);

  } catch (error) {
    console.error('Evidence registration error:', error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Unable to register evidence. Please try again.';

    toast.error('Registration failed', {
      description: message,
    });

    setSubmitting(false);
  }
};



  if (isViewMode && evidence) {

    return (

      <AppLayout

        title="Evidence Details"

        subtitle={`${evidence.id} — ${evidence.department}`}

      >

        <div className="mx-auto max-w-4xl space-y-6">

          <Breadcrumb

            items={[

              { label: 'Evidence Vault', href: '/evidence/vault' },

              { label: evidence.id },

            ]}

          />



          <Button

            variant="ghost"

            size="sm"

            className="gap-2 text-muted hover:text-foreground -mt-2"

            onClick={() => navigate('/evidence/vault')}

          >

            <ArrowLeft className="h-4 w-4" aria-hidden="true" />

            Back to Vault

          </Button>



          <Card className="animate-slide-in">

            <CardHeader>

              <div className="flex flex-wrap items-start justify-between gap-3">

                <div>

                  <CardTitle className="flex items-center gap-2 text-base">

                    <File className="h-4 w-4 text-accent" aria-hidden="true" />

                    {evidence.title}

                  </CardTitle>

                  <p className="mt-1 font-mono text-xs text-muted">{evidence.originalFilename}</p>

                </div>

                <div className="flex flex-wrap gap-2">

                  <Badge variant="outline">{evidence.evidenceType}</Badge>

                  <Badge variant={evidence.integrityStatus === INTEGRITY_STATUS.VERIFIED ? 'success' : 'secondary'}>

                    {evidence.integrityStatus}

                  </Badge>

                </div>

              </div>

            </CardHeader>

            <CardContent className="space-y-5">

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <DetailField label="Evidence ID" value={evidence.id} icon={Hash} mono />

                <DetailField label="File Size" value={formatFileSize(evidence.fileSize)} icon={File} />

                <DetailField label="File Type" value={evidence.fileType} icon={File} />

                <DetailField label="Upload Date" value={formatDateTime(evidence.uploadDate)} icon={Calendar} />

                <DetailField label="Uploaded By" value={evidence.uploadedBy} icon={User} />

                <DetailField label="Department" value={evidence.department} icon={Shield} />

              </div>



              {evidence.sha256Hash && (

                <div className="rounded-sm border border-success/20 bg-success/5 p-3">

                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-success">

                    <Hash className="h-3 w-3" aria-hidden="true" />

                    SHA-256 Integrity Hash

                  </p>

                  <p className="mt-1.5 break-all font-mono text-xs text-foreground">{evidence.sha256Hash}</p>

                </div>

              )}



              {evidence.description && (

                <DetailField label="Description" value={evidence.description} />

              )}



              <div className="grid gap-3 sm:grid-cols-2">

                <DetailField label="Collection Date" value={evidence.collectionDate} icon={Calendar} />

                <DetailField label="Collection Time" value={evidence.collectionTime} />

                <DetailField label="Collected By" value={evidence.collectedBy} icon={User} />

                <DetailField label="Location" value={evidence.location} icon={MapPin} />

              </div>



              <div className="grid gap-3 sm:grid-cols-2">

                <DetailField label="Related Suspect" value={evidence.relatedSuspect} />

                <DetailField label="Related Witness" value={evidence.relatedWitness} />

              </div>



              {evidence.tags?.length > 0 && (

                <div>

                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted mb-2">

                    <Tag className="h-3 w-3" aria-hidden="true" />

                    Tags

                  </p>

                  <div className="flex flex-wrap gap-1.5">

                    {evidence.tags.map((tag) => (

                      <span key={tag} className="rounded-sm bg-sidebar px-2 py-0.5 text-xs text-muted border border-border">

                        {tag}

                      </span>

                    ))}

                  </div>

                </div>

              )}



              {evidence.remarks && (

                <DetailField label="Remarks" value={evidence.remarks} />

              )}

            </CardContent>

          </Card>

        </div>

      </AppLayout>

    );

  }



  return (

    <AppLayout

      title="Evidence Registration"

      subtitle="Complete metadata for chain of custody logging"

    >

      <div className="mx-auto max-w-3xl space-y-6">

        <Breadcrumb

          items={[

            { label: 'Evidence Vault', href: '/evidence/vault' },

            { label: 'Upload', href: '/evidence/upload' },

            { label: 'Registration' },

          ]}

        />



        <Button

          variant="ghost"

          size="sm"

          className="gap-2 text-muted hover:text-foreground -mt-2"

          onClick={() => navigate('/evidence/upload')}

        >

          <ArrowLeft className="h-4 w-4" aria-hidden="true" />

          Back to Upload

        </Button>



        {showSuccess && (

          <div className="flex items-center gap-3 rounded-sm border border-success/30 bg-success/10 p-4 animate-success-pulse" role="status">

            <CheckCircle2 className="h-5 w-5 text-success shrink-0" aria-hidden="true" />

            <div>

              <p className="text-sm font-medium text-success">Evidence saved successfully</p>

              <p className="text-xs text-muted mt-0.5">Redirecting to Evidence Vault...</p>

            </div>

          </div>

        )}



        <Card className="animate-slide-in">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <File className="h-4 w-4 text-accent" aria-hidden="true" />

              File Information

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid gap-3 sm:grid-cols-3">

              <div className="rounded-sm border border-border bg-sidebar p-3">

                <p className="text-[10px] uppercase tracking-wider text-muted">Original Filename</p>

                <p className="mt-1.5 truncate text-sm font-medium text-foreground font-mono">{fileInfo.name}</p>

              </div>

              <div className="rounded-sm border border-border bg-sidebar p-3">

                <p className="text-[10px] uppercase tracking-wider text-muted">File Size</p>

                <p className="mt-1.5 text-sm font-medium text-foreground">{formatFileSize(fileInfo.size)}</p>

              </div>

              <div className="rounded-sm border border-border bg-sidebar p-3 sm:col-span-1 col-span-full sm:col-auto">

                <p className="text-[10px] uppercase tracking-wider text-muted">File Type</p>

                <p className="mt-1.5 text-sm font-medium text-foreground">

                  {fileInfo.type || getFileExtension(fileInfo.name)}

                </p>

              </div>

            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted">

              <Hash className="h-3 w-3" aria-hidden="true" />

              Evidence ID and SHA-256 hash will be generated upon save · Operator: {email}

            </p>

          </CardContent>

        </Card>



        <Card className="animate-slide-in" style={{ animationDelay: '75ms' }}>

          <CardHeader>

            <CardTitle>Evidence Metadata</CardTitle>

          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

              <div className="space-y-2">

                <Label htmlFor="title">Evidence Title</Label>

                <Input id="title" placeholder="e.g. CCTV Footage — RS Puram Junction" {...register('title')} aria-invalid={!!errors.title} />

                {errors.title && <p className="text-xs text-danger" role="alert">{errors.title.message}</p>}

              </div>



              <div className="space-y-2">

                <Label htmlFor="description">Description</Label>

                <Textarea

                  id="description"

                  placeholder="Detailed description of the evidence and its relevance to the investigation..."

                  rows={3}

                  {...register('description')}

                />

              </div>



              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">

                  <Label htmlFor="collectionDate" className="flex items-center gap-1.5">

                    <Calendar className="h-3 w-3" aria-hidden="true" />

                    Collection Date

                  </Label>

                  <Input id="collectionDate" type="date" {...register('collectionDate')} aria-invalid={!!errors.collectionDate} />

                  {errors.collectionDate && (

                    <p className="text-xs text-danger" role="alert">{errors.collectionDate.message}</p>

                  )}

                </div>

                <div className="space-y-2">

                  <Label htmlFor="collectionTime">Collection Time</Label>

                  <Input id="collectionTime" type="time" {...register('collectionTime')} aria-invalid={!!errors.collectionTime} />

                  {errors.collectionTime && (

                    <p className="text-xs text-danger" role="alert">{errors.collectionTime.message}</p>

                  )}

                </div>

              </div>



              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">

                  <Label htmlFor="collectedBy">Collected By</Label>

                  <Input id="collectedBy" placeholder="e.g. Inspector Rahul Sharma" {...register('collectedBy')} aria-invalid={!!errors.collectedBy} />

                  {errors.collectedBy && (

                    <p className="text-xs text-danger" role="alert">{errors.collectedBy.message}</p>

                  )}

                </div>

                <div className="space-y-2">

                  <Label htmlFor="location" className="flex items-center gap-1.5">

                    <MapPin className="h-3 w-3" aria-hidden="true" />

                    Location

                  </Label>

                  <Input id="location" placeholder="e.g. Coimbatore City Police Station" {...register('location')} aria-invalid={!!errors.location} />

                  {errors.location && (

                    <p className="text-xs text-danger" role="alert">{errors.location.message}</p>

                  )}

                </div>

              </div>



              <div className="space-y-2">

                <Label htmlFor="evidenceType">Evidence Type</Label>

                <Controller

                  name="evidenceType"

                  control={control}

                  render={({ field }) => (

                    <Select value={field.value} onValueChange={field.onChange}>

                      <SelectTrigger id="evidenceType" aria-invalid={!!errors.evidenceType}>

                        <SelectValue placeholder="Select evidence type" />

                      </SelectTrigger>

                      <SelectContent>

                        {EVIDENCE_TYPES.map((type) => (

                          <SelectItem key={type} value={type}>{type}</SelectItem>

                        ))}

                      </SelectContent>

                    </Select>

                  )}

                />

                {errors.evidenceType && (

                  <p className="text-xs text-danger" role="alert">{errors.evidenceType.message}</p>

                )}

              </div>



              <div className="space-y-2">

                <Label htmlFor="tags">Tags</Label>

                <Input id="tags" placeholder="Comma-separated (e.g. cctv, surveillance, coimbatore)" {...register('tags')} />

              </div>



              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">

                  <Label htmlFor="relatedSuspect">Related Suspect</Label>

                  <Input id="relatedSuspect" placeholder="Suspect name or vehicle ID" {...register('relatedSuspect')} />

                </div>

                <div className="space-y-2">

                  <Label htmlFor="relatedWitness">Related Witness</Label>

                  <Input id="relatedWitness" placeholder="Witness name" {...register('relatedWitness')} />

                </div>

              </div>



              <div className="space-y-2">

                <Label htmlFor="remarks">Remarks</Label>

                <Textarea

                  id="remarks"

                  placeholder="Additional notes or observations..."

                  rows={2}

                  {...register('remarks')}

                />

              </div>



              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">

                <Button type="button" variant="secondary" onClick={() => navigate('/evidence/upload')} disabled={submitting}>

                  Cancel

                </Button>

                <Button type="submit" disabled={submitting || showSuccess} className="sm:flex-1">

                  {submitting ? (

                    <>

                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />

                      Saving evidence...

                    </>

                  ) : (

                    'Save Evidence'

                  )}

                </Button>

              </div>

            </form>

          </CardContent>

        </Card>

      </div>

    </AppLayout>

  );

}


