import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { Lock } from '@mui/icons-material';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}
      >
        <Lock sx={{ fontSize: 80, color: '#d32f2f', mb: 2 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
          Access Denied
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
          You don't have permission to access this page. Please check your user role.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/home')}
          size="large"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}

export default Unauthorized;
