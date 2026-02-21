import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Calendar, Clock, User, Phone, Mail, Check, X, AlertCircle, RefreshCw } from "lucide-react";
import { default as api } from "../../services/api";
import toast from "react-hot-toast";

const Appointments = () => {
  const { token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check if token exists first
      if (!token) {
        throw new Error('Authentication token missing. Please login again.');
      }

      console.log('Token:', token.substring(0, 20) + '...'); // Log first 20 chars of token

      // 2. Validate user role from localStorage safely
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (!user || user.role !== 'doctor') {
        throw new Error('Access denied. This view is reserved for doctors.');
      }

      console.log('Using api instance to fetch appointments');
      
      // Get doctor profile to get the doctor's ID
      const doctorProfileResponse = await api.get('/auth/doctor-profile');
      const doctorId = doctorProfileResponse.data.doctor._id;
      
      // Use the doctor-specific endpoint to get only this doctor's appointments
      const response = await api.get(`/appointments/doctor/${doctorId}`);

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      // 3. Robust data assignment: Checks both response.data.data AND response.data
      const fetchedData = response.data.data || response.data;
      
      if (Array.isArray(fetchedData)) {
        setAppointments(fetchedData);
      } else {
        console.error("Unexpected data format:", response.data);
        setAppointments([]);
      }

    } catch (err) {
      console.error('Fetch Appointments Error:', err);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      // Use the error message from the backend if available
      const message = err.response?.data?.message || err.message || 'Failed to load appointments';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    } else {
        setLoading(false);
        setError("Please login to view appointments.");
    }
  }, [token]);

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);
      
      const response = await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });

      // Handle both nested and direct data structures
      const updatedApt = response.data.data || response.data;

      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: updatedApt.status || newStatus }
            : apt
        )
      );
      
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p class="text-gray-500 animate-pulse">Loading your schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div class="max-w-2xl mx-auto mt-10">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 class="text-xl font-bold text-red-800 mb-2">Connection Error</h2>
          <p class="text-red-600 mb-6">{error}</p>
          <button 
            onClick={fetchAppointments}
            class="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p class="text-gray-600 mt-1">Review and manage your upcoming patient visits</p>
        </div>
        <div class="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
           <span class="text-blue-700 font-semibold">{appointments.length} Total Appointments</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="divide-y divide-gray-100">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment._id} class="p-6 hover:bg-gray-50/50 transition-colors">
                <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* Patient Info Section */}
                  <div class="flex flex-col md:flex-row gap-4 flex-1">
                    <div class="hidden md:flex p-4 bg-gray-100 rounded-xl h-fit">
                      <User class="w-8 h-8 text-gray-500" />
                    </div>
                    
                    <div class="space-y-3">
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          {appointment.patientName || 'Unknown Patient'}
                        </h3>
                        <div class="flex flex-wrap gap-2 mt-2">
                          <span class={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div class="flex items-center gap-2 text-gray-600">
                          <Calendar class="w-4 h-4 text-blue-500" />
                          <span class="font-medium">{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Clock class="w-4 h-4 text-blue-500" />
                          <span class="font-medium">{appointment.appointmentTime}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Mail class="w-4 h-4 text-gray-400" />
                          <span>{appointment.patientEmail || 'No Email'}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Phone class="w-4 h-4 text-gray-400" />
                          <span>{appointment.patientPhone || 'No Phone'}</span>
                        </div>
                      </div>

                      {appointment.symptoms && (
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                           <p class="text-sm italic text-gray-600">
                            <span class="font-semibold text-gray-700 not-italic">Notes:</span> "{appointment.symptoms}"
                           </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div class="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => updateStatus(appointment._id, 'confirmed')}
                      disabled={updatingId === appointment._id || appointment.status === 'confirmed' || appointment.status === 'cancelled'}
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      {updatingId === appointment._id ? <RefreshCw class="w-4 h-4 animate-spin" /> : <Check size={18} />}
                      Confirm
                    </button>
                    
                    <button
                      onClick={() => updateStatus(appointment._id, 'cancelled')}
                      disabled={updatingId === appointment._id || appointment.status === 'cancelled'}
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all border-2 border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {updatingId === appointment._id ? <RefreshCw class="w-4 h-4 animate-spin" /> : <X size={18} />}
                      Cancel
                    </button>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div class="py-20 text-center">
              <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar class="w-10 h-10 text-gray-300" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">No appointments yet</h3>
              <p class="text-gray-500 mt-2">When patients book time with you, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;