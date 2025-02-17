import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";

const BlogDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    image: "",
  });

  const getBlogDetail = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:8003/api/v1/blog/get-blog/${id}`);
      if (data?.success) {
        setBlog(data?.blog);
        setInputs({
          title: data?.blog.title,
          description: data?.blog.description,
          image: data?.blog.image,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    getBlogDetail();
  }, [getBlogDetail]);

  // Handle Input Change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`http://localhost:8003/api/v1/blog/update-blog/${id}`, {
        title: inputs.title,
        description: inputs.description,
        image: inputs.image,
        user: id,
      });
      if (data?.success) {
        toast.success("Blog Updated");
        navigate("/my-blogs");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(blog);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          width={"50%"}
          border={3}
          borderRadius={10}
          padding={3}
          margin="auto"
          boxShadow={"10px 10px 20px #ccc"}
          display="flex"
          flexDirection={"column"}
          marginTop="30px"
        >
          <Typography variant="h2" textAlign={"center"} fontWeight="bold" padding={3} color="gray">
            Update A Post
          </Typography>
          <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>
            Title
          </InputLabel>
          <TextField name="title" value={inputs.title} onChange={handleChange} margin="normal" variant="outlined" required />

          <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>
            Description
          </InputLabel>
          <TextField name="description" value={inputs.description} onChange={handleChange} margin="normal" variant="outlined" required />

          <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>
            Image URL
          </InputLabel>
          <TextField name="image" value={inputs.image} onChange={handleChange} margin="normal" variant="outlined" required />

          <Button type="submit" color="warning" variant="contained">
            UPDATE
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default BlogDetails;
