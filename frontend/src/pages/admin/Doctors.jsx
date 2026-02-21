import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, EyeOff, UserPlus, Stethoscope, X, Upload } from "lucide-react";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

const Doctors = () => {
  console.log('Admin Doctors component loaded');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialty: "",
    education: "",
    experience: "",
    licenseNumber: "",
    fees: "",
    consultationType: ["in-person"],
    clinicName: "",
    address: "",
    city: "",
    description: ""
  });

  // Fetch doctors - strict filtering for admin-added active doctors only
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching doctors with search term:', searchTerm);
      const response = await adminAPI.getAllDoctors({ search: searchTerm });
      console.log('Doctors API response:', response);
      let doctorsData = response.data?.data?.doctors || response.data?.doctors || [];
      console.log('Raw doctors data:', doctorsData);

      if (!Array.isArray(doctorsData)) {
        throw new Error('Invalid data format received from server');
      }

      // Very strict filtering: Only show doctors with complete admin profiles
      const filteredDoctors = doctorsData.filter(doctor => {
        // Must have ALL required fields to be considered admin-added
        const hasCompleteProfile = doctor.doctorProfile && 
          doctor.doctorProfile.specialty && 
          doctor.doctorProfile.education && 
          doctor.doctorProfile.experience &&
          doctor.doctorProfile.licenseNumber &&
          doctor.doctorProfile.fees &&
          doctor.doctorProfile.clinicName &&
          doctor.doctorProfile.address &&
          doctor.doctorProfile.city;
        
        // Must be active (unless showInactive is true)
        const isActive = showInactive ? true : (doctor.doctorProfile?.isActive === true);
        
        // Debug logging
        console.log('Doctor filtering details:', {
          name: doctor.name,
          email: doctor.email,
          hasDoctorProfile: !!doctor.doctorProfile,
          requiredFields: {
            specialty: !!doctor.doctorProfile?.specialty,
            education: !!doctor.doctorProfile?.education,
            experience: !!doctor.doctorProfile?.experience,
            licenseNumber: !!doctor.doctorProfile?.licenseNumber,
            fees: !!doctor.doctorProfile?.fees,
            clinicName: !!doctor.doctorProfile?.clinicName,
            address: !!doctor.doctorProfile?.address,
            city: !!doctor.doctorProfile?.city
          },
          hasCompleteProfile,
          isActive: doctor.doctorProfile?.isActive,
          showInactive,
          willShow: hasCompleteProfile && isActive
        });
        
        return hasCompleteProfile && isActive;
      });

      console.log('Final filtered doctors count:', filteredDoctors.length);
      console.log('Filtered doctors:', filteredDoctors);
      setDoctors(filteredDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch doctors";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, showInactive]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes for consultation types
  const handleConsultationTypeChange = (type) => {
    const newTypes = formData.consultationType.includes(type)
      ? formData.consultationType.filter(t => t !== type)
      : [...formData.consultationType, type];
    
    setFormData({
      ...formData,
      consultationType: newTypes
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      specialty: "",
      education: "",
      experience: "",
      licenseNumber: "",
      fees: "",
      consultationType: ["in-person"],
      clinicName: "",
      address: "",
      city: "",
      description: ""
    });
    setImagePreview(null);
    setImageFile(null);
    setEditingDoctor(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingDoctor) {
        // Update existing doctor
        await adminAPI.updateDoctor(editingDoctor._id, formData);
        toast.success("Doctor updated successfully");
      } else {
        // Create new doctor with all required fields
        await adminAPI.createDoctor(formData);
        toast.success("Doctor created successfully");
      }
      
      setShowAddModal(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || "Failed to save doctor");
    }
  };

  // Handle edit
  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      password: "",
      specialty: doctor.doctorProfile?.specialty || "",
      education: doctor.doctorProfile?.education || "",
      experience: doctor.doctorProfile?.experience || "",
      licenseNumber: doctor.doctorProfile?.licenseNumber || "",
      fees: doctor.doctorProfile?.fees || "",
      consultationType: doctor.doctorProfile?.consultationType || ["in-person"],
      clinicName: doctor.doctorProfile?.clinicName || "",
      address: doctor.doctorProfile?.address || "",
      city: doctor.doctorProfile?.city || "",
      description: doctor.doctorProfile?.description || ""
    });
    setImagePreview(doctor.doctorProfile?.image || null);
    setShowAddModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await adminAPI.deleteDoctor(id);
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Failed to delete doctor");
      }
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id) => {
    try {
      await adminAPI.toggleDoctorStatus(id);
      toast.success("Doctor status updated");
      fetchDoctors();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor status");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctor Management</h1>
          <p className="text-gray-600">Manage active doctors added through admin panel only</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showInactive 
                ? "bg-orange-100 text-orange-800 hover:bg-orange-200" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showInactive ? "Show Active Only" : "Show Inactive Too"}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Doctor
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search admin-added active doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">Error loading doctors</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchDoctors} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading admin doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center">
            <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {showInactive ? "No admin-added doctors found" : "No active admin doctors found"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Only doctors added through this admin panel will appear here
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first doctor
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clinic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={doctor.doctorProfile?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`}
                          alt={doctor.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                          <div className="text-sm text-gray-500">{doctor.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.doctorProfile?.specialty}</div>
                      <div className="text-sm text-gray-500">{doctor.doctorProfile?.education}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.doctorProfile?.clinicName}</div>
                      <div className="text-sm text-gray-500">{doctor.doctorProfile?.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.doctorProfile?.licenseNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${doctor.doctorProfile?.fees || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        doctor.doctorProfile?.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {doctor.doctorProfile?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(doctor._id)}
                          className={`p-2 rounded-full ${
                            doctor.doctorProfile?.isActive
                              ? "text-red-600 hover:bg-red-100"
                              : "text-green-600 hover:bg-green-100"
                          }`}
                          title={doctor.doctorProfile?.isActive ? "Deactivate" : "Activate"}
                        >
                          {doctor.doctorProfile?.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john.smith@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingDoctor ? "New Password (optional)" : "Password *"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      required={!editingDoctor}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                    <input
                      type="text"
                      name="specialty"
                      required
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Cardiology, Pediatrics, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education *</label>
                    <input
                      type="text"
                      name="education"
                      required
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MD, PhD, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
                    <input
                      type="text"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10 years in Cardiology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      required
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MED123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees *</label>
                    <input
                      type="number"
                      name="fees"
                      required
                      value={formData.fees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name *</label>
                    <input
                      type="text"
                      name="clinicName"
                      required
                      value={formData.clinicName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City Medical Center"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Medical Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="New York"
                    />
                  </div>
                </div>

                {/* Consultation Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Types</label>
                  <div className="flex flex-wrap gap-3">
                    {['in-person', 'tele-health', 'phone'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.consultationType.includes(type)}
                          onChange={() => handleConsultationTypeChange(type)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the doctor's expertise and practice..."
                  ></textarea>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                      />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-5 h-5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imageFile && (
                      <span className="text-sm text-gray-600">{imageFile.name}</span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingDoctor ? "Update Doctor" : "Create Doctor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;