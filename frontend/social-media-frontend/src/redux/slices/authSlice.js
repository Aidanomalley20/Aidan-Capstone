import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
} from "../../services/authService.js";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiLogin(userData);
      console.log("✅ Login API Response:", response);

      if (!response || !response.token) {
        console.error("❌ Invalid response from server:", response);
        throw new Error("Invalid response from server");
      }

      sessionStorage.setItem("user", JSON.stringify(response.user));
      sessionStorage.setItem("token", response.token);

      return response;
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiRegister(userData);
      console.log("✅ Registration API Response:", response);
      return response;
    } catch (error) {
      console.error(
        "❌ Registration failed:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Registration failed.");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await apiLogout();
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null,
    token: sessionStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
