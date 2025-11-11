"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";

export default function VerifyOtpPage() {
  const router = useRouter();
  const savedEmail = typeof window !== "undefined" ? localStorage.getItem("resetEmail") : "";
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // ✅ Backend expects email + otp as request params
      const response = await axiosInstance.post(`/auth/verify-otp?email=${savedEmail}&otp=${otp}`);

      const resetToken = response.data.resetToken; // store backend token if returned
      localStorage.setItem("resetToken", resetToken);

      setMessage("✅ OTP verified successfully!");
      setTimeout(() => router.push("/auth/resetpassword"));
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Verify OTP</h2>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && <p className="text-center text-sm mt-3">{message}</p>}
      </form>
    </div>
  );
}
