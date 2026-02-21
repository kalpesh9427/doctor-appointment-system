const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getDoctorProfile,
  updateDoctorProfile
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// Doctor profile routes (for doctors)
router.get('/doctor-profile', auth, getDoctorProfile);
router.put('/doctor-profile', auth, updateDoctorProfile);

module.exports = router;