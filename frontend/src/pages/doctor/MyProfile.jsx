import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { User, Mail, Phone, Edit3, Save, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { token } = useContext(AppContext);
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'doctor') {
          throw new Error('Not authorized as doctor');
        }

        // For now, use basic user data from localStorage
        setDoctorData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        });
        
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone
        });
      } catch (err) {
        console.error('Profile error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // In a real implementation, this would call an API to update the profile
      // For now, just update localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setDoctorData(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: doctorData.name,
      email: doctorData.email,
      phone: doctorData.phone
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-700">
          <User size={20} />
          <span className="font-medium">Error loading profile</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-blue-100 rounded-full">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{doctorData?.name}</h2>
              <p className="text-gray-600 capitalize">{doctorData?.role}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;