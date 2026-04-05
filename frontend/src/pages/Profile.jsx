import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { User, Mail, Phone, Edit2, Save, X } from "lucide-react";

const Profile = () => {
  const { user, setUser } = useContext(AppContext);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        const userData = response.data.user;
        setProfileData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        });
      } catch (error) {
        console.error('Error fetching profile:', error);  
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.user;

      // Update context
      setUser(updatedUser);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-soft p-10 relative overflow-hidden border border-slate-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-tr-full pointer-events-none" />

        <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2 relative z-10">My Profile</h1>
        <p className="text-slate-500 mb-10 relative z-10">Manage your personal information and preferences.</p>

        <div className="flex flex-col md:flex-row gap-12 relative z-10">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-primary/10 border-4 border-white shadow-soft flex items-center justify-center overflow-hidden mb-6 relative group">
              <User size={64} className="text-primary/50" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 text-center">{profileData.name}</h2>
            <div className="px-4 py-1 mt-2 bg-green-100 text-green-700 rounded-full text-xs font-semibold tracking-wider uppercase">
              {user?.role}
            </div>
          </div>

          <div className="md:w-2/3">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-lg hover:-translate-y-0.5"
                    disabled={loading}
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setProfileData({
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                      });
                    }}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-slate-400 uppercase mb-2">Full Name</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-800">
                    <User size={18} className="text-primary" />
                    <span className="font-medium">{profileData.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide text-slate-400 uppercase mb-2">Email Address</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-800">
                    <Mail size={18} className="text-primary" />
                    <span className="font-medium">{profileData.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide text-slate-400 uppercase mb-2">Phone Number</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-800">
                    <Phone size={18} className="text-primary" />
                    <span className="font-medium">{profileData.phone}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-primary text-white py-3 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-lg hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;