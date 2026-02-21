import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { 
  Users, 
  User, 
  Calendar, 
  Stethoscope, 
  Search, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Trash2
} from "lucide-react";
import { adminAPI } from "../../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { token } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    activeDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if token exists first
      if (!token) {
        throw new Error('Authentication token missing. Please login again.');
      }

      // Validate user role from localStorage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (!user || user.role !== 'admin') {
        throw new Error('Access denied. Admin access required.');
      }

      console.log('Using adminAPI to fetch dashboard stats');
      
      // Fetch dashboard statistics
      const statsResponse = await adminAPI.getDashboardStats();
      console.log('Dashboard stats response:', statsResponse.data);

      // Handle both nested and direct data structures
      const statsData = statsResponse.data.data || statsResponse.data;
      
      setStats({
        totalDoctors: statsData.totalDoctors || 0,
        activeDoctors: statsData.activeDoctors || 0,
        totalPatients: statsData.totalPatients || 0,
        totalAppointments: statsData.totalAppointments || 0
      });

      // Fetch recent doctors (first 5)
      const doctorsResponse = await adminAPI.getAllDoctors({ limit: 5 });
      const doctorsData = doctorsResponse.data.data || doctorsResponse.data;
      setRecentDoctors(Array.isArray(doctorsData.doctors) ? doctorsData.doctors : []);

      // Fetch recent users (first 5) - ALL users regardless of role
      const usersResponse = await adminAPI.getAllUsers({ limit: 5 });
      const usersData = usersResponse.data.data || usersResponse.data;
      setRecentUsers(Array.isArray(usersData.users) ? usersData.users : []);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      console.error('Error response:', err.response);
      const message = err.response?.data?.message || err.message || 'Failed to load dashboard data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError("Please login to view dashboard.");
    }
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-4xl mx-auto mt-10">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle size={20} />
          <span className="font-medium">Error loading dashboard</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <BarChart3 size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the administrative panel</p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/doctors" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Doctors</h3>
              <p className="text-gray-600 mt-1">Add, edit, and manage doctors</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">View all doctors</span>
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
        </Link>

        <Link to="/admin/users" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
              <p className="text-gray-600 mt-1">View and manage all user accounts</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">View all users</span>
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
        </Link>

        <Link to="/admin/appointments" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <p className="text-gray-600 mt-1">Manage all appointments</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">View all appointments</span>
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Doctors</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeDoctors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalAppointments}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Doctors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Recent Doctors</h2>
              <Link to="/admin/doctors" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <p className="text-gray-600 mt-1">Recently added doctors</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentDoctors.length > 0 ? (
              recentDoctors.map((doctor) => (
                <div key={doctor._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {doctor.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatDate(doctor.createdAt)}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.doctorProfile?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {doctor.doctorProfile?.isActive ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {doctor.doctorProfile?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent doctors</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
              <Link to="/admin/users" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <p className="text-gray-600 mt-1">Recently registered users</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'doctor' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' && <User className="w-3 h-3" />}
                        {user.role === 'doctor' && <Stethoscope className="w-3 h-3" />}
                        {user.role === 'patient' && <User className="w-3 h-3" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent users</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;