import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField, Container, Typography, Stack } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Paper } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const signInWithProvider = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={login}>
            Login
          </Button>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => signInWithProvider(googleProvider)}
          >
            Login with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={() => signInWithProvider(facebookProvider)}
          >
            Login with Facebook
          </Button>
          <Typography variant="body2" textAlign="center">
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
