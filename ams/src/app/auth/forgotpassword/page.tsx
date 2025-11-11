"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await axiosInstance.get(`/auth/forgot-password?email=${email}`);
      setMessage("✅ OTP sent to your email. Check your inbox.");
      
      localStorage.setItem("resetEmail", email);
      setTimeout(() => router.push("/auth/verifyotp"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Failed to send OTP.");
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
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {message && <p className="text-center text-sm mt-3">{message}</p>}
      </form>
    </div>
  );
}
