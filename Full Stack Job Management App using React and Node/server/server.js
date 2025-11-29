require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const debug = require('debug')('app:*');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// Debug logging
debug('Environment:', process.env.NODE_ENV || 'development');
debug('Config loaded:', { port: process.env.PORT || 3000 });

// Logging middleware
app.use(morgan('combined'));

// Disable caching for all responses
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.removeHeader('ETag');
  debug('Cache headers set - caching disabled');
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  debug('MongoDB connection successful');
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Connected to: ${process.env.MONGODB_URI}`);
})
.catch((err) => {
  debug('MongoDB connection failed:', err.message);
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/user', userRoutes);
app.use('/job', jobRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Assignment 8 - User API Server',
    documentation: '/api-docs'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Assignment 8 - Server running on port', PORT);
  console.log('📚 Swagger documentation available at http://localhost:' + PORT + '/api-docs');
  console.log('🌐 CORS enabled - accepting cross-origin requests');
  console.log('📝 HTTP request logging enabled (Morgan)');
  console.log('🔄 Hot reload enabled - changes will auto-restart server');
  console.log('='.repeat(60) + '\n');
});