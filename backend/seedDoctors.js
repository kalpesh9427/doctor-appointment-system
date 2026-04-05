const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Specialty = require('./models/Specialty');
const bcrypt = require('bcryptjs');

// Sample doctors data
// Sample doctors data
const sampleDoctors = [
  {
    name: "Dr. Richmond Herrick",
    specialty: "Neurology",
    rating: 5,
    education: "MBBS, MS (Neurosurgery)",
    experience: "12 years",
    fees: 1500,
    location: "City Hospital, Karachi",
    phone: "+92-300-1234567",
    email: "richmond.herrick@example.com",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=256&h=256&fit=crop&crop=face",
    description: "Specializing in complex brain and spine surgeries with over a decade of clinical excellence."
  },
  {
    name: "Dr. Olivia Bennett",
    specialty: "Cardiology",
    rating: 4.9,
    education: "MBBS, MD (Cardiology)",
    experience: "10 years",
    fees: 1200,
    location: "Heart Care Clinic, Lahore",
    phone: "+92-322-9876543",
    email: "olivia.bennett@example.com",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=256&h=256&fit=crop&crop=face",
    description: "Expert in interventional cardiology and preventive heart care strategies."
  },
  {
    name: "Dr. Sophia Martinez",
    specialty: "Paediatrician",
    rating: 4.8,
    education: "MBBS, DCH (Pediatrics)",
    experience: "8 years",
    fees: 1000,
    location: "Children’s Hospital, Islamabad",
    phone: "+92-345-5678910",
    email: "sophia.martinez@example.com",
    image: "https://images.unsplash.com/photo-1594824475108-41e4550ae1d0?w=256&h=256&fit=crop&crop=face",
    description: "Dedicated to providing compassionate and comprehensive care for infants and children."
  },
  {
    name: "Dr. Amelia Clarke",
    specialty: "Dermatologist",
    rating: 4.7,
    education: "MBBS, MD (Dermatology)",
    experience: "7 years",
    fees: 900,
    location: "Skin Care Clinic, Karachi",
    phone: "+92-312-2233445",
    email: "amelia.clarke@example.com",
    image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=256&h=256&fit=crop&crop=face",
    description: "Expert in aesthetic dermatology and treatment of chronic skin conditions."
  },
  {
    name: "Dr. James Wilson",
    specialty: "Hematology",
    rating: 4.9,
    education: "MBBS, MD (Hematology)",
    experience: "15 years",
    fees: 1400,
    location: "Blood Care Institute, Lahore",
    phone: "+92-333-1112223",
    email: "james.wilson@example.com",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=256&h=256&fit=crop&crop=face",
    description: "Renowned specialist in blood disorders, anemia, and leukemia treatments."
  },
  {
    name: "Dr. Sarah Connor",
    specialty: "Oncology",
    rating: 5.0,
    education: "MBBS, MS, FRCS (Oncology)",
    experience: "20 years",
    fees: 2000,
    location: "National Cancer Center, Karachi",
    phone: "+92-300-5556667",
    email: "sarah.connor@example.com",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=256&h=256&fit=crop&crop=face",
    description: "Pioneer in modern chemotherapy protocols and surgical oncology."
  },
  {
    name: "Dr. Arjun Mehta",
    specialty: "Pulmonology",
    rating: 4.6,
    education: "MBBS, MD (Chest Diseases)",
    experience: "9 years",
    fees: 1100,
    location: "Respiratory Care, Islamabad",
    phone: "+92-344-9990001",
    email: "arjun.mehta@example.com",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=256&h=256&fit=crop&crop=face",
    description: "Expert in treating asthma, COPD, and sleep-related breathing disorders."
  },
  {
    name: "Dr. Lila Vance",
    specialty: "Infection",
    rating: 4.8,
    education: "MBBS, MD (Internal Medicine)",
    experience: "11 years",
    fees: 950,
    location: "Infectious Disease Clinic, Karachi",
    phone: "+92-321-7778889",
    email: "lila.vance@example.com",
    image: "https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=256&h=256&fit=crop&crop=face",
    description: "Specialist in viral infections, tropical diseases, and immunizations."
  },
  {
    name: "Dr. Robert Langdon",
    specialty: "Fever",
    rating: 4.5,
    education: "MBBS, MCPS",
    experience: "6 years",
    fees: 700,
    location: "General Health Clinic, Lahore",
    phone: "+92-302-3334445",
    email: "robert.langdon@example.com",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=256&h=256&fit=crop&crop=face",
    description: "General physician focused on primary care and acute illness management."
  },
  {
    name: "Dr. Emily Stone",
    specialty: "Neurology",
    rating: 4.9,
    education: "MBBS, FCPS (Neurology)",
    experience: "14 years",
    fees: 1300,
    location: "NeuroCenter, Multan",
    phone: "+92-315-6667778",
    email: "emily.stone@example.com",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=256&h=256&fit=crop&crop=face",
    description: "Handling stroke management, epilepsy, and neurodegenerative disorders."
  },
  {
    name: "Dr. David Gandy",
    specialty: "Cardiology",
    rating: 4.7,
    education: "MBBS, MD, FACC",
    experience: "18 years",
    fees: 1800,
    location: "Premium Heart Care, Karachi",
    phone: "+92-300-0001112",
    email: "david.gandy@example.com",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=256&h=256&fit=crop&crop=face",
    description: "Senior consultant with extensive experience in open heart surgery follow-ups."
  },
  {
    name: "Dr. Rachel Green",
    specialty: "Hematology",
    rating: 4.8,
    education: "MBBS, MD (Internal Medicine)",
    experience: "10 years",
    fees: 1100,
    location: "City Labs & Clinic, Islamabad",
    phone: "+92-333-5554443",
    email: "rachel.green@example.com",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=256&h=256&fit=crop&crop=face",
    description: "Specialized in pediatric blood disorders and genetic blood screening."
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
      for (let i = 0; i < sampleDoctors.length; i++) {
        const doctorData = sampleDoctors[i];
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Create user account for the doctor
        const user = new User({
          name: doctorData.name,
          email: doctorData.email,
          password: hashedPassword,
          phone: doctorData.phone,
          role: 'doctor',
          isVerified: true
        });

        await user.save();
        console.log(`Created user account for: ${doctorData.name}`);

        // Extract city from location if possible, otherwise use a default
        const city = doctorData.location.split(',').pop().trim() || 'Karachi';
        
        // Create doctor profile
        const doctor = new Doctor({
          userId: user._id,
          name: doctorData.name,
          email: doctorData.email,
          phone: doctorData.phone,
          image: doctorData.image,
          specialty: doctorData.specialty,
          education: doctorData.education,
          experience: doctorData.experience,
          fees: doctorData.fees,
          licenseNumber: `LIC-DOC-00${i + 1}`, // Required unique field
          clinicName: 'MediCare Health Centre', // Required field
          address: doctorData.location, // Required field
          city: city, // Required field
          rating: doctorData.rating,
          description: doctorData.description,
          consultationType: ['in-person', 'tele-health'],
          availability: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00' },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
            { day: 'Friday', startTime: '09:00', endTime: '17:00' }
          ]
        });

        await doctor.save();
        
        // Link doctor profile back to user
        user.doctorProfile = doctor._id;
        await user.save();
        
        console.log(`Created doctor profile and linked: ${doctorData.name}`);
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