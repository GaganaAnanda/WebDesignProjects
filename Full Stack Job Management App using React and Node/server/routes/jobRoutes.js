const express = require('express');
const router = express.Router();
const Job = require('../models/job');

const logger = require('debug')('app:routes');

// POST /create/job - Create a new job
router.post('/create', async (req, res) => {
  try {
    logger('📤 [POST] /job/create - Request received');
    logger('Request body:', { companyName: req.body.companyName, jobTitle: req.body.jobTitle });
    
    const { companyName, jobTitle, description, salary, createdBy } = req.body;

    // Validation
    if (!companyName || !jobTitle || !description || salary === undefined || !createdBy) {
      logger('❌ [400] Validation failed - Missing fields');
      return res.status(400).json({ error: 'All fields (companyName, jobTitle, description, salary, createdBy) are required.' });
    }

    if (typeof salary !== 'number' || salary < 0) {
      logger('❌ [400] Validation failed - Invalid salary');
      return res.status(400).json({ error: 'Salary must be a positive number.' });
    }

    const newJob = new Job({
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      description: description.trim(),
      salary,
      createdBy: createdBy.trim()
    });

    await newJob.save();
    
    logger('✅ [201] Job created successfully:', jobTitle);
    res.status(201).json({ 
      message: 'Job created successfully.',
      job: newJob
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /jobs - Fetch all jobs
router.get('/', async (req, res) => {
  try {
    logger('📤 [GET] /jobs - Request received');
    
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    
    logger('✅ [200] Retrieved', jobs.length, 'jobs');
    
    res.status(200).json({ 
      message: 'Jobs fetched successfully.',
      jobs: jobs
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /jobs/:id - Fetch a specific job
router.get('/:id', async (req, res) => {
  try {
    logger('📤 [GET] /jobs/:id - Request received');
    logger('Request params:', { id: req.params.id });

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      logger('❌ [404] Job not found:', req.params.id);
      return res.status(404).json({ error: 'Job not found.' });
    }

    logger('✅ [200] Job fetched successfully');
    res.status(200).json({ 
      message: 'Job fetched successfully.',
      job: job
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
