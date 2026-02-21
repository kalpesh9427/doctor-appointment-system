import { Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { appointmentAPI } from "../services/api";
import toast from "react-hot-toast";

const MyAppointments = () => {
  const { user } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        try {
          let response;
          if (user.role === 'doctor') {
            // Fetch appointments for doctor
            response = await appointmentAPI.getByDoctor(user.id);
          } else {
            // Fetch appointments for patient
            response = await appointmentAPI.getByPatient(user.id);
          }
          setAppointments(response.data.data);
        } catch (error) {
          console.error('Error fetching appointments:', error);
          toast.error('Failed to load appointments');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStatusChange = async (newStatus, appointmentId) => {
    try {
      const response = await appointmentAPI.updateStatus(appointmentId, newStatus);
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app._id === appointmentId ? { ...app, status: response.data.data.status } : app
        )
      );
      toast.success("Appointment status updated successfully!");
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Appointments
          </h1>
          <p className="text-xl text-white/90">
            View and manage your scheduled medical consultations
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-10">
            <p>Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10">
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={appointment.doctorId?.image || "https://via.placeholder.com/150"}
                        alt={appointment.doctorId?.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {appointment.doctorId?.name}
                        </h3>
                        <p className="text-primary font-medium">
                          {appointment.doctorId?.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2">
                      {user?.role === 'doctor' ? (
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(e.target.value, appointment._id)}
                          className="bg-transparent focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Appointment Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Appointment Details
                      </h4>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {formatDate(appointment.appointmentDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Appointment Date
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {appointment.appointmentTime}
                          </p>
                          <p className="text-sm text-gray-600">Time</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {appointment.doctorId?.location}
                          </p>
                          <p className="text-sm text-gray-600">Location</p>
                        </div>
                      </div>

                      <div className="bg-primary/5 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">
                            {" "}
                            Consultation Fee:
                          </span>
                          <span className="text-xl font-bold text-primary">
                            $ {appointment.fees}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          Payment:
                          {appointment.paymentMethod === "cash"
                            ? "Pay At Clinic"
                            : "Online"}
                        </p>
                      </div>
                    </div>
                    {/* Right Column - patient Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        {user?.role === 'doctor' ? 'Patient Information' : 'Your Information'}
                      </h4>

                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {user?.role === 'doctor' ? appointment.patientName : user.name}
                          </p>
                          <p className="text-sm text-gray-600">Name</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <a
                            href={`tel:${user?.role === 'doctor' ? appointment.patientPhone : user.phone}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {user?.role === 'doctor' ? appointment.patientPhone : user.phone}
                          </a>
                          <p className="text-sm text-gray-600">Phone Number</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <a
                            href={`mailto:${user?.role === 'doctor' ? appointment.patientEmail : user.email}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {user?.role === 'doctor' ? appointment.patientEmail : user.email}
                          </a>
                          <p className="text-sm text-gray-600">Email Address</p>
                        </div>
                      </div>

                      {appointment.symptoms && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Symptoms/Reason:
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.symptoms}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyAppointments;