import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck, Mail, RotateCcw } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { verifyOTP, resendOTP } from "../../features/authSlice";

const RESEND_COOLDOWN = 30; // seconds

const VerifyOTP = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.auth.pendingEmail);
  const { loading } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // cooldown state
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  // Redirect if no pending email
  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  // countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill("");
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    const resultAction = await dispatch(verifyOTP({ email: email!, otp: otpString }));
    if (verifyOTP.fulfilled.match(resultAction)) {
      toast.success("Email verified successfully!");
      navigate("/login");
    } else {
      toast.error(resultAction.payload as string);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    const resultAction = await dispatch(resendOTP({ email: email! }));
    setResending(false);

    if (resendOTP.fulfilled.match(resultAction)) {
      toast.success("OTP resent successfully!");
      setOtp(Array(6).fill("")); 
      inputRefs.current[0]?.focus();
      setCooldown(RESEND_COOLDOWN);
    } else {
      toast.error(resultAction.payload as string);
    }
  };

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={`We sent a 6-digit code to ${email ?? "your email"}`}
    >
      <div className="flex justify-center mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(3,131,153)]/10">
          <Mail className="h-7 w-7 text-[rgb(3,131,153)]" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP inputs */}
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="
                h-12 w-12
                rounded-2xl
                border border-slate-200
                bg-white
                text-center text-lg font-medium text-slate-700
                transition-all duration-200
                focus:outline-none
                focus:ring-2 focus:ring-[rgb(3,131,153)]/20
                focus:border-[rgb(3,131,153)]/40
                focus:shadow-md
                hover:border-slate-300
              "
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            />
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            group relative w-full
            rounded-2xl bg-[rgb(3,131,153)]
            px-6 py-3 text-sm font-medium tracking-wide text-white
            transition-all duration-300
            hover:bg-[rgb(2,100,120)] hover:shadow-lg hover:shadow-[rgb(3,131,153)]/20
            active:scale-95
            disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100
          "
          style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                Verify email
              </>
            )}
          </span>
        </button>

        {/* Resend */}
        <p className="text-center text-xs font-light text-slate-500">
          Didn't receive the code?{" "}
          {cooldown > 0 ? (
            <span className="font-medium text-slate-400">
              Resend in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="
                inline-flex items-center gap-1
                font-medium text-[rgb(3,131,153)]
                hover:text-[rgb(2,100,120)] hover:underline
                underline-offset-2 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              <RotateCcw size={11} className={resending ? "animate-spin" : ""} />
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </p>
      </form>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
      `}</style>
    </AuthLayout>
  );
};

export default VerifyOTP;