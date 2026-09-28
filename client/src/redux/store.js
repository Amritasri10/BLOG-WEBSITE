import { configureStore } from "@reduxjs/toolkit";
import authReducer    from "./slices/authSlice";
import blogReducer    from "./slices/blogSlice";
import commentReducer from "./slices/commentSlice";
import categoryReducer from "./slices/categorySlice";
import authorReducer  from "./slices/authorSlice";
import adminReducer   from "./slices/adminSlice";
import userReducer    from "./slices/userSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    blog:     blogReducer,
    comment:  commentReducer,
    category: categoryReducer,
    author:   authorReducer,
    admin:    adminReducer,
    user:     userReducer,
    profile:  profileReducer,
  },
});

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectAuth     = (state) => state.auth;
export const selectBlog     = (state) => state.blog;
export const selectComment  = (state) => state.comment;
export const selectCategory = (state) => state.category;
export const selectAuthor   = (state) => state.author;
export const selectAdmin    = (state) => state.admin;
export const selectUser     = (state) => state.user;
export const selectProfile  = (state) => state.profile;
