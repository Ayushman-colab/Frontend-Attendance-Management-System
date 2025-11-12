"use client";

import "../../components/resetpassword.css";  // ✅ Correct path
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
    <div className="resetpassword-page">
      <form onSubmit={handleSubmit} className="resetpassword-card">
        <h2>Reset Password</h2>
        <p>Enter and confirm your new password below</p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="resetpassword-input"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="resetpassword-input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="resetpassword-btn"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {message && (
          <p
            className={`resetpassword-message ${
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
