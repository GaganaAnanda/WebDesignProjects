import React from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Button
} from '@mui/material';
import jobPosts from '../data/jobPosts';

function JobListings() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Job Listings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {jobPosts.length} positions available
        </Typography>
      </Box>

      <Box>
        {jobPosts.map((job) => (
          <Box 
            key={job.id}
            sx={{ 
              border: '1px solid #ddd',
              p: 2,
              mb: 2,
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Job ID: {job.id}
            </Typography>

            <Typography variant="h6" sx={{ mb: 1 }}>
              {job.title}
            </Typography>
            
            <Typography variant="body2" paragraph>
              {job.description}
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Required Skills:</strong> {job.requiredSkills}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Salary:</strong> {job.salary}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {job.lastUpdated}
            </Typography>

            <Button 
              variant="contained"
              href={job.applyLink}
              target="_blank"
              size="small"
            >
              Apply
            </Button>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default JobListings;