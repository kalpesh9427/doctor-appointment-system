const express = require('express');
const router = express.Router();
const { 
  createAppointment,
  getAppointmentsForPatient,
  getAppointmentsForDoctor,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
  cancelAppointment,
  getAllAppointments
} = require('../controllers/appointmentController');
const { auth, doctorAuth } = require('../middleware/auth');

// Public route for creating appointments
router.post('/', createAppointment);

// Protected routes
router.get('/', auth, getAllAppointments); // Get appointments with various filters
router.get('/patient/:patientId', auth, getAppointmentsForPatient); // Get appointments for a specific patient
router.get('/doctor/:doctorId', doctorAuth, getAppointmentsForDoctor); // Get appointments for a specific doctor
router.get('/:id', auth, getAppointmentById); // Get appointment by ID

// Protected routes - Patients can update their own appointments
router.put('/:id', auth, updateAppointment); // Update appointment details
router.put('/:id/status', auth, updateAppointmentStatus); // Update appointment status
router.put('/:id/cancel', auth, cancelAppointment); // Cancel appointment

module.exports = router;