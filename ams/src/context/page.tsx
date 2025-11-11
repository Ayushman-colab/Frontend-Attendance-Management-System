"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, LoginData, RegisterData } from "../types/page";
import authService from "@/services/page";
type AuthContextType = {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Restore user from localStorage when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (data: LoginData) => {
    const res = await authService.login(data);

    // ✅ Match backend fields
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.user));

    setUser(res.user);
    router.push("/dashboard");
  };

  const register = async (data: RegisterData) => {
    const res = await authService.register(data);

    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.user));

    setUser(res.user);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login"); // ✅ simpler path
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
