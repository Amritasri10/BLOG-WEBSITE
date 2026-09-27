import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();

  const [inputs, setInputs] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(inputs);
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
          Login
        </Typography>

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
          {loading ? "Logging in..." : "Submit"}
        </Button>
        <Button onClick={() => navigate("/register")} sx={{ borderRadius: 3, marginTop: 2 }}>
          Not a user? Please Register
        </Button>
      </Box>
    </form>
  );
};

export default Login;
