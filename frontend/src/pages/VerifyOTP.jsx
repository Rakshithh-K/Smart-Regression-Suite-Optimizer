import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  MailCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import axios from "axios";


const API_BASE_URL = "http://127.0.0.1:8000";


function VerifyOTP() {

  const navigate = useNavigate();

  const [
    searchParams,
  ] = useSearchParams();


  const email =
    searchParams.get("email") || "";


  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [success, setSuccess] = useState(false);


  const handleVerify = async (event) => {

    event.preventDefault();

    setError("");


    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }


    try {

      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        null,
        {
          params: {
            email,
            otp,
          },
        }
      );


      setSuccess(true);


      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {

      setError(
        err.response?.data?.detail ||
          "Unable to verify the code."
      );

    } finally {

      setLoading(false);

    }
  };


  const handleResend = async () => {

    setError("");
    setResending(true);


    try {

      await axios.post(
        `${API_BASE_URL}/api/auth/resend-otp`,
        null,
        {
          params: {
            email,
          },
        }
      );

      setError("");
      setOtp("");

    } catch (err) {

      setError(
        err.response?.data?.detail ||
          "Unable to resend the verification code."
      );

    } finally {

      setResending(false);

    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10 text-white sm:px-8">

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


        {/* Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">

          {success ? (
            <CheckCircle2
              size={22}
              className="text-green-400"
            />
          ) : (
            <MailCheck
              size={22}
              className="text-blue-400"
            />
          )}

        </div>


        <h1 className="text-3xl font-semibold">
          Verify your email
        </h1>


        <p className="mt-3 text-sm leading-6 text-slate-500">
          We sent a 6-digit verification code to
          <span className="ml-1 font-medium text-slate-300">
            {email}
          </span>
        </p>


        {success ? (

          <div className="mt-8 rounded-xl border border-green-900/50 bg-green-950/20 p-4 text-sm text-green-400">
            Email verified successfully. Redirecting
            you to sign in...
          </div>

        ) : (

          <form
            onSubmit={handleVerify}
            className="mt-8"
          >

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Verification code
            </label>


            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value
                    .replace(/\D/g, "")
                )
              }
              placeholder="000000"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none placeholder:text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />


            {error && (
              <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify email"}
            </button>


            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-4 w-full text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
            >
              {resending
                ? "Sending new code..."
                : "Resend verification code"}
            </button>

          </form>

        )}


        <Link
          to="/login"
          className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>

      </div>

    </div>
  );
}


export default VerifyOTP;