const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { generateAppointmentReceipt } = require('../utils/pdfUtils');

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      appointmentTime,
      symptoms,
      paymentMethod,
      consultationType,
      fees
    } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !patientName || !patientPhone || !patientEmail || 
        !appointmentDate || !appointmentTime || !fees) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if appointment slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Appointment slot is already booked' });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      appointmentTime,
      symptoms,
      paymentMethod,
      consultationType,
      fees
    });

    await newAppointment.save();

    // Populate the appointment with doctor and patient details
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty fees');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: populatedAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointments for a patient
const getAppointmentsForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    let filter = { patientId };

    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctorId', 'name specialty image')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments for patient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointments for a doctor
const getAppointmentsForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status, appointmentDate } = req.query;

    let filter = { doctorId };

    if (status) {
      filter.status = status;
    }

    if (appointmentDate) {
      filter.appointmentDate = appointmentDate;
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments for doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty image');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty image');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update appointment details
const updateAppointment = async (req, res) => {
  try {
    const {
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      appointmentTime,
      symptoms,
      paymentMethod,
      consultationType,
      fees,
      notes
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // If date or time is being updated, check for conflicts
    if (appointmentDate || appointmentTime) {
      const dateToCheck = appointmentDate || appointment.appointmentDate;
      const timeToCheck = appointmentTime || appointment.appointmentTime;

      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        doctorId: appointment.doctorId,
        appointmentDate: dateToCheck,
        appointmentTime: timeToCheck,
        status: { $ne: 'cancelled' }
      });

      if (existingAppointment) {
        return res.status(400).json({ message: 'New appointment slot is already booked' });
      }
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        patientName: patientName || appointment.patientName,
        patientPhone: patientPhone || appointment.patientPhone,
        patientEmail: patientEmail || appointment.patientEmail,
        appointmentDate: appointmentDate || appointment.appointmentDate,
        appointmentTime: appointmentTime || appointment.appointmentTime,
        symptoms: symptoms || appointment.symptoms,
        paymentMethod: paymentMethod || appointment.paymentMethod,
        consultationType: consultationType || appointment.consultationType,
        fees: fees || appointment.fees,
        notes: notes || appointment.notes,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty image');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty image');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all appointments (for admin or filtered by user)
const getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId, patientName, startDate, endDate } = req.query;

    let filter = {};

    // If the authenticated user is a doctor, only show their appointments
    if (req.user && req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (doctorProfile) {
        filter.doctorId = doctorProfile._id;
      } else {
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    if (status) filter.status = status;
    if (doctorId && req.user && req.user.role === 'admin') filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (patientName) filter.patientName = { $regex: patientName, $options: 'i' };

    if (startDate && endDate) {
      filter.appointmentDate = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.appointmentDate = { $gte: startDate };
    } else if (endDate) {
      filter.appointmentDate = { $lte: endDate };
    }
    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty image')
      .sort({ appointmentDate: -1, appointmentTime: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: appointments.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: appointments
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get only booked slots (publicly accessible)
const getDoctorBookedSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { appointmentDate } = req.query;

    let filter = { doctorId, status: { $ne: 'cancelled' } };

    if (appointmentDate) {
      filter.appointmentDate = appointmentDate;
    }

    const appointments = await Appointment.find(filter)
      .select('appointmentDate appointmentTime -_id');

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get doctor booked slots error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate and download appointment receipt (PDF)
const downloadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find appointment and populate doctor details
    const appointment = await Appointment.findById(id)
      .populate('doctorId', 'name specialty fees phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${id}.pdf`);

    // Generate PDF and stream to response
    generateAppointmentReceipt(appointment, res);

  } catch (error) {
    console.error('Download receipt error:', error);
    res.status(500).json({ message: 'Server error while generating receipt', error: error.message });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add prescription/notes to an appointment
const addPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicines, advice, diagnosedSymptoms } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        prescription: {
          medicines,
          advice,
          diagnosedSymptoms
        },
        status: 'completed', // Automatically mark as completed when prescription is added
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Prescription added successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics for a doctor
const getDoctorDashboardStats = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      doctorId,
      appointmentDate: today,
      status: { $ne: 'cancelled' }
    });

    // Total Patients (unique)
    const appointments = await Appointment.find({ doctorId });
    const totalPatients = [...new Set(appointments.map(a => a.patientId.toString()))].length;

    // Total Earnings (completed/confirmed appointments)
    const earningsData = await Appointment.aggregate([
      { 
        $match: { 
          doctorId: new mongoose.Types.ObjectId(doctorId),
          status: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'paid' // Or just those that are confirmed/completed
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalEarnings: { $sum: '$fees' } 
        } 
      }
    ]);

    const totalEarnings = earningsData.length > 0 ? earningsData[0].totalEarnings : 0;

    res.json({
      success: true,
      data: {
        todayAppointments,
        totalPatients,
        totalEarnings
      }
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsForPatient,
  getAppointmentsForDoctor,
  getAppointmentById,
  getDoctorBookedSlots,
  updateAppointmentStatus,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
  downloadReceipt,
  deleteAppointment,
  addPrescription,
  getDoctorDashboardStats
};