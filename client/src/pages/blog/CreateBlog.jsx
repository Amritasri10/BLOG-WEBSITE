import React, { useState } from "react";
import { Box, Button, InputLabel, TextField, Typography, CircularProgress } from "@mui/material";
import useBlog from "../../hooks/useBlog";

const CreateBlog = () => {
  const { handleCreateBlog, loading } = useBlog();
  const userId = localStorage.getItem("userId");

  const [inputs, setInputs] = useState({ title: "", description: "", image: "" });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateBlog({ ...inputs, user: userId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        width="50%"
        border={3}
        borderRadius={10}
        padding={3}
        margin="auto"
        boxShadow="10px 10px 20px #ccc"
        display="flex"
        flexDirection="column"
        marginTop="30px"
      >
        <Typography variant="h2" textAlign="center" fontWeight="bold" padding={3} color="gray">
          Create Blog
        </Typography>

        <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>Title</InputLabel>
        <TextField name="title" value={inputs.title} onChange={handleChange} margin="normal" variant="outlined" required />

        <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>Description</InputLabel>
        <TextField
          name="description"
          value={inputs.description}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          required
        />

        <InputLabel sx={{ mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }}>Image URL</InputLabel>
        <TextField name="image" value={inputs.image} onChange={handleChange} margin="normal" variant="outlined" required />

        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? "Creating..." : "Submit"}
        </Button>
      </Box>
    </form>
  );
};

export default CreateBlog;
