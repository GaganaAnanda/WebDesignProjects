import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';

function ImageUpload() {
  const [imageName, setImageName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNameChange = (e) => {
    setImageName(e.target.value);
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

    setLoading(true);

    try {
      const userEmail = sessionStorage.getItem('userEmail');
      
      if (!userEmail) {
        setError('User not authenticated. Please login first.');
        setLoading(false);
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
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Upload Image
        </Typography>

        <Box component="form" onSubmit={handleUpload}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="Image Name"
            value={imageName}
            onChange={handleNameChange}
            margin="normal"
            required
            disabled={loading}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileSelect}
              disabled={loading}
              id="file-input"
            />
          </Box>

          {selectedFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !selectedFile || !imageName.trim()}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ImageUpload;
