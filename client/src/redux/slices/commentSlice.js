import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCommentsByBlogApi, addCommentApi, approveCommentApi, deleteCommentApi } from "../../api/commentApi";

export const fetchComments  = createAsyncThunk("comment/fetch",   async (blogId,             { rejectWithValue }) => { try { const { data } = await getCommentsByBlogApi(blogId);         return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const addComment     = createAsyncThunk("comment/add",     async ({ blogId, content }, { rejectWithValue }) => { try { const { data } = await addCommentApi(blogId, content);        return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const approveComment = createAsyncThunk("comment/approve", async (id,                 { rejectWithValue }) => { try { const { data } = await approveCommentApi(id);                 return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const removeComment  = createAsyncThunk("comment/remove",  async (id,                 { rejectWithValue }) => { try { await deleteCommentApi(id); return id; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });

const commentSlice = createSlice({
  name: "comment",
  initialState: { comments: [], loading: false, submitting: false, error: null },
  reducers: { clearComments: (s) => { s.comments = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending,    (s) => { s.loading = true; s.error = null; })
      .addCase(fetchComments.fulfilled,  (s, { payload }) => { s.loading = false; s.comments = payload; })
      .addCase(fetchComments.rejected,   (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(addComment.pending,       (s) => { s.submitting = true; })
      .addCase(addComment.fulfilled,     (s, { payload }) => { s.submitting = false; if (payload) s.comments.unshift(payload); })
      .addCase(addComment.rejected,      (s, { payload }) => { s.submitting = false; s.error = payload; })
      .addCase(approveComment.fulfilled, (s, { payload }) => { if (!payload) return; const i = s.comments.findIndex((c) => c._id === payload._id); if (i !== -1) s.comments[i] = payload; })
      .addCase(removeComment.fulfilled,  (s, { payload }) => { s.comments = s.comments.filter((c) => c._id !== payload); });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
