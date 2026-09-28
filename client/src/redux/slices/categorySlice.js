import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from "../../api/categoryApi";

export const fetchAllCategories = createAsyncThunk("category/fetchAll", async (_, { rejectWithValue }) => { try { const { data } = await getAllCategoriesApi(); return data?.data?.data || data?.data || []; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const createCategory     = createAsyncThunk("category/create",   async (payload, { rejectWithValue }) => { try { const { data } = await createCategoryApi(payload); return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const updateCategory     = createAsyncThunk("category/update",   async ({ id, payload }, { rejectWithValue }) => { try { const { data } = await updateCategoryApi(id, payload); return data?.data; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });
export const deleteCategory     = createAsyncThunk("category/delete",   async (id,      { rejectWithValue }) => { try { await deleteCategoryApi(id); return id; } catch (e) { return rejectWithValue(e.response?.data?.message || "Failed"); } });

const categorySlice = createSlice({
  name: "category",
  initialState: { categories: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllCategories.fulfilled, (s, { payload }) => { s.loading = false; s.categories = payload; })
      .addCase(fetchAllCategories.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(createCategory.fulfilled, (s, { payload }) => { if (payload) s.categories.push(payload); })
      .addCase(updateCategory.fulfilled, (s, { payload }) => { if (payload) { const idx = s.categories.findIndex((c) => c._id === payload._id); if (idx !== -1) s.categories[idx] = payload; } })
      .addCase(deleteCategory.fulfilled, (s, { payload }) => { s.categories = s.categories.filter((c) => c._id !== payload); });
  },
});

export default categorySlice.reducer;
