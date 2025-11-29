import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/actions';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  TextField
} from '@mui/material';
import { AttachMoney, Business, Work } from '@mui/icons-material';

function EmployeeJobs() {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const filteredJobs = jobs.filter((job) =>
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const displayedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Available Jobs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by company or job title..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </Box>
      ) : displayedJobs.length > 0 ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {displayedJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Business sx={{ color: '#1976d2', mr: 1 }} />
                      <Typography variant="subtitle2" color="textSecondary">
                        {job.companyName}
                      </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {job.jobTitle}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: '40px' }}>
                      {job.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney sx={{ color: '#4caf50', mr: 0.5, fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ${job.salary.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ color: '#ff9800', mr: 0.5, fontSize: '1.2rem' }} />
                      <Typography variant="caption" color="textSecondary">
                        Posted by: {job.createdBy}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Alert severity="info">No jobs found</Alert>
      )}
    </Container>
  );
}

export default EmployeeJobs;
