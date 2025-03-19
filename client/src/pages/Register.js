import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField, Container, Typography, Stack } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Paper } from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
          Register
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
          <Button variant="contained" onClick={register}>
            Register
          </Button>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => signInWithProvider(googleProvider)}
          >
            Register with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={() => signInWithProvider(facebookProvider)}
          >
            Register with Facebook
          </Button>
          <Typography variant="body2" textAlign="center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Register;
