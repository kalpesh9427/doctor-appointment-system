import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Lock, MailIcon, User2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";

const Login = () => {
  const { navigate, user, setUser, setLoading, loading, setDoctor, setToken } =
    useContext(AppContext);
  
  const routerNavigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roll: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setLoading(true);
    
    try {
      console.log('Attempting login with:', {
        email: formData.email,
        password: formData.password,
        role: formData.roll
      });
      
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        role: formData.roll
      });
      
      const { token, user } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update context
      setUser(user);
      setDoctor(user.role === 'doctor');
      setToken(token);
      
      // If user is a doctor, fetch their profile
      if (user.role === 'doctor') {
        try {
          const profileResponse = await authAPI.getDoctorProfile();
          console.log('Doctor profile fetched:', profileResponse.data);
          // The doctor profile is in profileResponse.data.doctor
        } catch (profileError) {
          console.error('Error fetching doctor profile:', profileError);
          console.error('Profile error response:', profileError.response?.data);
          // Don't show error toast for profile fetch failure, just log it
        }
      }
      
      toast.success(`${user.role} logged in successfully`);
      
      // Navigate based on role
      if (user.role === 'doctor') {
        routerNavigate('/doctor-dashboard');
      } else {
        routerNavigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Only show toast error for actual login failures, not profile fetch failures
      if (error.response?.status !== 404) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EBEBFE] min-h-screen py-32 mt-3">
      <form
        onSubmit={handleSubmit}
        className="max-w-96 w-full mx-auto  text-center border border-gray-300/60 rounded-2xl px-8 bg-primary"
      >
        <h1 className="text-white text-3xl mt-10 font-medium">Login</h1>
        <p className="text-white text-sm mt-2">Please sign in to continue</p>
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MailIcon />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent text-gray-800 placeholder-gray-800 outline-none text-sm w-full h-full"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <User2Icon />
          <select
            name="roll"
            value={formData.roll}
            onChange={handleChange}
            className="bg-transparent text-gray-800 placeholder-gray-800 outline-none text-sm w-full h-full"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-transparent text-gray-800 placeholder-gray-800 outline-none text-sm w-full h-full"
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-secondary  cursor-pointer hover:opacity-90 transition-opacity"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="py-4 text-white">
          Don't have an account?
          <Link to="/signup">
            <span className="text-secondary">Signup</span>
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
