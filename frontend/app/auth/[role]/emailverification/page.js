"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authstore";

const EmailVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const { role } = useParams(); // Get the role from the URL parameters
  const inputRefs = useRef([]);
  const emailInputRef = useRef(null);
  const router = useRouter();
  const { verifyEmail, isLoading, resendOtp } = useAuthStore();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleCodeChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      pasted.forEach((digit, idx) => {
        if (/^\d$/.test(digit)) {
          newCode[idx] = digit;
        }
      });
      setCode(newCode);
      const filled = pasted.filter((d) => /^\d$/.test(d)).length;
      if (filled === 6) {
        handleSubmit(); // Auto-submit
      } else {
        inputRefs.current[Math.min(filled, 5)]?.focus();
      }
    } else if (/^\d$/.test(value)) {
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newCode.every((digit) => digit !== "")) {
        handleSubmit(); // Auto-submit
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setEmailError("");
    setLocalError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const verificationCode = code.join("");
    if (verificationCode.length != 6) {
      setLocalError("Please enter a 6-digit OTP code");
      return;
    }

    try {
      await verifyEmail({ email, code: verificationCode });
      setIsVerified(true);
      setTimeout(() => router.push(`/auth/${role}/login`), 3000);
    } catch (err) {
      setLocalError(err?.response?.data?.message || "Verification failed");
    }
  };

  const handleResendCode = async () => {
    setEmailError("");
    setLocalError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email before resending");
      return;
    }

    try {
      console.log("Resending OTP to:", email);
      await resendOtp({ email }); // uses Zustand store
      setCode(["", "", "", "", "", ""]);
      setTimer(30);
      inputRefs.current[0]?.focus();
      alert(`New code sent to ${email}`);
    } catch (err) {
      // This will catch unexpected promise rejection in resendOtp
      const message =
        err?.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      setLocalError(message);
      console.error("Resend OTP failed:", message);
    }
  };

  useEffect(() => {
    const interval =
      timer > 0 ? setInterval(() => setTimer((t) => t - 1), 1000) : null;
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Email Verified Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full animate-progress"
              style={{ width: "100%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-md w-full">
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Verify Your Email Address
          </h2>
          <p className="text-indigo-100 mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  ref={emailInputRef}
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    emailError ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="flex justify-between space-x-3">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      digit ? "border-indigo-500" : "border-gray-300"
                    }`}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {localError && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {localError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Resend Option */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timer > 0 || isLoading}
                  className={`font-medium transition-colors ${
                    timer > 0 || isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:text-indigo-800"
                  }`}
                >
                  Resend {timer > 0 && `(${timer}s)`}
                </button>
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Check your spam folder if you don't see the email
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
