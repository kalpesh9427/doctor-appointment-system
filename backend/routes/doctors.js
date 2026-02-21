const express = require('express');
const router = express.Router();
const { 
  getAllDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor,
  getDoctorsBySpecialty
} = require('../controllers/doctorController');
const { auth, doctorAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/specialty/:specialty', getDoctorsBySpecialty);

// Protected routes - Doctor only
router.post('/', doctorAuth, createDoctor); // Only doctors can create their own profile
router.put('/:id', doctorAuth, updateDoctor); // Only doctors can update their own profile
router.delete('/:id', doctorAuth, deleteDoctor); // Only doctors can delete their own profile

module.exports = router;