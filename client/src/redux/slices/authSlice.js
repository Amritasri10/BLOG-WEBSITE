import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi, registerUserApi, getProfileApi } from "../../api/authApi";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await registerUserApi(payload);
      return data.data; // { _id, username, email, role, authToken }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await loginUserApi(payload);
      return data.data; // { _id, username, email, role, authToken }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getProfileApi();
      return data.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

const persist = (user) => {
  localStorage.setItem("authToken", user.authToken);
  localStorage.setItem("userId", user._id);
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: !!localStorage.getItem("authToken"),
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLogin = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userActivity");
    },
  },
  extraReducers: (builder) => {
    // ── Register → auto-login ─────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;
        state.user = action.payload;
        persist(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Login ─────────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;
        state.user = action.payload;
        persist(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Profile ───────────────────────────────────────────────────────────────
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
