import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "@/services/page";
import type { AuthResponse, LoginData, RegisterData, User } from "@/types/page";
import axiosInstance from "@/app/api/axiosInstance";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// 🔹 LOGIN THUNK
export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginData,
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.login(data); // returns { user, tokens... }
    return res; // ✅ works because authService already returns .data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// 🔹 REGISTER THUNK
export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    return res;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Register failed");
  }
});

// 🔹 LOGOUT
export const logoutAction = createAsyncThunk("auth/logout", async () => {
  axiosInstance.defaults.headers.Authorization = "";
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setTokens } = authSlice.actions;
export default authSlice.reducer;
