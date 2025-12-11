require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const sampleImages = [
  { name: 'Company Office', path: 'sample-office.jpg' },
  { name: 'Team Meeting', path: 'sample-team.jpg' },
  { name: 'Product Launch', path: 'sample-product.jpg' },
  { name: 'Company Event', path: 'sample-event.jpg' },
  { name: 'Workspace', path: 'sample-workspace.jpg' }
];

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Delete Demo Company user
    await User.deleteOne({ email: 'company@northeastern.edu' });
    console.log('✅ Removed Demo Company user');

    // Add images to existing employee
    const employee = await User.findOne({ email: 'employee@northeastern.edu' });
    if (employee) {
      employee.images = sampleImages;
      await employee.save();
      console.log('✅ Added sample images to Employee User');
      console.log(`📷 Added ${sampleImages.length} images`);
    } else {
      console.log('❌ Employee user not found');
    }

    mongoose.connection.close();
    console.log('✅ Done');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateImages();
