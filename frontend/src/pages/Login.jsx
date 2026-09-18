import { useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

  const navigate = useNavigate();

  const {
    login,
  } = useAuth();


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

      await login(
        email.trim(),
        password
      );

      navigate("/dashboard");

    } catch (err) {

      setError(
        err.response?.data?.detail ||
          "Unable to sign in. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">


        {/* LEFT PANEL */}
        <div className="relative hidden overflow-hidden border-r border-slate-800 lg:flex">

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Brand */}
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">
                  SRSO
                </p>

                <p className="text-xs text-slate-500">
                  Smart Regression Suite Optimizer
                </p>
              </div>

            </div>


            {/* Main content */}
            <div className="max-w-xl">

              <div className="mb-6 flex items-center gap-2 text-sm text-blue-400">

                <ShieldCheck size={18} />

                Secure regression planning

              </div>


              <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
                Plan your regression testing with confidence.
              </h1>


              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Analyze change impact, prioritize tests, and build
                an execution-ready regression suite within your
                available testing window.
              </p>


              <div className="mt-10 grid gap-3 sm:grid-cols-3">

                <Feature
                  number="01"
                  title="Analyze"
                  description="Understand change relevance"
                />

                <Feature
                  number="02"
                  title="Optimize"
                  description="Fit tests to your time budget"
                />

                <Feature
                  number="03"
                  title="Review"
                  description="Understand risk and coverage"
                />

              </div>

            </div>


            {/* Footer */}
            <p className="text-xs text-slate-600">
              Smart Regression Suite Optimizer
            </p>

          </div>

        </div>


        {/* RIGHT PANEL */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

          <div className="w-full max-w-md">


            {/* Mobile brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold">
                S
              </div>

              <div>

                <p className="font-semibold">
                  SRSO
                </p>

                <p className="text-xs text-slate-500">
                  Smart Regression Suite Optimizer
                </p>

              </div>

            </div>


            {/* Heading */}
            <div className="mb-8">

              <p className="text-sm font-medium text-blue-400">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Sign in to SRSO
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Access your regression runs, test history, and
                optimization results.
              </p>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                </div>

              </div>


              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </button>

                </div>


                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />


                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}


              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Signing in..."
                  : "Sign in"}

                {!loading && (
                  <ArrowRight size={18} />
                )}

              </button>

            </form>


            {/* Divider */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-600">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>


            {/* Google */}
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-400 opacity-70"
            >

              <GoogleIcon />

              Continue with Google

            </button>


            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Create one
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


function Feature({
  number,
  title,
  description,
}) {
  return (
    <div className="border-l border-slate-800 pl-4">

      <p className="text-xs font-medium text-blue-400">
        {number}
      </p>

      <p className="mt-2 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}


function GoogleIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
      G
    </span>
  );
}


export default Login;