const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const { specialty, search } = req.query;
    
    let filter = { isActive: true };
    
    if (specialty) {
      filter.specialty = new RegExp(specialty, 'i'); // Case insensitive search
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { specialty: new RegExp(search, 'i') },
        { education: new RegExp(search, 'i') },
        { clinicName: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    
    const doctors = await Doctor.find(filter)
      .populate('userId', 'email phone role')
      .sort({ rating: -1 }); // Sort by rating descending
    
    // Filter out orphaned doctors or users whose role changed
    const validDoctors = doctors.filter(doc => doc.userId && doc.userId.role === 'doctor');
    
    res.json({
      success: true,
      count: validDoctors.length,
      data: validDoctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'email phone');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    if (!doctor.isActive) {
      return res.status(404).json({ message: 'Doctor is not available' });
    }
    
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new doctor (for admin or doctor registration)
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      name,
      specialty,
      education,
      experience,
      fees,
      location,
      phone,
      email,
      image,
      description,
      consultationType
    } = req.body;

    // Check if doctor already exists for this user
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists for this user' });
    }

    const newDoctor = new Doctor({
      userId,
      name,
      specialty,
      education,
      experience,
      fees,
      location,
      phone,
      email,
      image,
      description,
      consultationType: consultationType || ['in-person']
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: newDoctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      education,
      experience,
      fees,
      location,
      phone,
      email,
      image,
      description,
      consultationType,
      availableSlots,
      isActive
    } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        name,
        specialty,
        education,
        experience,
        fees,
        location,
        phone,
        email,
        image,
        description,
        consultationType,
        availableSlots,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Also delete the associated user account
    await User.findByIdAndDelete(doctor.userId);

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctors by specialty
const getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;
    
    const doctors = await Doctor.find({ 
      specialty: new RegExp(specialty, 'i'),
      isActive: true 
    }).populate('userId', 'email phone role').sort({ rating: -1 });
    
    // Filter out orphaned doctors or users whose role changed
    const validDoctors = doctors.filter(doc => doc.userId && doc.userId.role === 'doctor');
    
    res.json({
      success: true,
      count: validDoctors.length,
      data: validDoctors
    });
  } catch (error) {
    console.error('Get doctors by specialty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update doctor availability (slots and holidays)
const updateAvailability = async (req, res) => {
  try {
    const { availability, holidays } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        availability,
        holidays,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialty,
  updateAvailability
};