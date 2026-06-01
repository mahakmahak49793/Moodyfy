import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import { useAppDispatch } from "../../app/hooks";
import { registerUser } from "../../features/authSlice";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, Sparkles } from "lucide-react";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const resultAction = await dispatch(
        registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/verify-otp");
      } else {
        toast.error(resultAction.payload as string);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join Moodyfy"
      subtitle="Begin your mindful journey with Moodyfy"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* NAME */}
        <div className="group">
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(3,131,153)] transition-all group-focus-within:text-[rgb(2,100,120)] group-focus-within:scale-110" />
            <input
              type="text"
              placeholder="Full name"
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-12
                py-3
                text-sm
                font-light
                tracking-wide
                text-slate-700
                transition-all
                duration-200
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-[rgb(3,131,153)]/20
                focus:border-[rgb(3,131,153)]/40
                focus:shadow-md
                hover:border-slate-300
                hover:shadow-sm
              "
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              {...register("name", {
                required: "Name is required",
              })}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs font-medium text-rose-400 pl-4">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="group">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(3,131,153)] transition-all group-focus-within:text-[rgb(2,100,120)] group-focus-within:scale-110" />
            <input
              type="email"
              placeholder="Email address"
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-12
                py-3
                text-sm
                font-light
                tracking-wide
                text-slate-700
                transition-all
                duration-200
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-[rgb(3,131,153)]/20
                focus:border-[rgb(3,131,153)]/40
                focus:shadow-md
                hover:border-slate-300
                hover:shadow-sm
              "
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-rose-400 pl-4">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="group">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(3,131,153)] transition-all group-focus-within:text-[rgb(2,100,120)] group-focus-within:scale-110" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-12
                py-3
                pr-10
                text-sm
                font-light
                tracking-wide
                text-slate-700
                transition-all
                duration-200
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-[rgb(3,131,153)]/20
                focus:border-[rgb(3,131,153)]/40
                focus:shadow-md
                hover:border-slate-300
                hover:shadow-sm
              "
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all hover:text-[rgb(3,131,153)] hover:scale-110"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-rose-400 pl-4">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="group">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(3,131,153)] transition-all group-focus-within:text-[rgb(2,100,120)] group-focus-within:scale-110" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-12
                py-3
                pr-10
                text-sm
                font-light
                tracking-wide
                text-slate-700
                transition-all
                duration-200
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-[rgb(3,131,153)]/20
                focus:border-[rgb(3,131,153)]/40
                focus:shadow-md
                hover:border-slate-300
                hover:shadow-sm
              "
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all hover:text-[rgb(3,131,153)] hover:scale-110"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs font-medium text-rose-400 pl-4">
              {errors.confirmPassword.message}
            </p>
          )}
          {password && watch("confirmPassword") && password === watch("confirmPassword") && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-500 pl-4">
              <CheckCircle size={12} />
              Passwords match
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            group
            relative
            w-full
            rounded-2xl
            bg-[rgb(3,131,153)]
            px-6
            py-3
            text-sm
            font-medium
            tracking-wide
            text-white
            transition-all
            duration-300
            hover:bg-[rgb(2,100,120)]
            hover:shadow-lg
            hover:shadow-[rgb(3,131,153)]/20
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:scale-100
          "
          style={{ fontFamily: "'Poppins', system-ui, -apple-system, sans-serif" }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating account...
              </>
            ) : (
              <>
                <Sparkles size={16} className="transition-transform group-hover:rotate-12" />
                Create account
              </>
            )}
          </span>
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-xs font-light text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-medium
              text-[rgb(3,131,153)]
              transition-all
              duration-200
              hover:text-[rgb(2,100,120)]
              hover:underline
              underline-offset-2
            "
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Sign in
          </Link>
        </p>
      </form>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
      `}</style>
    </AuthLayout>
  );
};

export default Signup;