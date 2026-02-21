const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Admin credentials
const adminCredentials = {
  name: 'Admin User',
  email: 'admin@medicare.com',
  phone: '+92-300-0000000',
  password: 'admin123'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor_appointment')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminCredentials.email, role: 'admin' });
      
      if (existingAdmin) {
        console.log('Admin user already exists!');
        console.log('Email:', existingAdmin.email);
        console.log('Role:', existingAdmin.role);
        return;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);
      
      // Create admin user
      const admin = new User({
        name: adminCredentials.name,
        email: adminCredentials.email,
        phone: adminCredentials.phone,
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      
      console.log('✅ Admin user created successfully!');
      console.log('Email:', admin.email);
      console.log('Password:', adminCredentials.password);
      console.log('Role:', admin.role);
      
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });