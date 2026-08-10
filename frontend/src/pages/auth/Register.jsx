import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, IdCard, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { registerSchema } from "../../schemas/authSchema";

const ROLE_OPTIONS = [
  { value: "INVESTIGATOR", label: "Investigator" },
  { value: "FORENSIC_ANALYST", label: "Forensic Analyst" },
  { value: "PROSECUTOR", label: "Prosecutor" },
  { value: "ADMIN", label: "Administrator" },
];

const fieldWrapClass =
  "relative flex items-center bg-surface-lowest border border-outline-variant rounded-lg transition-all duration-200 focus-within:border-action focus-within:shadow-[0_0_0_1px_rgba(55,198,255,0.3)]";
const iconClass = "absolute left-3 text-outline-variant pointer-events-none";
const inputClass =
  "w-full pl-10 pr-3 py-3 bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder:text-outline-variant/60";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await registerUser(formData);
      toast.success("Credentials issued. Sign in to continue.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-label-sm text-on-surface-variant uppercase ml-1">
          Full Name
        </label>
        <div className={fieldWrapClass}>
          <User size={16} className={iconClass} />
          <input id="fullName" autoComplete="name" {...register("fullName")} className={inputClass} placeholder="Jordan Reyes" />
        </div>
        {errors.fullName && <p className="text-label-sm text-danger mt-0.5 ml-1">{errors.fullName.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-label-sm text-on-surface-variant uppercase ml-1">
          Email Address
        </label>
        <div className={fieldWrapClass}>
          <Mail size={16} className={iconClass} />
          <input id="email" type="email" autoComplete="email" {...register("email")} className={inputClass} placeholder="you@agency.gov" />
        </div>
        {errors.email && <p className="text-label-sm text-danger mt-0.5 ml-1">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-label-sm text-on-surface-variant uppercase ml-1">
          Clearance Role
        </label>
        <div className={fieldWrapClass}>
          <IdCard size={16} className={iconClass} />
          <select id="role" defaultValue="" {...register("role")} className={`${inputClass} appearance-none`}>
            <option value="" disabled>Select your role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        {errors.role && <p className="text-label-sm text-danger mt-0.5 ml-1">{errors.role.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-label-sm text-on-surface-variant uppercase ml-1">
            Password
          </label>
          <div className={fieldWrapClass}>
            <Lock size={16} className={iconClass} />
            <input id="password" type="password" autoComplete="new-password" {...register("password")} className={inputClass} placeholder="••••••••" />
          </div>
          {errors.password && <p className="text-label-sm text-danger mt-0.5 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-label-sm text-on-surface-variant uppercase ml-1">
            Confirm
          </label>
          <div className={fieldWrapClass}>
            <Lock size={16} className={iconClass} />
            <input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} className={inputClass} placeholder="••••••••" />
          </div>
          {errors.confirmPassword && <p className="text-label-sm text-danger mt-0.5 ml-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-action text-action-on font-label-md text-label-md uppercase tracking-widest py-3.5 rounded-lg shadow-lg flex items-center justify-center gap-2 mt-2 hover:brightness-110 active:scale-[0.98] transition-all duration-150 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
        {isSubmitting ? "Provisioning Access..." : "Request Access"}
      </button>

      <p className="text-label-sm text-on-surface-variant text-center pt-1">
        Already have credentials?{" "}
        <Link to="/login" className="text-action hover:brightness-110 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}