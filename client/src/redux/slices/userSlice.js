import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSavedBlogsApi, getLikedBlogsApi, getFollowingAuthorsApi, toggleFollowAuthorApi } from "../../api/userApi";

export const fetchSavedBlogs      = createAsyncThunk("user/saved",    async (_, { rejectWithValue }) => { try { const { data } = await getSavedBlogsApi();          return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchLikedBlogs      = createAsyncThunk("user/liked",    async (_, { rejectWithValue }) => { try { const { data } = await getLikedBlogsApi();          return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchFollowingAuthors = createAsyncThunk("user/following", async (_, { rejectWithValue }) => { try { const { data } = await getFollowingAuthorsApi();   return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const toggleFollowAuthor   = createAsyncThunk("user/follow",   async (authorId, { rejectWithValue }) => { try { const { data } = await toggleFollowAuthorApi(authorId); return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });

const userSlice = createSlice({
  name: "user",
  initialState: { savedBlogs: [], likedBlogs: [], followingAuthors: [], loading: false, error: null },
  reducers: { clearUserData: (s) => { s.savedBlogs = []; s.likedBlogs = []; s.followingAuthors = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedBlogs.fulfilled,      (s, { payload }) => { s.savedBlogs = payload; })
      .addCase(fetchLikedBlogs.fulfilled,      (s, { payload }) => { s.likedBlogs = payload; })
      .addCase(fetchFollowingAuthors.pending,  (s) => { s.loading = true; })
      .addCase(fetchFollowingAuthors.fulfilled,(s, { payload }) => { s.loading = false; s.followingAuthors = payload; })
      .addCase(fetchFollowingAuthors.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(toggleFollowAuthor.fulfilled,   (s, { payload }) => {
        if (!payload) return;
        // payload is the updated user.following list or a single author — refresh via re-fetch
        // For now just mark by re-setting from payload if it's an array
        if (Array.isArray(payload)) s.followingAuthors = payload;
      });
  },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
