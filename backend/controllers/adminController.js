const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all doctors with search and pagination
const getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', specialty = '' } = req.query;
    const skip = (page - 1) * limit;

    let filter = { role: 'doctor' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Manual population approach
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get doctor profiles for these users
    const doctorProfiles = await Doctor.find({
      userId: { $in: users.map(user => user._id) }
    });

    // Combine user data with doctor profiles
    const doctorsWithProfiles = users.map(user => {
      const profile = doctorProfiles.find(p => p.userId.toString() === user._id.toString());
      return {
        ...user.toObject(),
        doctorProfile: profile || null
      };
    });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        doctors: doctorsWithProfiles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalDoctors: total,
          hasNextPage: skip + parseInt(limit) < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllDoctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// Create new doctor with all fields
const createDoctor = async (req, res) => {
  let createdUser = null;
  try {
    console.log('Admin Create Doctor Request Body:', req.body);
    
    const { 
      name, 
      email, 
      phone, 
      password, 
      specialty, 
      education, 
      experience, 
      licenseNumber,
      fees, 
      consultationType,
      clinicName,
      address,
      city,
      availability
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !specialty || !education || !experience || !licenseNumber || !fees || !clinicName || !address || !city) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await User.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if license number already exists
    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this license number already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user account
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'doctor'
    });

    createdUser = await user.save();
    console.log('User created:', createdUser._id);

    // Create doctor profile with all fields
    const doctorProfile = new Doctor({
      userId: createdUser._id,
      name,
      email,
      phone,
      specialty,
      education,
      experience,
      licenseNumber,
      fees: Number(fees),
      consultationType: consultationType || ['in-person'],
      clinicName,
      address,
      city,
      availability: availability || []
    });

    await doctorProfile.save();
    console.log('Doctor profile created:', doctorProfile._id);

    // Update user with doctor profile reference
    createdUser.doctorProfile = doctorProfile._id;
    await createdUser.save();

    // Return doctor without password
    const doctorWithoutPassword = await User.findById(createdUser._id)
      .select('-password')
      .populate('doctorProfile');

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { doctor: doctorWithoutPassword }
    });
  } catch (error) {
    console.error('Error creating doctor:', error);

    // Cleanup: If user was created but doctor profile failed, delete the user
    if (createdUser) {
      console.log('Rolling back: Deleting orphaned user', createdUser._id);
      await User.findByIdAndDelete(createdUser._id);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating doctor',
      error: error.message
    });
  }
};

// Update doctor with all fields
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Updating doctor:', id, 'with data:', updateData);

    // Find user
    const user = await User.findById(id);
    if (!user || user.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Update user fields if provided
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.phone) user.phone = updateData.phone;
    
    // Handle password update
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }

    await user.save();

    // Update doctor profile
    const doctorProfile = await Doctor.findOne({ userId: id });
    if (doctorProfile) {
      // Update doctor profile fields
      const profileFields = [
        'specialty', 'education', 'experience', 'licenseNumber', 
        'fees', 'consultationType', 'clinicName', 'address', 
        'city', 'availability', 'isActive', 'description'
      ];
      
      profileFields.forEach(field => {
        if (updateData[field] !== undefined) {
          doctorProfile[field] = updateData[field];
        }
      });

      await doctorProfile.save();
    }

    // Return updated doctor
    const updatedDoctor = await User.findById(id)
      .select('-password')
      .populate('doctorProfile');

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: { doctor: updatedDoctor }
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user (this will cascade delete related data)
    const user = await User.findByIdAndDelete(id);
    if (!user || user.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Also delete doctor profile
    await Doctor.findOneAndDelete({ userId: id });

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      error: error.message
    });
  }
};

// Toggle doctor status
const toggleDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const doctorProfile = await Doctor.findOne({ userId: id });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    doctorProfile.isActive = !doctorProfile.isActive;
    await doctorProfile.save();

    res.json({
      success: true,
      message: `Doctor ${doctorProfile.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: doctorProfile.isActive }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling doctor status',
      error: error.message
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const activeDoctors = await Doctor.countDocuments({ isActive: true });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = 0; // Would need Appointment model

    res.json({
      success: true,
      data: {
        totalDoctors,
        activeDoctors,
        totalPatients,
        totalAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Get all users with search and pagination
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users: users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: skip + parseInt(limit) < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'patient' } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate role
    const validRoles = ['patient', 'doctor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Valid roles are: patient, doctor, admin'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    await user.save();

    // Return user without password
    const userWithoutPassword = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields if provided
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.role) {
      const validRoles = ['patient', 'doctor', 'admin'];
      if (validRoles.includes(updateData.role)) {
        user.role = updateData.role;
      }
    }
    
    // Handle password update
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = {
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
};