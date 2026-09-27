import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCommentsByBlogApi, addCommentApi, deleteCommentApi } from "../../api/blogApi";

export const fetchComments = createAsyncThunk(
  "comment/fetch",
  async (blogId, { rejectWithValue }) => {
    try {
      const { data } = await getCommentsByBlogApi(blogId);
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch comments");
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/add",
  async ({ blogId, content }, { rejectWithValue }) => {
    try {
      const { data } = await addCommentApi(blogId, content);
      return data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add comment");
    }
  }
);

export const removeComment = createAsyncThunk(
  "comment/remove",
  async (commentId, { rejectWithValue }) => {
    try {
      await deleteCommentApi(commentId);
      return commentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete comment");
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchComments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // add
    builder
      .addCase(addComment.pending, (state) => { state.submitting = true; })
      .addCase(addComment.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload) state.comments.unshift(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });

    // remove
    builder
      .addCase(removeComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
