import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchProfile } from "./redux/slices/authSlice";
import { selectAuth } from "./redux/store";

import "quill/dist/quill.snow.css";

// ── Pages ──────────────────────────────────────────────────────────────────
import HomePage        from "./pages/home/HomePage";
import BlogPage        from "./pages/blog/BlogPage";
import AuthPage        from "./pages/login/AuthPage";
import AuthorsPage     from "./pages/authors/AuthorsPage";
import AuthorProfile   from "./pages/authors/AuthorProfile";
import ProfilePage     from "./pages/profile/ProfilePage";
import FollowingPage   from "./pages/profile/FollowingPage";

// ── Author (protected) ─────────────────────────────────────────────────────
import AuthorLayout    from "./pages/author/AuthorLayout";
import AuthorDashboard from "./pages/author/AuthorDashboard";
import AuthorAddBlog   from "./pages/author/AuthorAddBlog";
import AuthorListBlog  from "./pages/author/AuthorListBlog";
import AuthorComments  from "./pages/author/AuthorComments";
import AuthorProfileEdit from "./pages/author/AuthorProfileEdit";

// ── Admin (protected) ──────────────────────────────────────────────────────
import AdminLayout      from "./pages/admin/layout/index";
import AdminDashboard   from "./pages/admin/dashboard/index";
import AdminListBlog    from "./pages/admin/blogs/index";
import AdminCategories  from "./pages/admin/categories/index";
import AdminComments    from "./pages/admin/comments/index";
import AdminUsers       from "./pages/admin/users/index";

// ── Guards ─────────────────────────────────────────────────────────────────
import AuthorGuard from "./components/guards/AuthorGuard";
import AdminGuard  from "./components/guards/AdminGuard";

function App() {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(selectAuth);

  useEffect(() => {
    if (isLogin) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isLogin]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* ── Public ──────────────────────────────────────────────────── */}
        <Route path="/"                      element={<HomePage />} />
        <Route path="/blog/:id"              element={<BlogPage />} />
        <Route path="/auth"                  element={<AuthPage />} />
        <Route path="/authors"               element={<AuthorsPage />} />
        <Route path="/authors/:authorId"     element={<AuthorProfile />} />
        <Route path="/profile"               element={<ProfilePage />} />
        <Route path="/following"             element={<FollowingPage />} />

        {/* ── Author Dashboard ────────────────────────────────────────── */}
        <Route
          path="/author"
          element={
            <AuthorGuard>
              <AuthorLayout />
            </AuthorGuard>
          }
        >
          <Route index              element={<AuthorDashboard />} />
          <Route path="add-blog"    element={<AuthorAddBlog />} />
          <Route path="my-blogs"    element={<AuthorListBlog />} />
          <Route path="comments"    element={<AuthorComments />} />
          <Route path="profile"     element={<AuthorProfileEdit />} />
        </Route>

        {/* ── Admin Dashboard ─────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index              element={<AdminDashboard />} />
          <Route path="blogs"       element={<AdminListBlog />} />
          <Route path="categories"  element={<AdminCategories />} />
          <Route path="comments"    element={<AdminComments />} />
          <Route path="users"       element={<AdminUsers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
