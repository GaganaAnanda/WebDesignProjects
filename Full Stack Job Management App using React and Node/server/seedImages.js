require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');

// Sample company image data (using placeholder image paths)
const sampleImages = [
  { name: 'Company Office', path: 'sample-office.jpg' },
  { name: 'Team Meeting', path: 'sample-team.jpg' },
  { name: 'Product Launch', path: 'sample-product.jpg' },
  { name: 'Company Event', path: 'sample-event.jpg' },
  { name: 'Workspace', path: 'sample-workspace.jpg' }
];

async function seedImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Create or update a demo company account
    const demoEmail = 'company@northeastern.edu';
    let companyUser = await User.findOne({ email: demoEmail });

    if (!companyUser) {
      // Create new company user
      const hashedPassword = await bcrypt.hash('Company@123', 10);
      companyUser = new User({
        fullName: 'Demo Company',
        email: demoEmail,
        password: hashedPassword,
        type: 'employee',
        images: sampleImages
      });
      await companyUser.save();
      console.log('✅ Created demo company user with sample images');
    } else {
      // Update existing user with images
      companyUser.images = sampleImages;
      await companyUser.save();
      console.log('✅ Updated demo company user with sample images');
    }

    console.log(`📷 Added ${sampleImages.length} sample images`);
    console.log('Images:', sampleImages.map(img => img.name).join(', '));
    
    mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedImages();
