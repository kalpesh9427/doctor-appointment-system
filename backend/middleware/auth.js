const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is a doctor
const doctorAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || user.role !== 'doctor') {
      return res.status(401).json({ message: 'Access denied. Doctor access only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is an admin
const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      console.log('User role is not admin:', user.role);
      return res.status(401).json({ message: 'Access denied. Admin access only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Admin auth error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, doctorAuth, adminAuth };