# Doctor Appointment Booking System

A complete MERN stack application for booking doctor appointments.

## Project Structure

```
mern-doctor-appointment-main/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    ├── package.json
    └── ...
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (either local installation or MongoDB Atlas account)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/doctor_appointment
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory with the following content (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

## Running the Application

1. Make sure MongoDB is running on your system:
   - For local MongoDB: Start the MongoDB service (`net start MongoDB` on Windows)
   - For MongoDB Atlas: Ensure your IP is whitelisted in the Atlas dashboard

2. Start the backend server first:
```bash
cd backend
npm run dev
```

3. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## Features

- User authentication (patient and doctor roles)
- Doctor profiles with specialties
- Appointment booking system
- Real-time appointment management
- Patient and doctor dashboards

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Doctors
- GET `/api/doctors` - Get all doctors
- GET `/api/doctors/:id` - Get doctor by ID
- POST `/api/doctors` - Create doctor profile (doctor only)
- PUT `/api/doctors/:id` - Update doctor profile (doctor only)

### Appointments
- POST `/api/appointments` - Create appointment
- GET `/api/appointments/patient/:patientId` - Get appointments for patient
- GET `/api/appointments/doctor/:doctorId` - Get appointments for doctor
- PUT `/api/appointments/:id/status` - Update appointment status
- PUT `/api/appointments/:id/cancel` - Cancel appointment

### Specialties
- GET `/api/specialties` - Get all specialties
- GET `/api/specialties/:id` - Get specialty by ID