import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBlogsApi,
  getSingleBlogApi,
  getUserBlogsApi,
  createBlogApi,
  updateBlogApi,
  deleteBlogApi,
} from "../../api/blogApi";

export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getAllBlogsApi(params || "");
      // getAllBlogs returns { data: { data: [...], total, totalPages } }
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch blogs");
    }
  }
);

export const fetchSingleBlog = createAsyncThunk(
  "blog/fetchSingle",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getSingleBlogApi(id);
      return data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch blog");
    }
  }
);

export const fetchUserBlogs = createAsyncThunk(
  "blog/fetchUserBlogs",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await getUserBlogsApi(userId);
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user blogs");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blog/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createBlogApi(payload);
      return data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateBlogApi(id, payload);
      return data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBlogApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete blog");
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    userBlogs: [],
    currentBlog: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending,    (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllBlogs.fulfilled,  (state, { payload }) => { state.loading = false; state.blogs = payload; })
      .addCase(fetchAllBlogs.rejected,   (state, { payload }) => { state.loading = false; state.error = payload; });

    builder
      .addCase(fetchSingleBlog.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSingleBlog.fulfilled, (state, { payload }) => { state.loading = false; state.currentBlog = payload; })
      .addCase(fetchSingleBlog.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });

    builder
      .addCase(fetchUserBlogs.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserBlogs.fulfilled, (state, { payload }) => { state.loading = false; state.userBlogs = payload; })
      .addCase(fetchUserBlogs.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });

    builder
      .addCase(createBlog.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(createBlog.fulfilled, (state, { payload }) => { state.loading = false; if (payload) state.blogs.unshift(payload); })
      .addCase(createBlog.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });

    builder
      .addCase(updateBlog.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(updateBlog.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentBlog = payload;
        const idx = state.userBlogs.findIndex((b) => b._id === payload?._id);
        if (idx !== -1) state.userBlogs[idx] = payload;
      })
      .addCase(updateBlog.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });

    builder
      .addCase(deleteBlog.fulfilled, (state, { payload }) => {
        state.userBlogs = state.userBlogs.filter((b) => b._id !== payload);
        state.blogs     = state.blogs.filter((b) => b._id !== payload);
      })
      .addCase(deleteBlog.rejected, (state, { payload }) => { state.error = payload; });
  },
});

export default blogSlice.reducer;
