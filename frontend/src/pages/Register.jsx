import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import srsologinImage from "../assets/srsologin.webp";

const API_BASE_URL = "http://127.0.0.1:8000";

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
    <div className="relative min-h-screen overflow-hidden bg-[#080b24]">

      {/* Background */}
      <img
        src={srsologinImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Image overlay */}
      <div className="absolute inset-0 bg-[#080b24]/65" />

      <div className="relative z-10 min-h-screen px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1400px] items-center">

          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

            {/* LEFT */}
            <div>

              {/* Brand */}
              <div className="mb-9 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Cpu size={24} />
                </div>

                <div>
                  <div className="text-xl font-semibold text-white">
                    SRSO Platform
                  </div>

                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-200">
                    Smart Regression Suite Optimizer
                  </div>
                </div>
              </div>

              <div className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-indigo-200">
                QA Engineering Intelligence
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Create your workspace for smarter regression testing.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                Build an engineering workspace that helps you analyze changes,
                optimize regression coverage, and understand test-selection
                trade-offs within a fixed execution window.
              </p>

              {/* Features */}
              <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
                <FeatureCard
                  icon={<Zap size={20} />}
                  title="Budget-Based Optimization"
                  description="Fit high-value regression tests into your available execution window."
                />

                <FeatureCard
                  icon={<ShieldCheck size={20} />}
                  title="Risk-Aware Analysis"
                  description="Use priority and historical failures to identify important regression risks."
                />
              </div>

              {/* Status */}
              <div className="mt-8 flex max-w-3xl flex-wrap justify-between gap-4 border-t border-white/15 pt-5 text-sm text-slate-200">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Optimization Engine v2.4 Active
                </span>

                <span>FastAPI · Dynamic Programming</span>
              </div>
            </div>

            {/* REGISTER CARD */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[520px] rounded-2xl border border-white/20 bg-slate-950/40 p-7 shadow-2xl backdrop-blur-md sm:p-9">

                <div className="mb-7">
                  <p className="mb-2 text-sm text-indigo-200">
                    Create your engineering workspace
                  </p>

                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Create QA Account
                  </h2>

                  <p className="mt-2 text-base leading-6 text-slate-300">
                    Set up your account to start optimizing regression suites
                    and reviewing historical test runs.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <Input
                    icon={<User size={19} />}
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={setName}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />

                  <Input
                    icon={<Mail size={19} />}
                    label="Work Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="engineer@company.com"
                    autoComplete="email"
                  />

                  <PasswordInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    show={showPassword}
                    setShow={setShowPassword}
                    placeholder="Minimum 8 characters"
                  />

                  <PasswordInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirmPassword}
                    setShow={setShowConfirmPassword}
                    placeholder="Re-enter your password"
                  />

                  {error && (
                    <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Account & Continue"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>

                <p className="mt-7 text-center text-sm text-slate-300">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-indigo-200 underline underline-offset-2 hover:text-white"
                  >
                    Sign in instead
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable normal input */
function Input({ icon, label, type, value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/85">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-white/25 bg-white/10 py-3.5 pl-11 pr-4 text-base text-white outline-none placeholder:text-slate-300/70 focus:border-indigo-400 focus:bg-white/15 focus:ring-2 focus:ring-indigo-400/20"
        />
      </div>
    </div>
  );
}

/* Reusable password input */
function PasswordInput({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/90"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full rounded-xl border border-white/25 bg-white/10 py-3.5 pl-11 pr-12 text-base text-white outline-none placeholder:text-slate-300/70 focus:border-indigo-400 focus:bg-white/15 focus:ring-2 focus:ring-indigo-400/20"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}

/* Feature card */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex gap-4 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Register;