import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBlogsApi, getSingleBlogApi, getAuthorBlogsApi,
  getMyBlogsApi, createBlogApi, updateBlogApi, deleteBlogApi,
  togglePublishApi, toggleLikeApi, toggleSaveApi,
} from "../../api/blogApi";

export const fetchAllBlogs    = createAsyncThunk("blog/fetchAll",    async (params = "", { rejectWithValue }) => { try { const { data } = await getAllBlogsApi(params); return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchSingleBlog  = createAsyncThunk("blog/fetchSingle", async (id,         { rejectWithValue }) => { try { const { data } = await getSingleBlogApi(id);      return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchAuthorBlogs = createAsyncThunk("blog/authorBlogs", async (authorId,   { rejectWithValue }) => { try { const { data } = await getAuthorBlogsApi(authorId); return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const fetchMyBlogs     = createAsyncThunk("blog/myBlogs",     async (_,          { rejectWithValue }) => { try { const { data } = await getMyBlogsApi();             return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const createBlog       = createAsyncThunk("blog/create",      async (formData,   { rejectWithValue }) => { try { const { data } = await createBlogApi(formData);     return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const updateBlog       = createAsyncThunk("blog/update",      async ({ id, payload }, { rejectWithValue }) => { try { const { data } = await updateBlogApi(id, payload); return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const deleteBlog       = createAsyncThunk("blog/delete",      async (id,         { rejectWithValue }) => { try { await deleteBlogApi(id); return id; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const togglePublish    = createAsyncThunk("blog/publish",     async (id,         { rejectWithValue }) => { try { const { data } = await togglePublishApi(id);       return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const toggleLike       = createAsyncThunk("blog/like",        async (id,         { rejectWithValue }) => { try { const { data } = await toggleLikeApi(id);          return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const toggleSave       = createAsyncThunk("blog/save",        async (id,         { rejectWithValue }) => { try { const { data } = await toggleSaveApi(id);          return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });

const patchBlog = (state, payload) => {
  if (!payload) return;
  const patchList = (list) => { const i = list.findIndex((b) => b._id === payload._id); if (i !== -1) list[i] = payload; };
  patchList(state.blogs);
  patchList(state.myBlogs);
  if (state.currentBlog?._id === payload._id) state.currentBlog = payload;
};

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [], myBlogs: [], authorBlogs: [], currentBlog: null,
    searchInput: "", loading: false, error: null,
  },
  reducers: {
    setSearchInput(state, { payload }) { state.searchInput = payload; },
    clearCurrentBlog(state) { state.currentBlog = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending,    (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllBlogs.fulfilled,  (s, { payload }) => { s.loading = false; s.blogs = payload; })
      .addCase(fetchAllBlogs.rejected,   (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(fetchSingleBlog.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(fetchSingleBlog.fulfilled,(s, { payload }) => { s.loading = false; s.currentBlog = payload; })
      .addCase(fetchSingleBlog.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(fetchAuthorBlogs.fulfilled, (s, { payload }) => { s.authorBlogs = payload; })

      .addCase(fetchMyBlogs.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyBlogs.fulfilled, (s, { payload }) => { s.loading = false; s.myBlogs = payload; })
      .addCase(fetchMyBlogs.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(createBlog.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(createBlog.fulfilled, (s, { payload }) => { s.loading = false; if (payload) { s.myBlogs.unshift(payload); if (payload.isPublished) s.blogs.unshift(payload); } })
      .addCase(createBlog.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(updateBlog.fulfilled, (s, { payload }) => { patchBlog(s, payload); })
      .addCase(deleteBlog.fulfilled, (s, { payload }) => { s.myBlogs = s.myBlogs.filter((b) => b._id !== payload); s.blogs = s.blogs.filter((b) => b._id !== payload); })
      .addCase(togglePublish.fulfilled, (s, { payload }) => { patchBlog(s, payload); })
      .addCase(toggleLike.fulfilled, (s, { payload, meta }) => {
        const blogId = meta.arg;
        const updateList = (list) => {
          const i = list.findIndex((b) => b._id === blogId);
          if (i !== -1) {
            list[i] = {
              ...list[i],
              likes: Array(payload.likesCount).fill(null), // count update
              isLiked: payload.isLiked,
            };
          }
        };
        updateList(s.blogs);
        updateList(s.myBlogs);
        updateList(s.authorBlogs);
        if (s.currentBlog?._id === blogId) {
          s.currentBlog = {
            ...s.currentBlog,
            likes: Array(payload.likesCount).fill(null),
            isLiked: payload.isLiked,
          };
        }
      })
      .addCase(toggleSave.fulfilled, (s, { payload, meta }) => {
        const blogId = meta.arg;
        const updateList = (list) => {
          const i = list.findIndex((b) => b._id === blogId);
          if (i !== -1) list[i] = { ...list[i], isSaved: payload.isSaved };
        };
        updateList(s.blogs);
        updateList(s.myBlogs);
        updateList(s.authorBlogs);
        if (s.currentBlog?._id === blogId) {
          s.currentBlog = { ...s.currentBlog, isSaved: payload.isSaved };
        }
      });
  },
});

export const { setSearchInput, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
