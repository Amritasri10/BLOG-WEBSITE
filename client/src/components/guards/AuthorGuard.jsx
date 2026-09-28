import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectAuth } from "../../redux/store";

// Agar Author ya Admin nahi hai toh /auth pe redirect
const AuthorGuard = ({ children }) => {
  const { isLogin, user } = useSelector(selectAuth);

  if (!isLogin || !user) return <Navigate to="/auth" replace />;
  if (user.role !== "Author" && user.role !== "Admin") return <Navigate to="/auth" replace />;

  return children;
};

export default AuthorGuard;

