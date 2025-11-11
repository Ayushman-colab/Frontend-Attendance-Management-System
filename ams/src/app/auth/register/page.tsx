"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    roleCode: "MEMBER", // ✅ default role
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "roleCode" ? value.toUpperCase() : value, // ✅ always uppercase
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // ✅ normalize payload before sending
    const payload = {
      ...formData,
      roleCode: (formData.roleCode || "MEMBER").trim().toUpperCase(),
    };

    console.log("🔍 Register payload:", payload); // Debug log

    try {
      const response = await axiosInstance.post("/auth/register", payload);

      console.log("✅ Register success:", response.data);

      if (response.status === 201) {
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error.response?.data || error);
      setMessage(
        error.response?.data?.message || "❌ Registration failed. Try again."
      );
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
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* Username */}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* First name */}
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          value={formData.firstName}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* Last name */}
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          value={formData.lastName}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Role Code (optional input for testing) */}
        <input
          name="roleCode"
          placeholder="Role Code (e.g., MEMBER, ADMIN)"
          onChange={handleChange}
          value={formData.roleCode}
          className="w-full mb-4 p-2 border rounded uppercase"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-3 text-gray-700">{message}</p>
        )}

        {/* Login redirect */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
