import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import axios from 'axios';

function CompanyShowcase() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      const userEmail = sessionStorage.getItem('userEmail');
      
      if (!userEmail) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:3000/user/images/${userEmail}`);
      console.log('Images response:', response.data);
      setImages(response.data.images || []);
      setError('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load images.');
      console.error('Error:', err);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (images.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">No images uploaded yet.</Alert>
      </Container>
    );
  }

  const currentImage = images[currentIndex];

  if (!currentImage || !currentImage.path) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Error: Image data is invalid.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Image Gallery
      </Typography>

      <Box sx={{ border: '1px solid #ccc', p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Button onClick={goToPrevious}>
            ← Prev
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <img
              src={`http://localhost:3000/images/${currentImage.path}`}
              alt={currentImage.name}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
            />
          </Box>

          <Button onClick={goToNext}>
            Next →
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1"><strong>{currentImage.name}</strong></Typography>
          <Typography variant="body2">
            {currentIndex + 1} / {images.length}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default CompanyShowcase;