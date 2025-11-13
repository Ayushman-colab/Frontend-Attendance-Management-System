// 📁 src/services/authService.ts
import axiosInstance from "@/app/api/axiosInstance";
import type { AuthResponse, LoginData, RegisterData } from "@/types/page";

const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/login", data);

    if (res.data.accessToken && res.data.refreshToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }

    return res.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  sendOtp: async (email: string) => {
    const res = await axiosInstance.post("/auth/send-otp", { email });
    return res.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
    return res.data;
  },

  resetPassword: async (email: string, password: string) => {
    const res = await axiosInstance.post("/auth/reset-password", {
      email,
      password,
    });
    return res.data;
  },

  countUsers: async () => {
    const res = await axiosInstance.get("/users/stats/count");
    return res.data; 
  },

  countActiveUsers: async () => {
    const res = await axiosInstance.get("/users/stats/active-count");
    return res.data; 
  },
  
  countInActiveUsers: async () => {
    const res = await axiosInstance.get("/users/stats/inactive-count");
    return res.data; 
  },
};

export default authService;
