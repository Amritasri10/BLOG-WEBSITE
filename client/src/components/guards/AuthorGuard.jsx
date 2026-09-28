import React from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/store";
import AuthPage from "../../pages/login/AuthPage";
import AuthorAuthPage from "../../pages/author/AuthorAuthPage";

// Shows AuthorAuthPage if not logged in OR not an author/admin
const AuthorGuard = ({ children }) => {
  const { isLogin, user } = useSelector(selectAuth);

  if (!isLogin) return <AuthorAuthPage />;
  if (user && user.role !== "author" && user.role !== "admin") return <AuthorAuthPage />;

  return children;
};

export default AuthorGuard;
