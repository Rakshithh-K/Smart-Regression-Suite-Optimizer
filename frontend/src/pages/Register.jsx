import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your work email address.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    try {
      setLoading(true);

      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to create your account. Please try again."
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
            <span className="text-lg font-bold tracking-tight text-slate-900 font-mono">
              SRSO
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sm font-medium text-slate-500 tracking-wide">
              Regression Suite Optimizer
            </span>
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono block mb-3">
            Get Started
          </span>

          <h1 className="text-4xl sm:text-[46px] lg:text-[50px] font-semibold text-slate-900 leading-[1.15] tracking-tight">
            Create your QA workspace{" "}
            <span className="text-indigo-600">in minutes.</span>
          </h1>

          <p className="mt-5 text-[17px] sm:text-[18px] text-slate-600 font-normal leading-relaxed max-w-xl">
            Set up your account and start optimizing your regression suites today.
          </p>

          {/* Simple Benefit Rows */}
          <div className="mt-12 space-y-7 max-w-xl">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-slate-900">
                  Quick setup
                </h3>
                <p className="text-[15px] text-slate-500 mt-1 leading-normal font-normal">
                  Get started quickly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-slate-900">
                  Built for QA teams
                </h3>
                <p className="text-[15px] text-slate-500 mt-1 leading-normal font-normal">
                  Optimize regression testing with confidence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-slate-900">
                  Secure and private
                </h3>
                <p className="text-[15px] text-slate-500 mt-1 leading-normal font-normal">
                  Your workspace data stays protected.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean White Registration Panel */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-8 sm:p-11 shadow-xs">
            <div className="mb-8">
              <h2 className="text-[28px] sm:text-[30px] font-semibold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-[15px] sm:text-[16px] text-slate-500 font-normal">
                Join SRSO and start optimizing your tests.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[15px] font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full h-[52px] rounded-xl border border-slate-300 bg-white px-4 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[15px] font-medium text-slate-700 mb-1.5">
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
                <label className="block text-[15px] font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-[15px] font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="w-full h-[52px] rounded-xl border border-slate-300 bg-white pl-4 pr-12 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
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
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Link to Login */}
            <p className="mt-8 text-center text-[15px] text-slate-500 font-normal">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;