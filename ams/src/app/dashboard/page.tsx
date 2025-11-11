"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  // ✅ Check authentication and load user data
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth/login");
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  // ✅ Logout (calls backend + clears local data)
  const handleLogout = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      if (userId) {
        await axiosInstance.post(`/auth/logout?userId=${userId}`);
      }

      setLogoutMessage("✅ Logged out successfully!");
      localStorage.clear();

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setLogoutMessage("❌ Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">Attendance Management System</h1>
        <div className="flex items-center space-x-3">
          {user && <p>Hi, {user.firstName}</p>}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Main */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Welcome {user?.firstName || "User"} 👋  
          Here are your management modules:
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Active Users"
            description="View all currently active users in the system"
            onClick={() => router.push("/dashboard/users")}
          />
          <DashboardCard
            title="Roles"
            description="Manage system roles and permissions"
            onClick={() => router.push("/dashboard/roles")}
          />
          <DashboardCard
            title="Permissions"
            description="View and update access permissions"
            onClick={() => router.push("/dashboard/permissions")}
          />
        </div>

        {logoutMessage && (
          <p className="text-center text-sm mt-6 text-gray-700">
            {logoutMessage}
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} Attendance Management System
      </footer>
    </div>
  );
}

// 🔹 Small reusable Dashboard card
function DashboardCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow-md hover:shadow-lg transition p-5 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 mt-2 text-sm">{description}</p>
      <button className="mt-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
        View
      </button>
    </div>
  );
}
