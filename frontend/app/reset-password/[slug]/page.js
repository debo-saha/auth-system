"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authstore";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef(null);

  const { resetpassword, isLoading } = useAuthStore();

  const params = useParams();
  const { slug: token } = useParams();

  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (success) {
      timeoutRef.current = setTimeout(() => {
        router.push("/");
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [success, router]);

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      if (password.length < 8)
        newErrors.password = "Must be at least 8 characters";
      else if (!/[A-Z]/.test(password))
        newErrors.password = "Missing uppercase letter";
      else if (!/[a-z]/.test(password))
        newErrors.password = "Missing lowercase letter";
      else if (!/[0-9]/.test(password)) newErrors.password = "Missing number";
      else newErrors.password = "Missing special character (!@#$%^&*)";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!token) {
      setGlobalError("Invalid or missing token");
      return;
    }

    try {
      setErrors({});
      setGlobalError("");
      console.log("Submitting password reset for slug:", token);
      console.log("New password:", password);
      await resetpassword({ token, password });
      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      const message =
        err?.response?.data?.message ||
        "Password reset failed. Please try again.";
      setGlobalError(message);
    }
  };

  useEffect(() => {
    if (passwordFocus && password) {
      const validationErrors = validateForm();
      setErrors((prev) => ({ ...prev, password: validationErrors.password }));
    }
  }, [password, passwordFocus]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {success ? "Password Reset Successful!" : "Reset Your Password"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-900">
                Your password has been updated successfully
              </p>
              <p className="mt-2 text-gray-600">
                Redirecting to login page in 3 seconds...
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Login Now
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {globalError && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <p className="text-sm font-medium text-red-800">
                    {globalError}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby="password-error"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700 text-sm font-medium mb-2">
                  Password Requirements:
                </p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li
                    className={`flex items-center ${
                      password.length >= 8 ? "text-green-600" : ""
                    }`}
                  >
                    <span className="mr-2">•</span>
                    <span>Minimum 8 characters</span>
                  </li>
                  <li
                    className={`flex items-center ${
                      /[A-Z]/.test(password) ? "text-green-600" : ""
                    }`}
                  >
                    <span className="mr-2">•</span>
                    <span>Uppercase letter (A-Z)</span>
                  </li>
                  <li
                    className={`flex items-center ${
                      /[a-z]/.test(password) ? "text-green-600" : ""
                    }`}
                  >
                    <span className="mr-2">•</span>
                    <span>Lowercase letter (a-z)</span>
                  </li>
                  <li
                    className={`flex items-center ${
                      /[0-9]/.test(password) ? "text-green-600" : ""
                    }`}
                  >
                    <span className="mr-2">•</span>
                    <span>Number (0-9)</span>
                  </li>
                  <li
                    className={`flex items-center ${
                      /[!@#$%^&*]/.test(password) ? "text-green-600" : ""
                    }`}
                  >
                    <span className="mr-2">•</span>
                    <span>Special character (!@#$%^&*)</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
