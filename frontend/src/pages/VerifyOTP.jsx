import { useState } from "react";
import { ArrowLeft, CheckCircle2, MailCheck, Cpu, KeyRound } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function VerifyOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, null, {
        params: { email, otp },
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, null, {
        params: { email },
      });
      setOtp("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to resend the verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Column: Information */}
      <div className="flex-1 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Cpu size={24} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block">
                SRSO Security
              </span>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Identity Verification
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Verify your QA engineer identity.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            To ensure suite integrity and auditable history logging, we protect access with one-time verification tokens sent to your registered email.
          </p>

          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 max-w-xl">
            <div className="flex items-start gap-3">
              <KeyRound size={22} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-slate-900">One-Time Token Security</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Enter the 6-digit numeric token generated for your session. Tokens expire automatically after 10 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
          Target email: <span className="font-mono font-semibold text-slate-800">{email || "engineer@team"}</span>
        </div>
      </div>

      {/* Right Column: Spacious Verification Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-slate-50/50">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            {success ? (
              <CheckCircle2 size={26} className="text-emerald-600" />
            ) : (
              <MailCheck size={26} />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Check Your Email
          </h2>
          <p className="mt-2 text-base text-slate-600">
            We sent a 6-digit verification code to:
            <br />
            <strong className="font-semibold text-slate-900 font-mono text-sm">
              {email || "your registered address"}
            </strong>
          </p>

          {success ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <p className="text-base font-bold text-emerald-800">
                Verification Successful!
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                Redirecting you to the sign-in portal...
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  autoFocus
                  className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-4 text-center font-mono text-3xl font-extrabold tracking-[0.5em] text-slate-900 outline-none placeholder:text-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15 transition"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-3.5 px-6 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Verifying Code..." : "Verify & Activate Account"}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline cursor-pointer disabled:opacity-50"
                >
                  {resending ? "Dispatching code..." : "Resend code"}
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;