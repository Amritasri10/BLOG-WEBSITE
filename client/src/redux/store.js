import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import categoryReducer from "./slices/categorySlice";
import commentReducer from "./slices/commentSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    category: categoryReducer,
    comment: commentReducer,
    profile: profileReducer,
  },
});

export const selectAuth     = (state) => state.auth;
export const selectBlog     = (state) => state.blog;
export const selectCategory = (state) => state.category;
export const selectComment  = (state) => state.comment;
export const selectProfile  = (state) => state.profile;
