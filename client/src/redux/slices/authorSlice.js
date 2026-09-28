import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllAuthorsApi, getPublicAuthorProfileApi, getAuthorDashboardApi, getPendingCommentsApi } from "../../api/authorApi";

export const fetchAllAuthors        = createAsyncThunk("author/fetchAll",        async (_, { rejectWithValue }) => { try { const { data } = await getAllAuthorsApi();              return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchPublicAuthorProfile = createAsyncThunk("author/publicProfile", async (id, { rejectWithValue }) => { try { const { data } = await getPublicAuthorProfileApi(id);    return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchAuthorDashboard   = createAsyncThunk("author/dashboard",       async (_, { rejectWithValue }) => { try { const { data } = await getAuthorDashboardApi();         return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchPendingComments   = createAsyncThunk("author/pendingComments", async (_, { rejectWithValue }) => { try { const { data } = await getPendingCommentsApi();         return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });

const authorSlice = createSlice({
  name: "author",
  initialState: { authors: [], publicProfile: null, dashboard: null, pendingComments: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAuthors.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllAuthors.fulfilled, (s, { payload }) => { s.loading = false; s.authors = payload; })
      .addCase(fetchAllAuthors.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(fetchPublicAuthorProfile.pending,   (s) => { s.loading = true; s.publicProfile = null; })
      .addCase(fetchPublicAuthorProfile.fulfilled, (s, { payload }) => { s.loading = false; s.publicProfile = payload; })
      .addCase(fetchPublicAuthorProfile.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(fetchAuthorDashboard.pending,   (s) => { s.loading = true; })
      .addCase(fetchAuthorDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.dashboard = payload; })
      .addCase(fetchAuthorDashboard.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(fetchPendingComments.fulfilled, (s, { payload }) => { s.pendingComments = payload; });
  },
});

export default authorSlice.reducer;
