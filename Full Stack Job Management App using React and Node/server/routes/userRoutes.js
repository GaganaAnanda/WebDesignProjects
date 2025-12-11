const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const { validateEmail, validateFullName, validatePassword } = require('../utils/validation');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Initialize logger
const logger = require('debug')('app:routes');

const imagesDir = './images';
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// POST /user/create - Create a new user
router.post('/create', async (req, res) => {
  try {
    logger('📤 [POST] /user/create - Request received');
    logger('Request body:', { email: req.body.email, fullName: req.body.fullName, type: req.body.type });
    
    const { fullName, email, password, type } = req.body;

    if (!fullName || !email || !password || !type) {
      logger('❌ [400] Validation failed - Missing fields');
      return res.status(400).json({ error: 'Validation failed.' });
    }

    // Validate type field
    if (!['admin', 'employee'].includes(type)) {
      logger('❌ [400] Validation failed - Invalid type. Must be "admin" or "employee"');
      return res.status(400).json({ error: 'Validation failed. Type must be "admin" or "employee".' });
    }

    if (!validateEmail(email)) {
      logger('❌ [400] Validation failed - Invalid email format:', email);
      return res.status(400).json({ error: 'Validation failed.' });
    }

    // Validate northeastern.edu email domain
    if (!email.endsWith('@northeastern.edu')) {
      logger('❌ [400] Validation failed - Email must be @northeastern.edu:', email);
      return res.status(400).json({ error: 'Validation failed. Email must be @northeastern.edu.' });
    }

    if (!validateFullName(fullName)) {
      logger('❌ [400] Validation failed - Invalid fullName');
      return res.status(400).json({ error: 'Validation failed.' });
    }

    if (!validatePassword(password)) {
      logger('❌ [400] Validation failed - Invalid password');
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger('❌ [400] User already exists:', email);
      return res.status(400).json({ error: 'Validation failed due to existing user.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      type
    });

    await newUser.save();
    
    logger('✅ [201] User created successfully:', email);
    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /user/login - Login user
router.post('/login', async (req, res) => {
  try {
    logger('📤 [POST] /user/login - Request received');
    logger('Request body:', { email: req.body.email });

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      logger('❌ [400] Validation failed - Email or password missing');
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!validateEmail(email)) {
      logger('❌ [400] Validation failed - Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger('❌ [401] Authentication failed - User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger('❌ [401] Authentication failed - Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const tokenPayload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      type: user.type,
      imagePath: user.imagePath
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger('✅ [200] User logged in successfully with JWT token:', email);
    res.status(200).json({ 
      message: 'Login successful.',
      token: token,
      user: {
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        imagePath: user.imagePath
      }
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /user/edit - Update user details (Protected route)
router.put('/edit', verifyToken, async (req, res) => {
  try {
    logger('📤 [PUT] /user/edit - Request received');
    logger('Request body:', { email: req.body.email });
    
    const { email, fullName, password } = req.body;

    if (!email) {
      logger('❌ [400] Validation failed - Email missing');
      return res.status(400).json({ error: 'Validation failed.' });
    }

    if (!validateEmail(email)) {
      logger('❌ [400] Validation failed - Invalid email format:', email);
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger('❌ [404] User not found:', email);
      return res.status(404).json({ error: 'User not found.' });
    }

    if (fullName !== undefined) {
      if (!validateFullName(fullName)) {
        logger('❌ [400] Validation failed - Invalid fullName');
        return res.status(400).json({ error: 'Validation failed.' });
      }
      user.fullName = fullName;
    }

    if (password !== undefined) {
      if (!validatePassword(password)) {
        logger('❌ [400] Validation failed - Invalid password');
        return res.status(400).json({ error: 'Validation failed.' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    logger('✅ [200] User updated successfully:', email);
    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /user/delete - Delete a user (Protected - Admin only)
router.delete('/delete', verifyToken, verifyAdmin, async (req, res) => {
  try {
    logger('📤 [DELETE] /user/delete - Request received');
    logger('Request body:', { email: req.body.email });
    
    const { email } = req.body;

    if (!email) {
      logger('❌ [400] Email is required');
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOneAndDelete({ email });
    
    if (!user) {
      logger('❌ [404] User not found:', email);
      return res.status(404).json({ error: 'User not found.' });
    }

    // Delete all images from images array
    if (user.images && user.images.length > 0) {
      user.images.forEach((imageObj) => {
        if (imageObj.path) {
          const fullPath = path.join(__dirname, '..', 'images', imageObj.path);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            logger('📷 Image deleted for user:', email);
          }
        }
      });
    }

    logger('✅ [200] User deleted successfully:', email);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /user/getAll - Get all users (Protected - Admin only)
router.get('/getAll', verifyToken, verifyAdmin, async (req, res) => {
  try {
    logger('📤 [GET] /user/getAll - Request received');
    
    const users = await User.find({}, 'fullName email type');
    
    logger('✅ [200] Retrieved', users.length, 'users');
    
    const userList = users.map(user => ({
      fullName: user.fullName,
      email: user.email,
      type: user.type
    }));

    res.status(200).json({ users: userList });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /user/showcase - Get users with images (Public route for Company Showcase)
router.get('/showcase', async (req, res) => {
  try {
    logger('📤 [GET] /user/showcase - Request received');
    
    // Get all users who have images
    const users = await User.find(
      { 'images.0': { $exists: true } }, // Only users with at least one image
      'fullName email images'
    );
    
    logger('✅ [200] Retrieved', users.length, 'users with images');
    
    const userList = users.map(user => ({
      fullName: user.fullName,
      email: user.email,
      images: user.images
    }));

    res.status(200).json({ users: userList });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /users - Fetch all users without passwords (Protected - Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    logger('📤 [GET] /users - Request received');
    
    const users = await User.find({}, 'fullName email type');
    
    logger('✅ [200] Retrieved', users.length, 'users');

    res.status(200).json({ 
      message: 'Users fetched successfully.',
      users: users 
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /user/uploadImage - Upload user image (Protected route)
router.post('/uploadImage', verifyToken, upload.single('image'), async (req, res) => {
  try {
    logger('📤 [POST] /user/uploadImage - Request received');
    logger('Request body:', { email: req.body.email, imageName: req.body.imageName });
    
    const { email, imageName } = req.body;

    if (!email) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      logger('❌ [400] Email is required');
      return res.status(400).json({ error: 'Email is required.' });
    }

    if (!imageName) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      logger('❌ [400] Image name is required');
      return res.status(400).json({ error: 'Image name is required.' });
    }

    if (!req.file) {
      logger('❌ [400] Image file is required');
      return res.status(400).json({ error: 'Image file is required.' });
    }

    logger('📷 File received:', { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size });

    const user = await User.findOne({ email });
    if (!user) {
      fs.unlinkSync(req.file.path);
      logger('❌ [404] User not found:', email);
      return res.status(404).json({ error: 'User not found.' });
    }

    const filePath = req.file.filename;
    
    // Initialize images array if it doesn't exist
    if (!user.images) {
      user.images = [];
    }

    // Add new image with name to images array
    user.images.push({
      name: imageName,
      path: filePath
    });
    
    await user.save();

    logger('✅ [201] Image uploaded successfully for user:', email, 'File:', filePath);
    res.status(201).json({ 
      message: 'Image uploaded successfully.',
      imageName: imageName,
      filePath: filePath,
      totalImages: user.images.length
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.message === 'Invalid file format. Only JPEG, PNG, and GIF are allowed.') {
      logger('❌ [400] Invalid file format:', error.message);
      return res.status(400).json({ error: error.message });
    }
    
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /user/images/:email - Fetch all images uploaded by a user (Public route for showcase)
router.get('/images/:email', async (req, res) => {
  try {
    logger('📤 [GET] /user/images/:email - Request received');
    logger('Request params:', { email: req.params.email });

    const { email } = req.params;

    if (!email) {
      logger('❌ [400] Email is required');
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger('❌ [404] User not found:', email);
      return res.status(404).json({ error: 'User not found.' });
    }

    const images = user.images && user.images.length > 0 ? user.images : [];

    logger('✅ [200] Retrieved', images.length, 'images for user:', email);
    res.status(200).json({ 
      message: 'Images fetched successfully.',
      email: user.email,
      fullName: user.fullName,
      totalImages: images.length,
      images: images
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /user/deleteImage - Delete a specific image (Protected route)
router.delete('/deleteImage', verifyToken, async (req, res) => {
  try {
    logger('📤 [DELETE] /user/deleteImage - Request received');
    logger('Request body:', { email: req.body.email, imagePath: req.body.imagePath });

    const { email, imagePath } = req.body;

    if (!email || !imagePath) {
      logger('❌ [400] Email and imagePath are required');
      return res.status(400).json({ error: 'Email and imagePath are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger('❌ [404] User not found:', email);
      return res.status(404).json({ error: 'User not found.' });
    }

    // Find the image in the user's images array
    const imageIndex = user.images.findIndex(img => img.path === imagePath);
    if (imageIndex === -1) {
      logger('❌ [404] Image not found:', imagePath);
      return res.status(404).json({ error: 'Image not found.' });
    }

    // Delete the physical file
    const fullPath = path.join(__dirname, '..', 'images', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger('📷 Physical file deleted:', fullPath);
    }

    // Remove image from array
    user.images.splice(imageIndex, 1);
    await user.save();

    logger('✅ [200] Image deleted successfully:', imagePath);
    res.status(200).json({ 
      message: 'Image deleted successfully.',
      remainingImages: user.images.length
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;