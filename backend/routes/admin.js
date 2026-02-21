const express = require('express');
const router = express.Router();
const { 
  getAllDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor,
  toggleDoctorStatus,
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

// Admin dashboard stats
router.get('/dashboard/stats', adminAuth, getDashboardStats);

// Manage doctors
router.get('/doctors', adminAuth, getAllDoctors);
router.post('/doctors', adminAuth, createDoctor);
router.put('/doctors/:id', adminAuth, updateDoctor);
router.delete('/doctors/:id', adminAuth, deleteDoctor);
router.patch('/doctors/:id/status', adminAuth, toggleDoctorStatus);

// Manage users
router.get('/users', adminAuth, getAllUsers);
router.post('/users', adminAuth, createUser);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

module.exports = router;