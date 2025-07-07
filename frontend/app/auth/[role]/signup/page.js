"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authstore";
import { useRouter, useParams } from "next/navigation";

export default function StudentSignup() {
  const { role } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    role: role,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      checkPasswordStrength(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  const calculateStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getStrengthLabel = () => {
    const score = calculateStrengthScore();
    if (score === 0) return "Weak";
    if (score < 3) return "Fair";
    if (score < 5) return "Good";
    return "Strong";
  };

  const signup = useAuthStore((state) => state.signup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signup(formData); // this will call your backend
      alert("Check your email for verification code .");
      // setTimeout(() => router.push(`auth/${role}/emailverification`), 1000);
      setTimeout(() => router.push(`/auth/${role}/emailverification`), 1000);
    } catch (err) {
      alert("Signup failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Column - Image Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          <div className="relative z-10 p-10 flex flex-col justify-between h-full">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h1 className="ml-4 text-xl font-bold text-white">
                University Portal
              </h1>
            </div>

            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Academic Community
              </h2>
              <p className="text-blue-100 mb-6">
                Access course materials, connect with professors, and
                participate in campus activities
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-sm">
                  Access all course materials in one place
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm">Connect with peers and professors</p>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm">Stay updated with campus events</p>
              </div>
            </div>

            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-white/30"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-1/2">
          <div className="p-8 space-y-6">
            <div className="md:hidden mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                University Portal
              </h1>
              <h2 className="text-lg text-gray-600 mt-1">
                Student Registration
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 mb-2 font-medium"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
                      placeholder="Enter your full name"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 mb-2 font-medium"
                    htmlFor="email"
                  >
                    College Email ID
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
                      placeholder="Enter college email"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 mb-2 font-medium"
                    htmlFor="studentId"
                  >
                    Student ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
                      placeholder="Enter student ID"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 mb-2 font-medium"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12 pr-10"
                      placeholder="Create a password"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Password Strength
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          getStrengthLabel() === "Weak"
                            ? "text-red-500"
                            : getStrengthLabel() === "Fair"
                            ? "text-yellow-500"
                            : getStrengthLabel() === "Good"
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      >
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full ${
                          calculateStrengthScore() === 0
                            ? "bg-red-500 w-1/4"
                            : calculateStrengthScore() === 1
                            ? "bg-red-500 w-1/4"
                            : calculateStrengthScore() === 2
                            ? "bg-yellow-500 w-1/2"
                            : calculateStrengthScore() === 3
                            ? "bg-blue-500 w-3/4"
                            : "bg-green-500 w-full"
                        }`}
                        style={{ width: `${calculateStrengthScore() * 25}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <PasswordRequirement
                        met={passwordStrength.length}
                        text="8+ characters"
                      />
                      <PasswordRequirement
                        met={passwordStrength.uppercase}
                        text="Uppercase letter"
                      />
                      <PasswordRequirement
                        met={passwordStrength.lowercase}
                        text="Lowercase letter"
                      />
                      <PasswordRequirement
                        met={passwordStrength.number}
                        text="Number"
                      />
                      <PasswordRequirement
                        met={passwordStrength.specialChar}
                        text="Special character"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 mb-2 font-medium"
                    htmlFor="role"
                  >
                    Role
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed pl-12 appearance-none"
                      disabled
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                      <option value="subadmin">Sub Admin</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.03-.688-.086-1.016A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!allRequirementsMet || isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg flex items-center justify-center ${
                  allRequirementsMet
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition duration-300 transform hover:scale-[1.02]`}
              >
                {isSubmitting ? (
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="bg-gray-50 px-6 py-4 rounded-lg text-center border border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href={`/auth/${role}/login`}
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                By signing up, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }) {
  return (
    <div className="flex items-center">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
          met ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        {met && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
      </div>
      <span className={`text-sm ${met ? "text-green-600" : "text-gray-500"}`}>
        {text}
      </span>
    </div>
  );
}
