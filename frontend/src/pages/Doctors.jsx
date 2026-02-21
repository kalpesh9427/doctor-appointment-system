import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Star, MapPin, Phone, Stethoscope, X, User } from "lucide-react";
import { doctorAPI } from "../services/api"; // Switched to public API

const Doctors = () => {
  const { navigate } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('=== PUBLIC DOCTORS PAGE FETCH ===');
        console.log('Fetching doctors with search term:', searchTerm);

        // Use public API
        const response = await doctorAPI.getAll({ search: searchTerm });
        console.log('Doctors API response:', response);

        let doctorsData = response.data?.data || response.data || [];
        console.log('Raw doctors data:', doctorsData);
        console.log('Total doctors received:', doctorsData.length);

        if (!Array.isArray(doctorsData)) {
          throw new Error('Invalid data format received from server');
        }

        // Filter active doctors (though API likely handles this, good to be safe)
        const visibleDoctors = doctorsData.filter(doctor => doctor.isActive !== false);

        setDoctors(visibleDoctors);
        setFilteredDoctors(visibleDoctors);

        // Extract unique specialties
        const uniqueSpecialties = [...new Set(visibleDoctors
          .map(doc => doc.specialty)
          .filter(Boolean))];
        setSpecialties(uniqueSpecialties);
        console.log('Available specialties:', uniqueSpecialties);

      } catch (err) {
        console.error('Error fetching doctors:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchTerm]);

  // Enhanced filter logic for specialty filtering
  useEffect(() => {
    let result = doctors;

    if (selectedSpecialty) {
      result = result.filter(d =>
        d.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.specialty?.toLowerCase().includes(term) ||
        d.clinicName?.toLowerCase().includes(term) ||
        d.city?.toLowerCase().includes(term) ||
        d.education?.toLowerCase().includes(term)
      );
    }

    setFilteredDoctors(result);
  }, [selectedSpecialty, doctors]);

  // Handle specialty filter change
  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading our expert doctors...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Meet Our <span className="text-blue-600">Expert Doctors</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Highly qualified medical professionals dedicated to your health and wellbeing
          </p>
        </div>

        {/* SEARCH AND FILTER SECTION */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search doctors by name, specialty, clinic, or city..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <select
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Specialties</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          {(searchTerm || selectedSpecialty) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("");
              }}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Active filters display */}
        {(searchTerm || selectedSpecialty) && (
          <div className="bg-blue-50 rounded-lg p-4 max-w-2xl mx-auto mb-8 text-center">
            <p className="text-blue-800">
              <span className="font-semibold">Active filters:</span>
              {searchTerm && ` Search: "${searchTerm}"`}
              {selectedSpecialty && ` Specialty: "${selectedSpecialty}"`}
            </p>
          </div>
        )}

        {/* Results info */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredDoctors.length}</span> verified doctors
            {doctors.length !== filteredDoctors.length && ` (filtered from ${doctors.length} total)`}
          </p>
        </div>

        {error ? (
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Error Loading Doctors</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-20">
            <Stethoscope className="mx-auto w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm || selectedSpecialty
                ? "Try adjusting your search criteria or clearing the filters."
                : "We couldn't find any doctors in the system. Please check if doctors have been added through the admin panel."}
            </p>
            {(searchTerm || selectedSpecialty) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("");
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                {/* Doctor Image */}
                <div className="relative h-56 bg-gradient-to-br from-blue-400 to-indigo-600">
                  <img
                    src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=4f46e5&color=ffffff&size=128`}
                    className="w-full h-full object-cover"
                    alt={doctor.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${doctor.isActive !== false
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${doctor.isActive !== false
                          ? "bg-white animate-pulse"
                          : "bg-white"
                        }`}></div>
                      {doctor.isActive !== false ? "Available" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{doctor.name}</h3>
                  <p className="text-blue-600 font-semibold text-lg mb-4">{doctor.specialty}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.city || 'City'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Stethoscope className="w-4 h-4" />
                      <span>{doctor.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{doctor.clinicName || 'Private Practice'}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">License</p>
                      <p className="font-semibold text-gray-800">{doctor.licenseNumber || 'N/A'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/doctor/${doctor._id}`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;