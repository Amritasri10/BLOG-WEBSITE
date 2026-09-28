import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminStatsApi } from "../../api/adminApi";
import { getAllUsersApi, updateUserRoleApi, deleteUserApi } from "../../api/authApi";

export const fetchAdminStats = createAsyncThunk("admin/stats",   async (_, { rejectWithValue }) => { try { const { data } = await getAdminStatsApi(); return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchAllUsers   = createAsyncThunk("admin/users",   async (role = "", { rejectWithValue }) => { try { const { data } = await getAllUsersApi(role); return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const updateUserRole  = createAsyncThunk("admin/setRole", async ({ userId, role }, { rejectWithValue }) => { try { const { data } = await updateUserRoleApi(userId, role); return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const deleteUser      = createAsyncThunk("admin/delUser", async (userId, { rejectWithValue }) => { try { await deleteUserApi(userId); return userId; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });

const adminSlice = createSlice({
  name: "admin",
  initialState: { stats: null, users: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminStats.fulfilled, (s, { payload }) => { s.loading = false; s.stats = payload; })
      .addCase(fetchAdminStats.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(fetchAllUsers.pending,     (s) => { s.loading = true; })
      .addCase(fetchAllUsers.fulfilled,   (s, { payload }) => { s.loading = false; s.users = payload; })
      .addCase(fetchAllUsers.rejected,    (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(updateUserRole.fulfilled,  (s, { payload }) => { if (!payload) return; const i = s.users.findIndex((u) => u._id === payload._id); if (i !== -1) s.users[i] = payload; })
      .addCase(deleteUser.fulfilled,      (s, { payload }) => { s.users = s.users.filter((u) => u._id !== payload); });
  },
});

export default adminSlice.reducer;
