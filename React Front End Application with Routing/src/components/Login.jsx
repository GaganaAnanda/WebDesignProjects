import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert 
} from '@mui/material';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Password minimum length validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email,
        password
      });

      if (response.status === 200) {
        const user = response.data.user;
        
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userName', user.fullName);
        sessionStorage.setItem('userImage', user.imagePath);
        
        setIsAuthenticated(true);
        setLoading(false);
        navigate('/home');
      }
    } catch (err) {
      setLoading(false);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure the backend is running on port 3000.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Please enter a valid email and password.');
      } else {
        setError('Login failed. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;