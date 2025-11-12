"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { loginThunk, registerThunk, logoutAction } from "@/app/redux/store/slices/authSlice";
import type { LoginData, RegisterData } from "@/types/page";

type AuthContextType = {
  user: any;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // ✅ Restore session or redirect if needed
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const login = async (data: LoginData) => {
    try {
      const result = await dispatch(loginThunk(data)).unwrap();
      console.log("✅ Login successful:", result);
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const result = await dispatch(registerThunk(data)).unwrap();
      console.log("✅ Registered successfully:", result);
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Registration failed:", err);
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
