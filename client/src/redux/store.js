import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
  },
});

// ── Selector helpers ──────────────────────────────────────────────────────────
export const selectAuth = (state) => state.auth;
export const selectBlog = (state) => state.blog;
