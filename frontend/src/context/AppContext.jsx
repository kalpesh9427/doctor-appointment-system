import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { specialtiesData } from "../assets/assets";
import { specialtyAPI, doctorAPI } from "../services/api";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [healthSpecialties, setHealthSpecialties] = useState([]);
  
  const fetchHealthSpecialties = async () => {
    try {
      const response = await specialtyAPI.getAll();
      setHealthSpecialties(response.data.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      // Fallback to static data if API fails
      setHealthSpecialties(specialtiesData);
    }
  };
  
  const fetchDoctors = async (searchTerm = '') => {
    try {
      const response = await doctorAPI.getAll({ search: searchTerm });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  };
  
  useEffect(() => {
    fetchHealthSpecialties();
    
    // Check if user is logged in from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(userData);
      setDoctor(userData.role === 'doctor');
      
      // If user is a doctor, fetch their profile
      if (userData.role === 'doctor') {
        fetchDoctorProfile(storedToken);
      }
    }
  }, []);
  
  const fetchDoctorProfile = async (authToken) => {
    try {
      console.log('Fetching doctor profile with token:', authToken ? 'Token present' : 'No token');
      const response = await authAPI.getDoctorProfile();
      console.log('Doctor profile response:', response.data);
      setDoctorProfile(response.data.doctor);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      console.error('Error response:', error.response?.data);
    }
  };
  
  const value = {
    navigate,
    user,
    setUser,
    doctor,
    setDoctor,
    doctorProfile,
    setDoctorProfile,
    token,
    setToken,
    loading,
    setLoading,
    healthSpecialties,
    fetchHealthSpecialties,
    fetchDoctors,
    fetchDoctorProfile
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
