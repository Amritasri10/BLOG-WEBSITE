import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategoriesApi } from "../../api/blogApi";

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getAllCategoriesApi();
      // crudFactory returns { data: { data: [...] } }
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
