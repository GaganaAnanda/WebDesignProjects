import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem('userName');

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 4 }}>
          Job Portal
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} to="/home">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/jobs">
            Jobs
          </Button>
          <Button color="inherit" component={Link} to="/companies">
            Company Showcase
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
        </Box>
        
        <Typography sx={{ mr: 2 }}>
          {userName}
        </Typography>
        
        <Button 
          color="inherit" 
          onClick={handleLogout}
          variant="outlined"
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;