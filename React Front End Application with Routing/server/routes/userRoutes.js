const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const { validateEmail, validateFullName, validatePassword } = require('../utils/validation');

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
    logger('Request body:', { email: req.body.email, fullName: req.body.fullName });
    
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      logger('❌ [400] Validation failed - Missing fields');
      return res.status(400).json({ error: 'Validation failed.' });
    }

    if (!validateEmail(email)) {
      logger('❌ [400] Validation failed - Invalid email format:', email);
      return res.status(400).json({ error: 'Validation failed.' });
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
      password: hashedPassword
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

    logger('✅ [200] User logged in successfully:', email);
    res.status(200).json({ 
      message: 'Login successful.',
      user: {
        fullName: user.fullName,
        email: user.email,
        imagePath: user.imagePath
      }
    });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /user/edit - Update user details
router.put('/edit', async (req, res) => {
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

// DELETE /user/delete - Delete a user
router.delete('/delete', async (req, res) => {
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

router.get('/getAll', async (req, res) => {
  try {
    logger('📤 [GET] /user/getAll - Request received');
    
    const users = await User.find({}, 'fullName email password imagePath');
    
    logger('✅ [200] Retrieved', users.length, 'users');
    
    const userList = users.map(user => ({
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      imagePath: user.imagePath
    }));

    res.status(200).json({ users: userList });
  } catch (error) {
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /user/uploadImage - Upload user image
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    logger('📤 [POST] /user/uploadImage - Request received');
    logger('Request body:', { email: req.body.email });
    
    const { email } = req.body;

    if (!email) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      logger('❌ [400] Email is required');
      return res.status(400).json({ error: 'Email is required.' });
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

    // Update imagePath with the new file path
    user.imagePath = `/images/${req.file.filename}`;
    
    await user.save();

    logger('✅ [200] Image uploaded successfully for user:', email, 'File:', user.imagePath);
    res.status(200).json({ 
      message: 'Image uploaded successfully.',
      imagePath: user.imagePath
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    logger('❌ [500] Internal server error:', error.message);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// GET /user/images/:email - Fetch all images uploaded by a user
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

module.exports = router;