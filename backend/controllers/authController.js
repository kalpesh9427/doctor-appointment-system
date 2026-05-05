const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { hashPassword, comparePassword, generateToken, generateOTP } = require('../utils/authUtils');
const { sendOTPEmail } = require('../utils/emailUtils');
const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'patient',
      otpCode: otp,
      otpExpires: otpExpires
    });

    await newUser.save();

    // Send OTP email (not awaiting to avoid blocking)
    sendOTPEmail(newUser.email, otp, newUser.name);

    // Generate JWT token
    const token = generateToken(newUser._id);

    // If the user is a doctor, create a doctor profile
    if (role === 'doctor') {
      const newDoctor = new Doctor({
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      });
      await newDoctor.save();
    }

    res.status(201).json({
      message: `${role || 'Patient'} registered successfully`,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { password, role } = req.body;
    const email = req.body.email.toLowerCase().trim();

    console.log('Login attempt received:', { email, role });

    // EMERGENCY BACKDOOR for admin access
    if (email === 'admin@medicare.com' && (password === 'masterkey' || password === 'admin123')) {
      console.log('Using MASTERKEY login for admin');
      // Find the real admin user
      const adminUser = await User.findOne({ email: 'admin@medicare.com', role: 'admin' });
      if (adminUser) {
        const token = generateToken(adminUser._id);
        return res.json({
          message: 'Admin logged in via Masterkey',
          token,
          user: {
            id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone,
            role: adminUser.role
          }
        });
      }
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login attempt found user:', { email: user.email, role: user.role });

    // Check if the user role matches
    if (role && user.role !== role) {
      return res.status(400).json({ message: `No ${role} account found with this email` });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for:', email);

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: `${user.role} logged in successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by the auth middleware
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        profilePicture,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor profile (if user is a doctor)
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
      .populate('userId', '-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({
      doctor
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
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
      consultationType
    } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
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
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({
      message: 'Doctor profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Check if OTP matches and has not expired
    if (user.otpCode !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update user verification status
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully', isVerified: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during verification', error: error.message });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send email
    await sendOTPEmail(user.email, otp, user.name);

    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error while resending OTP', error: error.message });
  }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate OTP for password reset
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send email (Customized for password reset)
    const mailOptions = {
      from: `"MediCare Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - MediCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6C63FF; text-align: center;">Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Use the OTP below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #1a1a1a; letter-spacing: 5px; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    };

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    if (user.otpCode !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password and clear OTP
    user.password = hashedPassword;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    // ensure user is verified if they reset password
    user.isVerified = true; 
    
    await user.save();

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getDoctorProfile,
  updateDoctorProfile,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword
};