import { useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  UserPlus,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";


const API_BASE_URL = "http://127.0.0.1:8000";


function Register() {

  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }


    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }


    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }


    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    try {

      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );


      navigate(
        `/verify-otp?email=${encodeURIComponent(
          email.trim()
        )}`
      );

    } catch (err) {

      setError(
        err.response?.data?.detail ||
          "Unable to create your account."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

        <div className="w-full max-w-md">


          {/* Brand */}
          <div className="mb-10 flex items-center gap-3">

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

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
              <UserPlus
                size={19}
                className="text-blue-400"
              />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create an account to save and access your
              regression optimization history.
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

              </div>

            </div>


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
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

              </div>

            </div>


            {/* Password */}
            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              show={showPassword}
              setShow={setShowPassword}
              placeholder="Minimum 8 characters"
            />


            {/* Confirm Password */}
            <PasswordInput
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              placeholder="Re-enter your password"
            />


            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>


          <p className="mt-8 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}


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

      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">

        <LockKeyhole
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-11 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={() =>
            setShow((current) => !current)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
}


export default Register;