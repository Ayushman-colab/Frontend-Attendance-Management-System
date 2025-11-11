"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";

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

  const fetchActiveUsers = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Matches backend: /api/users/active?page=${page}&size=10
      const response = await axiosInstance.get(`/users/active?page=${pageNumber}&size=10`);
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      console.error("❌ Error fetching active users:", err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers(page);
  }, [page]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Active Users</h1>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-gray-700">
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
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No active users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.userId}</td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.roleCode}</td>
                    <td className="p-3">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
