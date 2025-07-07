"use client";

import { useAuthStore } from "@/store/authstore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const {
    user,
    isLoading,
    error,
    checkAuth,
    isAuthenticated,
    isCheckingAuth,
    logout,
  } = useAuthStore();

  
  useEffect(() => {
    checkAuth(); // Check if the user is authenticated on mount
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isCheckingAuth || isLoading) {
    return <div className="p-4 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user?.name || "User"}!
        </h1>
        <p className="text-gray-700 mb-6">Email: {user?.email}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
