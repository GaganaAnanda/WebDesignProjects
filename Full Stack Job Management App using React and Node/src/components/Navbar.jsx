import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  if (!isAuthenticated || !user) return null;

  const isAdmin = user.type === 'admin';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 4 }}>
          Job Portal
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {isAdmin ? (
            <>
              <Button color="inherit" component={Link} to="/admin/employees">
                Employees
              </Button>
              <Button color="inherit" component={Link} to="/admin/add-job">
                Add Job
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/home">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/employee/jobs">
                Jobs
              </Button>
              <Button color="inherit" component={Link} to="/companies">
                Company Showcase
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>
            </>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 2, fontSize: '0.9rem' }}>
            {user.fullName} ({user.type})
          </Typography>
          
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            endIcon={<ExpandMore />}
          >
            Menu
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;