const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Create Razorpay Order - Requires user to be logged in
router.post('/create-order', auth, createOrder);

// Verify Razorpay Payment - Requires user to be logged in
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;
