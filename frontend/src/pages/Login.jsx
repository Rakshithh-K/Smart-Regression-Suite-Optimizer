import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sliders,
  ShieldCheck,
  LineChart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center px-6 py-12 lg:px-12 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="w-full max-w-[1360px] grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-center">
        {/* Left Side: Product Value & Editorial Intro */}
        <div className="flex flex-col justify-center">
          {/* Brand header */}
          <div className="flex items-center gap-3 mb-8">
            <span className="lg:text-[50px] font-bold tracking-tight text-slate-900 font-mono">
              SRSO
            </span>
            <span className="text-slate-300">•</span>
            <span className="lg:text-[40px] text-sm font-medium text-slate-500 tracking-wide">
              Regression Suite Optimizer
            </span>
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono block mb-3">
            QA Engineering Intelligence
          </span>

          <h1 className="text-4xl sm:text-[46px] lg:text-[50px] font-semibold text-slate-900 leading-[1.15] tracking-tight">
            Smarter regression testing{" "}
            <span className="text-indigo-600">for faster releases.</span>
          </h1>

          <p className="mt-5 text-[17px] sm:text-[18px] text-slate-600 font-normal leading-relaxed max-w-xl">
            Select the right tests. Save time. Reduce risk. Ship with confidence.
          </p>

          {/* 3 Simple Value Points */}
          <div className="mt-12 space-y-7 max-w-xl">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-slate-900">
                  Optimize test suites
                </h3>
                <p className="text-[15px] text-slate-500 mt-1 leading-normal font-normal">
                  Fit high-value regression tests within your execution budget.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-slate-900">
                  Reduce release risk
                </h3>
                <p className="text-[15px] text-slate-500 mt-1 leading-normal font-normal">
                  Focus on high-impact tests.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <LineChart size={18} />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-slate-900">
                  Make data-driven decisions
                </h3>
                <p className="text-[15px] text-slate-500 mt-1 leading-normal font-normal">
                  Use change relevance and test history.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean White Authentication Panel */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-8 sm:p-11 shadow-xs">
            <div className="mb-8">
              <h2 className="text-[28px] sm:text-[30px] font-semibold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-2 text-[15px] sm:text-[16px] text-slate-500 font-normal">
                Sign in to your SRSO workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[15px] font-medium text-slate-700 mb-2">
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  autoComplete="email"
                  className="w-full h-[52px] rounded-xl border border-slate-300 bg-white px-4 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[15px] font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    autoComplete="current-password"
                    className="w-full h-[52px] rounded-xl border border-slate-300 bg-white pl-4 pr-12 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              {/* Primary Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] mt-2 inline-flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-6 text-[16px] font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google SSO Button */}
            <button
              type="button"
              disabled
              className="w-full h-[52px] inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-medium text-slate-700 opacity-60 cursor-not-allowed"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Link to Register */}
            <p className="mt-8 text-center text-[15px] text-slate-500 font-normal">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;