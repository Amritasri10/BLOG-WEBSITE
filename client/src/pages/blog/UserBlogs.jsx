import React, { useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import BlogCard from "../../components/BlogCard";
import useBlog from "../../hooks/useBlog";

const UserBlogs = () => {
  const { userBlogs, loading, error, getMyBlogs } = useBlog();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) getMyBlogs(userId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={5}>
        {error}
      </Typography>
    );
  }

  return (
    <div>
      {userBlogs && userBlogs.length > 0 ? (
        userBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            id={blog._id}
            isUser={true}
            title={blog.title}
            description={blog.description}
            image={blog.image}
            username={blog.user?.username}
            time={blog.createdAt}
          />
        ))
      ) : (
        <Typography textAlign="center" mt={5} variant="h5">
          You haven&apos;t created a blog yet.
        </Typography>
      )}
    </div>
  );
};

export default UserBlogs;
