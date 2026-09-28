import { createSlice } from "@reduxjs/toolkit";

const load = () => { try { return JSON.parse(localStorage.getItem("userActivity") || "{}"); } catch { return {}; } };
const save = (a) => localStorage.setItem("userActivity", JSON.stringify(a));

const profileSlice = createSlice({
  name: "profile",
  initialState: { activity: load() },
  reducers: {
    recordView(state, { payload }) {
      if (!state.activity.viewedBlogs) state.activity.viewedBlogs = [];
      if (!state.activity.viewedBlogs.find((b) => b._id === payload._id)) {
        state.activity.viewedBlogs.unshift(payload);
        if (state.activity.viewedBlogs.length > 20) state.activity.viewedBlogs.pop();
        save(state.activity);
      }
    },
    recordComment(state, { payload }) {
      if (!state.activity.commentedBlogs) state.activity.commentedBlogs = [];
      if (!state.activity.commentedBlogs.find((b) => b._id === payload._id)) {
        state.activity.commentedBlogs.unshift(payload);
        save(state.activity);
      }
    },
    clearActivity(state) { state.activity = {}; localStorage.removeItem("userActivity"); },
  },
});

export const { recordView, recordComment, clearActivity } = profileSlice.actions;
export default profileSlice.reducer;
