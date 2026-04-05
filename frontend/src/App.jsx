import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Doctors = lazy(() => import("./pages/Doctors"));
const DoctorDetails = lazy(() => import("./pages/DoctorDetails"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const TestUI = lazy(() => import("./pages/TestUI"));

// Doctor Dashboard Pages
const DoctorLayout = lazy(() => import("./pages/doctor/Layout"));
const DoctorDashboard = lazy(() => import("./pages/doctor/Dashboard"));
const DoctorAppointments = lazy(() => import("./pages/doctor/Appointments"));
const DoctorProfile = lazy(() => import("./pages/doctor/MyProfile"));

// Admin Dashboard Pages
const AdminLayout = lazy(() => import("./pages/admin/Layout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminDoctors = lazy(() => import("./pages/admin/Doctors"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--purple)]"></div>
  </div>
);

// Lazy load ErrorBoundary to avoid circular dependency issues if any
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));

const App = () => {
  const location = useLocation();
  const isDashboard = (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') || location.pathname.startsWith('/doctor-dashboard');
  const showNavbar = !isDashboard;

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Toaster position="top-right" />
      {showNavbar && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-ui" element={<TestUI />} />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />

          {/* Doctor Dashboard Routes */}
          <Route path="/doctor-dashboard/*" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={
            <ErrorBoundary>
              <AdminLayout />
            </ErrorBoundary>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;