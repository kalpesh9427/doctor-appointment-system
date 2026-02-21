import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { doctorsData } from "../assets/assets";
import { doctorAPI, appointmentAPI, adminAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Upload,
  Edit,
  Save,
  X,
  Camera
} from "lucide-react";

const DoctorDetails = () => {
  const { id } = useParams();
  const { navigate } = useContext(AppContext);
  const routerNavigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.role === 'admin');
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        console.log('Fetching doctor with ID:', id);
        const response = await doctorAPI.getById(id);
        console.log('Doctor API response:', response);
        setDoctor(response.data.data);
        
        // Initialize edit form data
        const doctorData = response.data.data;
        setEditFormData({
          name: doctorData.name,
          specialty: doctorData.specialty,
          education: doctorData.education,
          experience: doctorData.experience,
          fees: doctorData.fees,
          location: doctorData.location,
          phone: doctorData.phone,
          email: doctorData.email,
          description: doctorData.description || ''
        });
      } catch (error) {
        console.error('Error fetching doctor:', error);
        // Fallback to static data if API fails
        const staticDoctor = doctorsData.find(d => d._id === parseInt(id));
        console.log('Using static doctor data:', staticDoctor);
        setDoctor(staticDoctor);
        setEditFormData({
          name: staticDoctor?.name || '',
          specialty: staticDoctor?.specialty || '',
          education: staticDoctor?.education || '',
          experience: staticDoctor?.experience || '',
          fees: staticDoctor?.fees || 0,
          location: staticDoctor?.location || '',
          phone: staticDoctor?.phone || '',
          email: staticDoctor?.email || '',
          description: staticDoctor?.description || ''
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id]);

  const [bookingData, setBookingData] = useState({
    patientName: "",
    phone: "",
    email: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
    paymentMethod: "cash",
  });

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async () => {
    if (
      !bookingData.patientName ||
      !bookingData.phone ||
      !bookingData.email ||
      !bookingData.appointmentDate ||
      !bookingData.appointmentTime
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      console.log('Current user:', currentUser);
      console.log('Doctor object:', doctor);
      console.log('Doctor ID being sent:', doctor._id || doctor.id);
      
      if (!currentUser || !currentUser.id) {
        toast.error("Please login to book an appointment");
        routerNavigate("/login");
        return;
      }
      
      const appointmentPayload = {
        patientId: currentUser.id,
        doctorId: doctor._id || doctor.id, // Handle both _id and id formats
        patientName: bookingData.patientName,
        patientPhone: bookingData.phone,
        patientEmail: bookingData.email,
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime,
        symptoms: bookingData.symptoms,
        paymentMethod: bookingData.paymentMethod,
        consultationType: 'in-person',
        fees: doctor.fees || doctor.doctorProfile?.fees || 100 // Fallback fee
      };
      
      console.log('Appointment payload:', appointmentPayload);
      
      const response = await appointmentAPI.create(appointmentPayload);
      console.log('Appointment creation response:', response);
      
      toast.success(`Appointment booked successfully with Dr. ${doctor.name}!`);
      
      // Reset form
      setBookingData({
        patientName: "",
        phone: "",
        email: "",
        appointmentDate: "",
        appointmentTime: "",
        symptoms: "",
      });
      
      routerNavigate("/my-appointments");
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment';
      toast.error(errorMessage);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImagePreview(null);
    setImageFile(null);
    // Reset form to original values
    setEditFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      education: doctor.education,
      experience: doctor.experience,
      fees: doctor.fees,
      location: doctor.location,
      phone: doctor.phone,
      email: doctor.email,
      description: doctor.description || ''
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Update via admin API
      await adminAPI.updateDoctor(doctor._id || doctor.id, editFormData);
      
      // Update local state
      setDoctor(prev => ({ ...prev, ...editFormData }));
      setIsEditing(false);
      setImagePreview(null);
      setImageFile(null);
      
      toast.success('Doctor details updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update doctor details');
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Doctor Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading doctor details...</p>
          </div>
        ) : !doctor ? (
          <div className="flex justify-center items-center h-64">
            <p>Doctor not found.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Doctor Details Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Doctor Profile Section */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 relative">
                    <img
                      src={doctor.image || doctor.doctorProfile?.image || '/placeholder.jpg'}
                      alt={doctor.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20"
                    />
                    {isAdmin && isEditing && (
                      <label className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                          className="text-2xl md:text-3xl font-bold text-gray-800 border-b-2 border-primary/30 focus:border-primary focus:outline-none w-full"
                        />
                        <input
                          type="text"
                          name="specialty"
                          value={editFormData.specialty}
                          onChange={handleEditFormChange}
                          className="text-lg text-primary font-semibold border-b border-primary/30 focus:border-primary focus:outline-none w-full"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                          {doctor.name}
                        </h2>
                        <p className="text-lg text-primary font-semibold mb-3">
                          {doctor.specialty || doctor.doctorProfile?.specialty}
                        </p>
                      </>
                    )}

                    {/* Rating and Edit Button */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {renderStars(doctor.rating || 5)}
                        </div>
                        <span>{doctor.rating || 5}.0 rating</span>
                      </div>
                      
                      {isAdmin && !isEditing && (
                        <button
                          onClick={handleEditClick}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                      )}
                      
                      {isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveChanges}
                            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            <span className="text-sm font-medium">Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span className="text-sm font-medium">Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="border-t border-gray-100">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Education */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Education
                        </h3>
                        {isEditing ? (
                          <input
                            type="text"
                            name="education"
                            value={editFormData.education}
                            onChange={handleEditFormChange}
                            className="w-full text-gray-600 border-b border-gray-300 focus:border-primary focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-600">{doctor.education || doctor.doctorProfile?.education}</p>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Experience
                        </h3>
                        {isEditing ? (
                          <input
                            type="text"
                            name="experience"
                            value={editFormData.experience}
                            onChange={handleEditFormChange}
                            className="w-full text-gray-600 border-b border-gray-300 focus:border-primary focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-600">{doctor.experience || doctor.doctorProfile?.experience}</p>
                        )}
                      </div>
                    </div>

                    {/* Fees */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Consultation Fee
                        </h3>
                        {isEditing ? (
                          <input
                            type="number"
                            name="fees"
                            value={editFormData.fees}
                            onChange={handleEditFormChange}
                            className="w-full text-gray-600 border-b border-gray-300 focus:border-primary focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-600">$ {doctor.fees || doctor.doctorProfile?.fees || 100}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Location
                        </h3>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={editFormData.location}
                            onChange={handleEditFormChange}
                            className="w-full text-gray-600 border-b border-gray-300 focus:border-primary focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-600">{doctor.location || doctor.doctorProfile?.city || 'City'}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Phone
                        </h3>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditFormChange}
                            className="w-full text-primary border-b border-gray-300 focus:border-primary focus:outline-none"
                          />
                        ) : (
                          <a
                            href={`tel:${doctor.phone || doctor.doctorProfile?.phone}`}
                            className="text-primary hover:underline"
                          >
                            {doctor.phone || doctor.doctorProfile?.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Email
                        </h3>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditFormChange}
                            className="w-full text-primary border-b border-gray-300 focus:border-primary focus:outline-none break-all"
                          />
                        ) : (
                          <a
                            href={`mailto:${doctor.email || doctor.doctorProfile?.email}`}
                            className="text-primary hover:underline break-all"
                          >
                            {doctor.email || doctor.doctorProfile?.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Book Appointment
                </h2>
                <p className="text-gray-600">
                  Schedule your consultation with {doctor.name}
                </p>
              </div>

              <div className="space-y-6">
                {/* Patient Name */}
                <div>
                  <label
                    htmlFor=""
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Patient Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      name="patientName"
                      value={bookingData.patientName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="Enter patient's full name"
                    />
                  </div>
                </div>

                {/* Phone and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="+92-300-1234567"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="patient@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="appointmentDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Appointment Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={bookingData.appointmentDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="appointmentTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={bookingData.appointmentTime}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      >
                        <option value="">Select time</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="17:00">05:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Symptoms/Reason */}
                <div>
                  <label
                    htmlFor="symptoms"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Symptoms / Reason for Visit
                  </label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={bookingData.symptoms}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-vertical"
                    placeholder="Please describe your symptoms or reason for consultation..."
                  ></textarea>
                </div>

                {/* Consultation Fee Display */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Consultation Fee:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      $ {doctor.fees || doctor.doctorProfile?.fees || 100}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Payment Method
                  </label>
                  <div className="relative">
                    <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={bookingData.paymentMethod}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    >
                      <option value="cash">Pay at Clinic</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleBookingSubmit}
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-md cursor-pointer"
                >
                  {bookingData.paymentMethod === "cash"
                    ? "Pay at Clinic"
                    : "Pay Now"}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  * You will receive a confirmation call within 24 hours
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;