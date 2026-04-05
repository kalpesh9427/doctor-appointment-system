const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Helper to get Razorpay instance
const getRazorpayInstance = () => {
  console.log('Razorpay Init Check:', {
    hasKeyId: !!process.env.RAZORPAY_KEY_ID,
    hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
    keyPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 12)
  });
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are missing in environment variables');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    // Find appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Prepare payment options
    const options = {
      amount: appointment.fees * 100, // Amount in paise (e.g., 100 INR = 10000 paise)
      currency: 'INR',
      receipt: `receipt_${appointmentId}`,
    };

    // Create order in Razorpay
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      message: 'Razorpay order created',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        appointmentId
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Verify Payment Signature
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      appointmentId 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified! Update appointment status
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { 
          paymentStatus: 'paid',
          paymentDetails: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
          }
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Payment verified and appointment updated',
        data: updatedAppointment
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
