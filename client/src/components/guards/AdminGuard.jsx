import React from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/store";
import AdminLoginPage from "../../pages/admin/AdminLoginPage";

// Shows AdminLoginPage if not logged in OR not an admin
const AdminGuard = ({ children }) => {
  const { isLogin, user } = useSelector(selectAuth);

  if (!isLogin || !user) return <AdminLoginPage />;
  if (user.role !== "admin") return <AdminLoginPage />;

  return children;
};

export default AdminGuard;
