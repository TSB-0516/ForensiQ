import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../schemas/authSchema";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | verifying | granted

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    setStatus("verifying");
    try {
      const user = await login(formData);
      setStatus("granted");
      toast.success(`Welcome back, ${user.fullName}`);

      const redirectTo = location.state?.from?.pathname;
      setTimeout(() => {
        navigate(redirectTo || (user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"), {
          replace: true,
        });
      }, 400);
    } catch (err) {
      setStatus("idle");
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-label-sm text-on-surface-variant uppercase ml-1">
          Email Address
        </label>
        <div className="relative flex items-center bg-surface-lowest border border-outline-variant rounded-lg transition-all duration-200 focus-within:border-action focus-within:shadow-[0_0_0_1px_rgba(55,198,255,0.3)]">
          <Mail size={16} className="absolute left-3 text-outline-variant pointer-events-none" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="w-full pl-10 pr-3 py-3 bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder:text-outline-variant/60"
            placeholder="you@agency.gov"
          />
        </div>
        {errors.email && <p className="text-label-sm text-danger mt-0.5 ml-1">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-label-sm text-on-surface-variant uppercase ml-1">
          Secure Password
        </label>
        <div className="relative flex items-center bg-surface-lowest border border-outline-variant rounded-lg transition-all duration-200 focus-within:border-action focus-within:shadow-[0_0_0_1px_rgba(55,198,255,0.3)]">
          <Lock size={16} className="absolute left-3 text-outline-variant pointer-events-none" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            className="w-full pl-10 pr-11 py-3 bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder:text-outline-variant/60"
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 text-outline-variant hover:text-action transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-label-sm text-danger mt-0.5 ml-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "verifying"}
        className={`w-full font-label-md text-label-md uppercase tracking-widest py-3.5 rounded-lg shadow-lg flex items-center justify-center gap-2 mt-2 transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed ${
          status === "granted"
            ? "bg-success text-success-on"
            : "bg-action text-action-on hover:brightness-110 disabled:opacity-80"
        }`}
      >
        {status === "verifying" && (
          <>
            <Loader2 size={16} className="animate-spin" />
            Verifying Credentials...
          </>
        )}
        {status === "granted" && (
          <>
            <ShieldCheck size={16} />
            Access Granted
          </>
        )}
        {status === "idle" && (
          <>
            <LogIn size={16} />
            Authorize Session
          </>
        )}
      </button>

      <div className="flex items-center justify-between pt-1">
        <Link
          to="/register"
          className="text-label-sm text-on-surface-variant hover:text-action transition-colors flex items-center gap-1"
        >
          Need access? Register
        </Link>
        <a
          href="#"
          className="text-label-sm text-on-surface-variant hover:text-action transition-colors flex items-center gap-1"
        >
          <HelpCircle size={13} />
          Access Issues?
        </a>
      </div>
    </form>
  );
}