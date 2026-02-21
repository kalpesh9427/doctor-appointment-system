const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Specialty = require('./models/Specialty');

// Sample doctors data
const sampleDoctors = [
  {
    name: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    rating: 4.9,
    education: "MBBS, MD (Cardiology)",
    experience: "10 years",
    fees: 1200,
    location: "Heart Care Clinic, Lahore",
    phone: "+92-321-9876543",
    email: "sarah.ahmed@example.com",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    description: "Expert in heart diseases and cardiac care with over 10 years of experience."
  },
  {
    name: "Dr. Ahmad Khan",
    specialty: "Neurologist",
    rating: 4.8,
    education: "MBBS, MD (Neurology)",
    experience: "12 years",
    fees: 1500,
    location: "Neuro Care Center, Karachi",
    phone: "+92-333-1234567",
    email: "ahmad.khan@example.com",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    description: "Specialized in neurological disorders and brain-related conditions."
  },
  {
    name: "Dr. Fatima Ali",
    specialty: "Dermatologist",
    rating: 4.7,
    education: "MBBS, MD (Dermatology)",
    experience: "8 years",
    fees: 900,
    location: "Skin Care Clinic, Islamabad",
    phone: "+92-312-2233445",
    email: "fatima.ali@example.com",
    image: "https://images.unsplash.com/photo-1594824475108-41e4550ae1d0?w=150&h=150&fit=crop&crop=face",
    description: "Expert in skin care and treatment of dermatological conditions."
  },
  {
    name: "Dr. Omar Farooq",
    specialty: "Pediatrician",
    rating: 4.9,
    education: "MBBS, DCH (Pediatrics)",
    experience: "15 years",
    fees: 1000,
    location: "Children's Hospital, Rawalpindi",
    phone: "+92-300-9876543",
    email: "omar.farooq@example.com",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&h=150&fit=crop&crop=face",
    description: "Specialized in child health and development with extensive experience."
  },
  {
    name: "Dr. Ayesha Malik",
    specialty: "Orthopedic Surgeon",
    rating: 4.8,
    education: "MBBS, MS (Orthopedics)",
    experience: "14 years",
    fees: 1800,
    location: "Ortho Care Hospital, Lahore",
    phone: "+92-321-4567890",
    email: "ayesha.malik@example.com",
    image: "https://images.unsplash.com/photo-1553268022-3a9cda82eef3?w=150&h=150&fit=crop&crop=face",
    description: "Expert in bone and joint surgeries with focus on minimally invasive procedures."
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor_appointment')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Clear existing doctors and users with doctor role
      await Doctor.deleteMany({});
      await User.deleteMany({ role: 'doctor' });
      console.log('Cleared existing doctors and doctor users');

      // Create doctors with associated user accounts
      for (const doctorData of sampleDoctors) {
        // Create user account for the doctor
        const user = new User({
          name: doctorData.name,
          email: doctorData.email,
          password: '$2b$10$LQYyLjXZJGzJxYvQ.zQwCOUW8p1G.ykxH3z2h5y8j6t1u3y9v7n1o', // bcrypt hash for 'password123'
          phone: doctorData.phone,
          role: 'doctor'
        });

        await user.save();
        console.log(`Created user for doctor: ${doctorData.name}`);

        // Create doctor profile
        const doctor = new Doctor({
          userId: user._id,
          name: doctorData.name,
          specialty: doctorData.specialty,
          rating: doctorData.rating,
          education: doctorData.education,
          experience: doctorData.experience,
          fees: doctorData.fees,
          location: doctorData.location,
          phone: doctorData.phone,
          email: doctorData.email,
          image: doctorData.image,
          description: doctorData.description
        });

        await doctor.save();
        console.log(`Created doctor profile: ${doctorData.name}`);
      }

      console.log('\nSample doctors added successfully!');
      console.log('You can now log in as any of these doctors using:');
      console.log('Email: as shown above, Password: password123');
      
    } catch (error) {
      console.error('Error seeding doctors:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });