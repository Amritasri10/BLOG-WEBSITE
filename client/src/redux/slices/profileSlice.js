import { createSlice } from "@reduxjs/toolkit";
import { loginUser, fetchProfile } from "./authSlice";

// Tracks blogs the user has viewed/commented — stored in localStorage for persistence
const loadActivity = () => {
  try {
    return JSON.parse(localStorage.getItem("userActivity") || "{}");
  } catch {
    return {};
  }
};

const saveActivity = (activity) => {
  localStorage.setItem("userActivity", JSON.stringify(activity));
};

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    activity: loadActivity(), // { viewedBlogs: [...], commentedBlogs: [...] }
  },
  reducers: {
    recordView(state, action) {
      const blog = action.payload; // { _id, title, image, category }
      if (!state.activity.viewedBlogs) state.activity.viewedBlogs = [];
      const exists = state.activity.viewedBlogs.find((b) => b._id === blog._id);
      if (!exists) {
        state.activity.viewedBlogs.unshift(blog);
        if (state.activity.viewedBlogs.length > 20)
          state.activity.viewedBlogs.pop(); // keep last 20
        saveActivity(state.activity);
      }
    },
    recordComment(state, action) {
      const blog = action.payload; // { _id, title, image, category }
      if (!state.activity.commentedBlogs) state.activity.commentedBlogs = [];
      const exists = state.activity.commentedBlogs.find((b) => b._id === blog._id);
      if (!exists) {
        state.activity.commentedBlogs.unshift(blog);
        saveActivity(state.activity);
      }
    },
    clearActivity(state) {
      state.activity = {};
      localStorage.removeItem("userActivity");
    },
  },
  extraReducers: (builder) => {
    // Clear activity on logout handled in authSlice logout action
    builder.addCase(loginUser.fulfilled, (state) => {
      state.activity = loadActivity();
    });
  },
});

export const { recordView, recordComment, clearActivity } = profileSlice.actions;
export default profileSlice.reducer;
