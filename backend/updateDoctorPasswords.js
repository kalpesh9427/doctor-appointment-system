const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor_appointment')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Hash for 'password123'
      const hashedPassword = '$2b$10$RZ1VreF0rj13Hiz28c6NMujDkPbZJ.ZzuGcVgV1/W1U2bzD5UHuTy';
      
      // Update all doctor users with the correct password
      const result = await User.updateMany(
        { role: 'doctor' },
        { $set: { password: hashedPassword } }
      );
      
      console.log(`Successfully updated ${result.modifiedCount} doctor accounts with the correct password.`);
      console.log('You can now log in to any doctor account with the password: password123');
      
    } catch (error) {
      console.error('Error updating doctor passwords:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });