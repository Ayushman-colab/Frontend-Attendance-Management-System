"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { loginThunk } from "@/app/redux/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk(formData)); // Redux thunk handles API + token storage
  };

  // ✅ Redirect if already logged in
 useEffect(() => {
  console.log("Auth changed:", isAuthenticated);
  if (isAuthenticated) {
    console.log("✅ Redirecting to /dashboard...");
    router.push("/dashboard");
  }
}, [isAuthenticated, router]);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Sign in to your account to continue</p>

        <input
          name="usernameOrEmail"
          placeholder="Username or Email"
          onChange={handleChange}
          value={formData.usernameOrEmail}
          className="login-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="login-input"
          required
        />

        <div className="login-forgot">
          <button type="button" onClick={() => router.push("/auth/forgotpassword")}>
            Forgot Password?
          </button>
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="login-message text-red-500">{error}</p>}
      </form>
    </div>
  );
}
