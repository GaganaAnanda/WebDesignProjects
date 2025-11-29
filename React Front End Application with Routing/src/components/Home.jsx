import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Job Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Find your next opportunity
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/jobs')}
        >
          Browse Jobs
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Features
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Browse job listings
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Upload profile images
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          • View your gallery
        </Typography>
        <Typography variant="body2">
          • Contact us for support
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;