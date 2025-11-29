const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const { validateEmail, validateFullName, validatePassword } = require('../utils/validation');

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
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    if (!validateFullName(fullName)) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Validation failed due to existing user.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /user/edit - Update user details
router.put('/edit', async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (fullName !== undefined) {
      if (!validateFullName(fullName)) {
        return res.status(400).json({ error: 'Validation failed.' });
      }
      user.fullName = fullName;
    }

    if (password !== undefined) {
      if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Validation failed.' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /user/delete - Delete a user
router.delete('/delete', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOneAndDelete({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.imagePath) {
      const imagePath = path.join(__dirname, '..', user.imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /user/getAll - Retrieve all users
router.get('/getAll', async (req, res) => {
  try {
    const users = await User.find({}, 'fullName email password');
    
    const userList = users.map(user => ({
      fullName: user.fullName,
      email: user.email,
      password: user.password
    }));

    res.status(200).json({ users: userList });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /user/uploadImage - Upload user image
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Email is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.imagePath) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Image already exists for this user.' });
    }

    const filePath = `/images/${req.file.filename}`;
    user.imagePath = filePath;
    await user.save();

    res.status(201).json({ 
      message: 'Image uploaded successfully.',
      filePath: filePath
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.message === 'Invalid file format. Only JPEG, PNG, and GIF are allowed.') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;