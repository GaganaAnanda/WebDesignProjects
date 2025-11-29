import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Basic validation
    if (!email || !password) {
      setValidationError('Please enter both email and password');
      return;
    }

    // Password minimum length validation
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    const result = await dispatch(login(email, password));
    
    if (result?.success) {
      const userType = sessionStorage.getItem('userType');
      if (userType === 'admin') {
        navigate('/admin/employees');
      } else if (userType === 'employee') {
        navigate('/employee/jobs');
      } else {
        navigate('/home');
      }
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
          {validationError && <Alert severity="warning" sx={{ mb: 2 }}>{validationError}</Alert>}
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;