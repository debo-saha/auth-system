// pages/auth.js
"use client";
import Link from "next/link";

export default function AuthPage() {
  const roles = [
    {
      id: "admin",
      title: "Admin Login",
      icon: "fas fa-lock",
      description: "System administrators access",
      color: "bg-indigo-600",
      hoverColor: "hover:bg-indigo-700",
    },
    {
      id: "subadmin",
      title: "Sub Admin Login",
      icon: "fas fa-chalkboard-teacher",
      description: "lorem ipsam",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      id: "teacher",
      title: "Teacher Login",
      icon: "fas fa-chalkboard-teacher",
      description: "Faculty and instructors access",
      color: "bg-teal-600",
      hoverColor: "hover:bg-teal-700",
    },
    {
      id: "student",
      title: "Student Login",
      icon: "fas fa-user-graduate",
      description: "Students and learners access",
      color: "bg-amber-600",
      hoverColor: "hover:bg-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[80vw]">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <h1 className="text-4xl font-bold text-white">Campus Portal</h1>
            <p className="text-indigo-200 mt-2">Select your login method</p>
          </div>

          {/* Role Selection - Horizontal Layout */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {roles.map((role) => (
                <Link href={`/auth/${role.id}/login`} key={role.id}>
                  <div
                    className={`${role.color} ${role.hoverColor} transition-all rounded-2xl p-8 text-center group transform hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full flex flex-col items-center justify-center`}
                  >
                    <div className="mx-auto bg-white bg-opacity-20 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                      <i className={`${role.icon} text-2xl`}></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-white">
                      {role.title}
                    </h3>
                    <div className="w-12 h-1 bg-white bg-opacity-50 my-4 rounded-full mx-auto"></div>
                    <p className="text-white text-opacity-80 mt-2">
                      {role.description}
                    </p>
                    <div className="mt-6">
                      <span className="inline-flex items-center text-white text-sm font-medium">
                        Continue <i className="fas fa-arrow-right ml-2"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 text-center">
            <p className="text-gray-600 text-sm">
              Need help?{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
