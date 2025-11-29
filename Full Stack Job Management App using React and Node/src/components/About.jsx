import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          About Job Portal
        </Typography>
        <Typography variant="body1" paragraph>
          This is a job portal application for finding and posting job opportunities.
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Features
        </Typography>
        <Typography variant="body2" paragraph>
          • Browse job listings
        </Typography>
        <Typography variant="body2" paragraph>
          • Search by company and position
        </Typography>
        <Typography variant="body2" paragraph>
          • Upload and manage profile images
        </Typography>
        <Typography variant="body2">
          • View job details and apply
        </Typography>
      </Box>
    </Container>
  );
}

export default About;