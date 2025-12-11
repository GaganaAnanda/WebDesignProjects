import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

function CompanyShowcase() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Upload states
  const [imageName, setImageName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      
      // Fetch all users with images using public showcase endpoint
      const response = await axios.get('http://localhost:3000/user/showcase');
      console.log('Showcase response:', response.data);
      
      // Collect all images from all users
      const allImages = [];
      if (response.data.users && response.data.users.length > 0) {
        response.data.users.forEach(user => {
          if (user.images && user.images.length > 0) {
            // Add user info to each image
            user.images.forEach(img => {
              allImages.push({
                ...img,
                userName: user.fullName,
                userEmail: user.email
              });
            });
          }
        });
      }
      
      setImages(allImages);
      setError('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load images.');
      console.error('Error:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Only JPEG, PNG, and GIF are allowed.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!imageName.trim()) {
      setError('Please enter an image name.');
      return;
    }

    if (!selectedFile) {
      setError('Please select an image file.');
      return;
    }

    setUploading(true);

    try {
      const userEmail = sessionStorage.getItem('userEmail');
      
      if (!userEmail) {
        setError('User not authenticated. Please login first.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('email', userEmail);
      formData.append('imageName', imageName.trim());
      formData.append('image', selectedFile);

      const response = await axios.post(
        'http://localhost:3000/user/uploadImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        setSuccess(`Image "${imageName}" uploaded successfully!`);
        setImageName('');
        setSelectedFile(null);
        
        // Refresh images list
        await fetchUserImages();

        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'Validation error.');
      } else if (err.response?.status === 404) {
        setError('User not found. Please login again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server.');
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const currentImage = images[currentIndex];

      await axios.delete('http://localhost:3000/user/deleteImage', {
        data: {
          email: userEmail,
          imagePath: currentImage.path
        }
      });

      setSuccess(`Image "${currentImage.name}" deleted successfully!`);
      
      // Update local state
      const newImages = images.filter((_, idx) => idx !== currentIndex);
      setImages(newImages);
      
      // Adjust current index if needed
      if (currentIndex >= newImages.length && newImages.length > 0) {
        setCurrentIndex(newImages.length - 1);
      } else if (newImages.length === 0) {
        setCurrentIndex(0);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete image. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Company Showcase
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Gallery Section */}
      {images.length === 0 ? (
        <Alert severity="info">No company images available yet.</Alert>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Company Gallery ({images.length} {images.length === 1 ? 'image' : 'images'})
          </Typography>

          <Box sx={{ border: '1px solid #ccc', p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Button onClick={goToPrevious}>
                ← Prev
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={`http://localhost:3000/images/${images[currentIndex].path}`}
                  alt={images[currentIndex].name}
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
              <Typography variant="body1"><strong>{images[currentIndex].name}</strong></Typography>
              {images[currentIndex].userName && (
                <Typography variant="body2" color="text.secondary">
                  Uploaded by: {images[currentIndex].userName}
                </Typography>
              )}
              <Typography variant="body2">
                {currentIndex + 1} / {images.length}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}

export default CompanyShowcase;