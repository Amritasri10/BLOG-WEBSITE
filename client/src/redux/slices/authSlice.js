import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { registerUserApi, registerAuthorApi, loginUserApi, getProfileApi, updateProfileApi, updatePasswordApi } from "../../api/authApi";

// ── Thunks ────────────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await registerUserApi(payload);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Registration failed"); }
});

export const registerAuthor = createAsyncThunk("auth/registerAuthor", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await registerAuthorApi(payload);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Author registration failed"); }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await loginUserApi(payload);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Login failed"); }
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const { data } = await getProfileApi();
    return data.data?.user || data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to fetch profile"); }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await updateProfileApi(payload);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to update profile"); }
});

export const updatePassword = createAsyncThunk("auth/updatePassword", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await updatePasswordApi(payload);
    return data.message;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to update password"); }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: !!Cookies.get("TOKEN"),
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLogin = false;
      state.user = null;
      state.error = null;
      Cookies.remove("TOKEN");
      localStorage.removeItem("authToken");
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const handleAuth = (state, { payload }) => {
      state.loading = false;
      state.isLogin = true;
      state.user = payload;
      // Cookie me save karo taaki Helpers/index.js use kar sake
      Cookies.set("TOKEN", payload.authToken, { expires: 365 });
      localStorage.setItem("authToken", payload.authToken);
    };

    builder
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, handleAuth)
      .addCase(registerUser.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });

    builder
      .addCase(registerAuthor.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerAuthor.fulfilled, handleAuth)
      .addCase(registerAuthor.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });

    builder
      .addCase(loginUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, handleAuth)
      .addCase(loginUser.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });

    builder
      .addCase(fetchProfile.fulfilled, (s, { payload }) => { s.user = payload; })
      .addCase(fetchProfile.rejected,  (s) => {
        s.isLogin = false; s.user = null;
        Cookies.remove("TOKEN");
        localStorage.removeItem("authToken");
      });

    builder.addCase(updateProfile.fulfilled, (s, { payload }) => {
      if (payload) s.user = { ...s.user, ...payload };
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
