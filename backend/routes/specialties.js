const express = require('express');
const router = express.Router();
const { 
  getAllSpecialties, 
  getSpecialtyById, 
  createSpecialty, 
  updateSpecialty, 
  deleteSpecialty
} = require('../controllers/specialtyController');
const { auth } = require('../middleware/auth');

// Public route
router.get('/', getAllSpecialties);
router.get('/:id', getSpecialtyById);

// Protected routes - Only admin or authorized users can manage specialties
router.post('/', auth, createSpecialty); // Only authorized users can create
router.put('/:id', auth, updateSpecialty); // Only authorized users can update
router.delete('/:id', auth, deleteSpecialty); // Only authorized users can delete

module.exports = router;