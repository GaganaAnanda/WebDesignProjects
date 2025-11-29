import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, clearJobMessage } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';

function AddJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, message, error } = useSelector((state) => state.jobs);

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    description: '',
    salary: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearJobMessage());
        navigate('/admin/jobs');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setValidationError('Company name is required');
      return false;
    }
    if (!formData.jobTitle.trim()) {
      setValidationError('Job title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setValidationError('Description is required');
      return false;
    }
    if (!formData.salary || formData.salary <= 0) {
      setValidationError('Salary must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) {
      return;
    }

    const jobData = {
      companyName: formData.companyName.trim(),
      jobTitle: formData.jobTitle.trim(),
      description: formData.description.trim(),
      salary: parseFloat(formData.salary),
      createdBy: user?.email || 'admin'
    };

    const result = await dispatch(createJob(jobData));
    
    if (result?.success) {
      setFormData({
        companyName: '',
        jobTitle: '',
        description: '',
        salary: ''
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Add New Job
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {validationError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Enter job title"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter job description"
            multiline
            rows={4}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Enter salary amount"
            inputProps={{ step: '0.01', min: '0' }}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              'Create Job'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddJob;
