import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import axios from 'axios';

function CompanyShowcase() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyImages();
  }, []);

  const fetchCompanyImages = async () => {
    try {
      setLoading(true);
      
      const userEmail = sessionStorage.getItem('userEmail');
      
      if (!userEmail) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      // Fetch the current user's data
      const response = await axios.get('http://localhost:3000/user/getAll');
      console.log('Users response:', response.data);
      
      // Find the logged-in user and get their image
      const allImages = [];
      if (response.data.users) {
        const currentUser = response.data.users.find(user => user.email === userEmail);
        
        if (currentUser && currentUser.imagePath) {
          allImages.push({
            path: currentUser.imagePath,
            companyName: currentUser.fullName || currentUser.email || 'Company',
            filename: currentUser.imagePath.split('/').pop()
          });
        }
      }
      
      setImages(allImages);
      setError('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load company images.');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (images.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">No company image available for your profile. Please upload an image via the backend API.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
        Company Showcase
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore our partner companies and their profiles
      </Typography>

      <Grid container spacing={3}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 6
              }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:3000${image.path}`}
                alt={image.companyName}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {image.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {image.filename}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CompanyShowcase;