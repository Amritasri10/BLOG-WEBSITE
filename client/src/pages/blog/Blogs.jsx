import React, { useEffect, useState } from "react";
import {
  Box, Chip, CircularProgress, Divider, Stack, Typography,
} from "@mui/material";
import BlogCard from "../../components/BlogCard";
import useBlog from "../../Hooks/useBlog";
import useCategory from "../../Hooks/useCategory";

const Blogs = () => {
  const { blogs, loading, getAllBlogs } = useBlog();
  const { categories, getCategories } = useCategory();
  const [activeCategory, setActiveCategory] = useState(null); // null = All

  useEffect(() => {
    getCategories();
    getAllBlogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryClick = (catId) => {
    const selected = catId === activeCategory ? null : catId;
    setActiveCategory(selected);
    const params = selected ? `?category=${selected}` : "";
    getAllBlogs(params);
  };

  return (
    <Box display="flex" minHeight="80vh">
      {/* ── Category Sidebar ─────────────────────────────────────── */}
      <Box
        sx={{
          width: 220,
          minWidth: 220,
          borderRight: "1px solid #e0e0e0",
          pt: 3,
          px: 2,
          bgcolor: "#fafafa",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Categories
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          <Chip
            label="All"
            onClick={() => handleCategoryClick(null)}
            color={!activeCategory ? "primary" : "default"}
            sx={{ justifyContent: "flex-start", cursor: "pointer" }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat._id}
              label={cat.name}
              onClick={() => handleCategoryClick(cat._id)}
              color={activeCategory === cat._id ? "primary" : "default"}
              sx={{ justifyContent: "flex-start", cursor: "pointer" }}
            />
          ))}
        </Stack>
      </Box>

      {/* ── Blog List ─────────────────────────────────────────────── */}
      <Box flex={1} py={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress />
          </Box>
        ) : blogs.length > 0 ? (
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
              category={blog.category?.name}
            />
          ))
        ) : (
          <Typography textAlign="center" mt={8} color="text.secondary">
            No blogs found in this category.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Blogs;
