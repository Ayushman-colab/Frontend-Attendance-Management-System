"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axiosInstance.post("/auth/login", formData);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || "❌ Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgotpassword");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <input
          name="usernameOrEmail"
          placeholder="Username or Email"
          onChange={handleChange}
          value={formData.usernameOrEmail}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="text-center text-sm mt-3 text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
