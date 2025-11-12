"use client";

import "../../components/verifyotp.css";  // ✅ Correct import
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
      const response = await axiosInstance.post(`/auth/verify-otp?email=${savedEmail}&otp=${otp}`);
      const resetToken = response.data.resetToken;
      localStorage.setItem("resetToken", resetToken);
      setMessage("✅ OTP verified successfully!");
      setTimeout(() => router.push("/auth/resetpassword"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verifyotp-page">
      <form onSubmit={handleVerify} className="verifyotp-card">
        <h2>Verify OTP</h2>
        <p>Enter the OTP sent to your email</p>

        <input
          placeholder="••••••"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="verifyotp-input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="verifyotp-btn"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && (
          <p
            className={`verifyotp-message ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
