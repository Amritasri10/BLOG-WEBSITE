import React, { useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import BlogCard from "../components/BlogCard";
import useBlog from "../hooks/useBlog";

const Blogs = () => {
  const { blogs, loading, error, getAllBlogs } = useBlog();

  useEffect(() => {
    getAllBlogs();
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
      {blogs && blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            id={blog._id}
            isUser={localStorage.getItem("userId") === blog?.user?._id}
            title={blog.title}
            description={blog.description}
            image={blog.image}
            username={blog.user?.username}
            time={blog.createdAt}
          />
        ))
      ) : (
        <Typography textAlign="center" mt={5} color="text.secondary">
          No blogs found.
        </Typography>
      )}
    </div>
  );
};

export default Blogs;
