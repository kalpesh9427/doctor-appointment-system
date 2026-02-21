const Specialty = require('../models/Specialty');

// Get all specialties
const getAllSpecialties = async (req, res) => {
  try {
    const { active } = req.query;
    
    let filter = {};
    
    if (active === 'true') {
      filter.isActive = true;
    } else if (active === 'false') {
      filter.isActive = false;
    }
    
    const specialties = await Specialty.find(filter).sort({ name: 1 });
    
    res.json({
      success: true,
      count: specialties.length,
      data: specialties
    });
  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get specialty by ID
const getSpecialtyById = async (req, res) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    
    res.json({
      success: true,
      data: specialty
    });
  } catch (error) {
    console.error('Get specialty by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new specialty
const createSpecialty = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    // Check if specialty already exists
    const existingSpecialty = await Specialty.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingSpecialty) {
      return res.status(400).json({ message: 'Specialty already exists' });
    }

    const newSpecialty = new Specialty({
      name,
      image,
      description
    });

    await newSpecialty.save();

    res.status(201).json({
      success: true,
      message: 'Specialty created successfully',
      data: newSpecialty
    });
  } catch (error) {
    console.error('Create specialty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update specialty
const updateSpecialty = async (req, res) => {
  try {
    const { name, image, description, isActive } = req.body;

    const specialty = await Specialty.findByIdAndUpdate(
      req.params.id,
      {
        name,
        image,
        description,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    res.json({
      success: true,
      message: 'Specialty updated successfully',
      data: specialty
    });
  } catch (error) {
    console.error('Update specialty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete specialty
const deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);

    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    res.json({
      success: true,
      message: 'Specialty deleted successfully'
    });
  } catch (error) {
    console.error('Delete specialty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
};