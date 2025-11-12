"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";
import { Mail } from "lucide-react";
import "../../components/forgotpassword.css";




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
      await axiosInstance.get(`/auth/forgot-password?email=${email}`);
      setMessage("✅ OTP sent to your email. Please check your inbox.");
      localStorage.setItem("resetEmail", email);
      setTimeout(() => router.push("/auth/verifyotp"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="brand-header">
        <h1>Attendance Management System</h1>
        <p>Secure password recovery portal</p>
      </div>

      <div className="forgot-card">
        <div className="icon-box">
          <Mail size={28} />
        </div>

        <h2>Forgot Password</h2>
        <p>
          Enter your registered email to receive an OTP for password reset.
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="example@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {message && (
          <div
            className={`status-message ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div
          onClick={() => router.push("/auth/login")}
          className="back-login"
        >
          ← Back to Login
        </div>
      </div>
    </div>
  );
}
