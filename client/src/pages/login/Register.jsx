import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading } = useAuth();

  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister({
      username: inputs.name,
      email: inputs.email,
      password: inputs.password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        maxWidth={450}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin="auto"
        marginTop={5}
        boxShadow="10px 10px 20px #ccc"
        padding={3}
        borderRadius={5}
      >
        <Typography variant="h4" sx={{ textTransform: "uppercase" }} padding={3} textAlign="center">
          Register
        </Typography>

        <TextField
          placeholder="Enter Name"
          value={inputs.name}
          name="name"
          margin="normal"
          type="text"
          required
          fullWidth
          onChange={handleChange}
        />
        <TextField
          placeholder="Enter E-mail"
          value={inputs.email}
          name="email"
          margin="normal"
          type="email"
          required
          fullWidth
          onChange={handleChange}
        />
        <TextField
          placeholder="Enter Password"
          value={inputs.password}
          name="password"
          margin="normal"
          type="password"
          required
          fullWidth
          onChange={handleChange}
        />

        <Button
          type="submit"
          sx={{ borderRadius: 3, marginTop: 3 }}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? "Registering..." : "Submit"}
        </Button>
        <Button onClick={() => navigate("/login")} sx={{ borderRadius: 3, marginTop: 2 }}>
          Already Registered? Please Login
        </Button>
      </Box>
    </form>
  );
};

export default Register;
