"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetToken = typeof window !== "undefined" ? localStorage.getItem("resetToken") : null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // ✅ Backend expects resetToken & newPassword as request params
      await axiosInstance.post(`/auth/reset-password?resetToken=${resetToken}&newPassword=${password}`);

      setMessage("✅ Password reset successful! Redirecting to login...");
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetEmail");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {message && <p className="text-center text-sm mt-3">{message}</p>}
      </form>
    </div>
  );
}
