"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/store/hooks";

interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleCode: string;
  isActive: boolean;
  createdAt: string;
}

export default function ActiveUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const fetchActiveUsers = async (pageNumber = 0) => {
    console.log("🟢 Fetching active users, token:", accessToken);
    if (!accessToken) {
      setError("❌ You are not authorized. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/users/active?page=${pageNumber}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ Correct Bearer header
          },
        }
      );

      console.log("✅ Users fetched successfully:", response.data);

      // 🔹 Handle Spring Boot Pageable response
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      console.error("❌ Error fetching active users:", err.response || err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        router.push("/auth/login");
      } else if (err.response?.status === 403) {
        setError("Access denied. You do not have permission to view users.");
      } else if (err.response?.status === 404) {
        setError("Endpoint not found. Check your API URL or backend route.");
      } else {
        setError(err.response?.data?.message || "Failed to load users.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveUsers(page);
    }
  }, [page, isAuthenticated]);

  // 🧭 If user not logged in, show redirect message
  if (!isAuthenticated) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          👥 Active Users
        </h1>

        {loading ? (
          <div className="text-center py-10 text-gray-600 animate-pulse">
            Loading users...
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-medium py-8">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-600 text-white uppercase text-sm">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500 italic"
                    >
                      No active users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.userId}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } border-b hover:bg-blue-50 transition`}
                    >
                      <td className="p-3 text-gray-800 font-medium">
                        {user.userId}
                      </td>
                      <td className="p-3 text-gray-700">{user.username}</td>
                      <td className="p-3 text-blue-700">{user.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.roleCode === "ADMIN"
                              ? "bg-blue-100 text-blue-700"
                              : user.roleCode === "MANAGER"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.roleCode}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(user.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-gray-700 font-medium">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <footer className="text-center mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} Attendance Management System
      </footer>
    </div>
  );
}
