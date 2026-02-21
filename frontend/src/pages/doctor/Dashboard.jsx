import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { User, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { default as api } from "../../services/api";

const Dashboard = () => {
  const { token } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    totalPatients: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get doctor ID from token/user context
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'doctor') {
          throw new Error('Not authorized as doctor');
        }

        // For doctor dashboard, get only appointments for this doctor
        try {
          console.log('Using api instance to fetch appointments for dashboard');
          // Get doctor profile to get the doctor's ID
          const doctorProfileResponse = await api.get('/auth/doctor-profile');
          const doctorId = doctorProfileResponse.data.doctor._id;
          
          // Use the doctor-specific endpoint to get only this doctor's appointments
          const response = await api.get(`/appointments/doctor/${doctorId}`);

          const allAppointments = response.data.data || [];
          
          // Show only this doctor's appointments
          setAppointments(allAppointments);
          
          // Calculate stats
          setStats({
            totalAppointments: allAppointments.length,
            pendingAppointments: allAppointments.filter(a => a.status === 'pending').length,
            confirmedAppointments: allAppointments.filter(a => a.status === 'confirmed').length,
            totalPatients: [...new Set(allAppointments.map(a => a.patientId))].length
          });
        } catch (apiError) {
          // If API fails, show empty state but don't crash
          console.error('API Error:', apiError);
          setAppointments([]);
          setStats({
            totalAppointments: 0,
            pendingAppointments: 0,
            confirmedAppointments: 0,
            totalPatients: 0
          });
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span className="font-medium">Error loading dashboard</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your medical practice management panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingAppointments}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmedAppointments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patients</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalPatients}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Appointments</h2>
          <p className="text-gray-600 mt-1">Latest patient appointments</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {appointments.length > 0 ? (
            appointments.slice(0, 5).map((appointment) => (
              <div key={appointment._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patientName || 'Patient Name'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.symptoms || 'No symptoms provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;