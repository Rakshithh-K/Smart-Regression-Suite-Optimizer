import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Cpu,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import srsologinImage from "../assets/srsologin.webp";

const inputClass =
  "w-full rounded-xl border border-white/30 bg-white/10 py-3.5 pl-11 pr-4 text-[15px] font-normal text-white outline-none placeholder:text-slate-200/55 transition focus:border-violet-300/80 focus:bg-white/15 focus:ring-2 focus:ring-violet-400/20";

const passwordInputClass =
  "w-full rounded-xl border border-white/30 bg-white/10 py-3.5 pl-11 pr-12 text-[15px] font-normal text-white outline-none placeholder:text-slate-200/55 transition focus:border-violet-300/80 focus:bg-white/15 focus:ring-2 focus:ring-violet-400/20";

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
    <div
      className="relative min-h-screen w-full overflow-hidden bg-slate-950"
      style={{
        backgroundImage: `url(${srsologinImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-[#07102f]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07102f]/45 via-transparent to-[#07102f]/35" />

      <div className="relative z-10 min-h-screen w-full">
        <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-10 xl:px-16">
          <div className="flex flex-1 flex-col justify-center">
            <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 xl:grid-cols-[1.18fr_0.82fr] xl:gap-16">

              {/* Left */}
              <section className="flex flex-col justify-center">
                <div className="mb-10 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600/90 text-white shadow-lg shadow-violet-950/30">
                    <Cpu size={29} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white sm:text-[22px]">
                      SRSO Platform
                    </h2>
                    <p className="mt-1 text-[12px] font-medium italic uppercase tracking-[0.18em] text-violet-200/90">
                      Smart Regression Suite Optimizer
                    </p>
                  </div>
                </div>

                <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.22em] text-violet-200">
                  QA Engineering Intelligence
                </p>

                <h1 className="max-w-[760px] text-[38px] font-semibold leading-[1.12] tracking-[-0.025em] text-white sm:text-[42px] lg:text-[43px] xl:text-[46px]">
                  Deterministic regression test selection
                  <br />
                  <span className="text-violet-300">
                    for QA engineering teams.
                  </span>
                </h1>

                <p className="mt-5 max-w-[720px] text-[16px] font-normal leading-7 text-slate-100/90 sm:text-[17px]">
                  Eliminate testing bottlenecks by scientifically selecting
                  the highest-impact regression test suite that strictly fits
                  your deployment window.
                </p>

                <div className="mt-8 grid max-w-[800px] grid-cols-1 gap-4 xl:grid-cols-2">
                  <FeatureCard
                    icon={
                      <Sliders
                        size={23}
                        strokeWidth={1.8}
                        className="text-violet-300"
                      />
                    }
                    title="0/1 Dynamic Knapsack Solver"
                    description="Mathematically maximizes regression payoff within your specified execution-time budget."
                  />

                  <FeatureCard
                    icon={
                      <ShieldCheck
                        size={23}
                        strokeWidth={1.8}
                        className="text-emerald-300"
                      />
                    }
                    title="Defect History & Risk Weighting"
                    description="Prioritizes unstable and failure-prone modules so defect detection isn't sacrificed."
                  />
                </div>

                <div className="mt-9 max-w-[800px] border-t border-white/20 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-slate-100/80">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        size={17}
                        strokeWidth={1.8}
                        className="text-emerald-400"
                      />
                      <span>Optimization Engine v2.4 Active</span>
                    </div>

                    <span className="text-slate-200/75">
                      FastAPI · Dynamic Programming
                    </span>
                  </div>
                </div>
              </section>

              {/* Login Card */}
              <section className="flex w-full justify-center lg:justify-end">
                <div className="w-full max-w-[520px] rounded-[22px] border border-white/25 bg-[#07102f]/45 p-7 shadow-2xl shadow-black/20 backdrop-blur-[6px] sm:p-8 lg:p-9">

                  <div className="mb-7">
                    <p className="mb-2 text-[13px] font-medium text-violet-200">
                      Secure workspace access
                    </p>

                    <h2 className="text-[30px] font-semibold tracking-tight text-white">
                      Sign In to SRSO
                    </h2>

                    <p className="mt-1.5 text-[15px] font-normal leading-6 text-slate-200/85">
                      Access your workspace and historical regression analyses.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-[14px] font-medium text-white">
                        Work Email Address
                      </label>

                      <div className="relative">
                        <Mail
                          size={19}
                          strokeWidth={1.8}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white"
                        />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="engineer@company.com"
                          autoComplete="email"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-[14px] font-medium text-white">
                          Password
                        </label>

                        <button
                          type="button"
                          className="cursor-pointer text-[13px] font-medium text-violet-300 transition hover:text-violet-200"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <div className="relative">
                        <LockKeyhole
                          size={18}
                          strokeWidth={1.7}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-200/80"
                        />

                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your account password"
                          autoComplete="current-password"
                          className={passwordInputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-200/70 transition hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff size={18} strokeWidth={1.7} />
                          ) : (
                            <Eye size={18} strokeWidth={1.7} />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-[14px] font-normal leading-5 text-rose-100">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-6 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-violet-950/25 transition hover:bg-violet-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Signing in..." : "Sign In to Workspace"}

                      {!loading && (
                        <ArrowRight size={18} strokeWidth={1.8} />
                      )}
                    </button>
                  </form>

                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/15" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300/75">
                      Or continue with
                    </span>
                    <div className="h-px flex-1 bg-white/15" />
                  </div>

                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-[14px] font-normal text-slate-200/75"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-slate-700">
                      G
                    </span>
                    Single Sign-On (Google Workspace)
                  </button>

                  <p className="mt-7 text-center text-[14px] font-normal text-slate-200/80">
                    Don't have an engineering account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-violet-300 underline decoration-violet-300/50 underline-offset-2 transition hover:text-violet-200"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/20 bg-white/[0.06] px-5 py-4.5 backdrop-blur-[3px]">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-[15px] font-medium leading-5 text-white">
          {title}
        </h3>

        <p className="mt-1.5 text-[13px] font-normal leading-5.5 text-slate-200/80">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Login;