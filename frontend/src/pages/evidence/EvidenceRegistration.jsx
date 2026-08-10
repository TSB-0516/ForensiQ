import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { evidenceRegistrationSchema, EVIDENCE_TYPES } from "../../schemas/evidenceSchema";
import { evidenceApi } from "../../api/evidenceApi";

export default function EvidenceRegistration() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const suggestedType = location.state?.suggestedType;
  const originalFilename = location.state?.originalFilename;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(evidenceRegistrationSchema),
    defaultValues: { evidenceType: suggestedType || undefined },
  });

  const onSubmit = async (formData) => {
    try {
      await evidenceApi.register(id, formData);
      toast.success("Evidence registered");
      navigate(`/evidence/${id}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-headline-sm mb-1">Register Evidence</h2>
        <p className="text-body-sm text-on-surface-variant">
          {originalFilename
            ? <>Add investigation metadata for <span className="text-on-surface">{originalFilename}</span>.</>
            : "Add investigation metadata for this evidence item."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Field label="TITLE" error={errors.title?.message}>
          <input {...register("title")} className={inputClass} placeholder="e.g. Suspect vehicle dashcam footage" />
        </Field>

        <Field label="DESCRIPTION" error={errors.description?.message}>
          <textarea {...register("description")} rows={3} className={inputClass} placeholder="Describe the evidence and its relevance..." />
        </Field>

        <Field label="EVIDENCE TYPE" error={errors.evidenceType?.message}>
          <select {...register("evidenceType")} defaultValue="" className={inputClass}>
            <option value="" disabled>Select type</option>
            {EVIDENCE_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="COLLECTION DATE" error={errors.collectionDate?.message}>
            <input type="date" {...register("collectionDate")} className={inputClass} />
          </Field>
          <Field label="COLLECTION TIME" error={errors.collectionTime?.message}>
            <input type="time" {...register("collectionTime")} className={inputClass} />
          </Field>
        </div>

        <Field label="COLLECTED BY" error={errors.collectedBy?.message}>
          <input {...register("collectedBy")} className={inputClass} placeholder="Officer / analyst name" />
        </Field>

        <Field label="COLLECTION LOCATION" error={errors.collectionLocation?.message}>
          <input {...register("collectionLocation")} className={inputClass} placeholder="e.g. 4th & Main St, Junction Camera 2" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="RELATED SUSPECT" error={errors.relatedSuspect?.message} optional>
            <input {...register("relatedSuspect")} className={inputClass} />
          </Field>
          <Field label="RELATED WITNESS" error={errors.relatedWitness?.message} optional>
            <input {...register("relatedWitness")} className={inputClass} />
          </Field>
        </div>

        <Field label="INVESTIGATION TAGS" error={errors.investigationTags?.message} optional>
          <input {...register("investigationTags")} className={inputClass} placeholder="Comma-separated, e.g. burglary, downtown, night" />
        </Field>

        <Field label="ADDITIONAL REMARKS" error={errors.additionalRemarks?.message} optional>
          <textarea {...register("additionalRemarks")} rows={2} className={inputClass} />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start mt-2 flex items-center gap-2 bg-action text-action-on font-medium text-body-sm px-5 py-2.5 rounded hover:brightness-110 disabled:opacity-50 transition"
        >
          {isSubmitting && <Loader2 size={15} className="animate-spin" />}
          {isSubmitting ? "Saving..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full bg-surface-lowest border border-outline-variant rounded px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-action transition";

function Field({ label, error, optional, children }) {
  return (
    <div>
      <label className="block text-label-sm text-on-surface-variant mb-1.5">
        {label} {optional && <span className="text-on-surface-variant/50">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-label-sm text-danger mt-1.5">{error}</p>}
    </div>
  );
}