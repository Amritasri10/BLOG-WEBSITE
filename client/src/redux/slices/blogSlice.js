import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBlogsApi,
  getSingleBlogApi,
  getUserBlogsApi,
  createBlogApi,
  updateBlogApi,
  deleteBlogApi,
} from "../../api/blogApi";

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getAllBlogsApi();
      return data.data; // array of blogs
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
      return data.data; // single blog object
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
      return data.data; // array of user's blogs
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
      return data.data;
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
      return data.data;
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
      return id; // return id to remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete blog");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

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
    // ── Fetch All ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Fetch Single ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchSingleBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchSingleBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Fetch User Blogs ──────────────────────────────────────────────────────
    builder
      .addCase(fetchUserBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.userBlogs = action.payload;
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Create ────────────────────────────────────────────────────────────────
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Update ────────────────────────────────────────────────────────────────
    builder
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
        // also update in userBlogs list if present
        const idx = state.userBlogs.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.userBlogs[idx] = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Delete ────────────────────────────────────────────────────────────────
    builder
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.userBlogs = state.userBlogs.filter((b) => b._id !== action.payload);
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
