import { Calendar, Clock, Mail, MapPin, Phone, User, Stethoscope } from "lucide-react";
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
            response = await appointmentAPI.getByDoctor(user.id);
          } else {
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
    <div className="min-h-screen font-sans bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")" }} />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary to-[#5A52D5] text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm shadow-soft mb-6 border border-white/20">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            My <em className="italic opacity-90">Appointments</em>
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto font-light">
            View and manage your scheduled medical consultations and patient history.
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        {loading ? (
          <div className="bg-white rounded-[24px] shadow-soft p-12 text-center border border-slate-100">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-[24px] shadow-soft p-16 text-center border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              📅
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">No Appointments</h3>
            <p className="text-slate-500">You don't have any scheduled appointments at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-[24px] shadow-soft overflow-hidden border border-slate-100 transition-all hover:shadow-lg hover:border-primary/20"
              >
                {/* Header */}
                <div className="bg-slate-50 p-5 px-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 flex-shrink-0">
                      {appointment.doctorId?.image ? (
                         <img src={appointment.doctorId.image} alt="Doctor" className="w-full h-full object-cover" />
                      ) : (
                         <Stethoscope className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 font-serif">
                        {appointment.doctorId?.name || "Unknown Doctor"}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {appointment.doctorId?.specialty || "General"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {user?.role === 'doctor' ? (
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(e.target.value, appointment._id)}
                        className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none font-medium shadow-sm transition-all"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="cancelled">❌ Cancelled</option>
                        <option value="completed">🎉 Completed</option>
                      </select>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1.5
                        ${appointment.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                        appointment.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        appointment.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full 
                          ${appointment.status === 'confirmed' ? 'bg-green-500' :
                            appointment.status === 'cancelled' ? 'bg-red-500' :
                            appointment.status === 'completed' ? 'bg-blue-500' :
                            'bg-amber-500'}`} />
                        {appointment.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Appointment Details */}
                    <div className="space-y-5">
                      <h4 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4">
                        Appointment Details
                      </h4>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                           <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {formatDate(appointment.appointmentDate)}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">Date</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                           <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {appointment.appointmentTime}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">Time</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                           <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {appointment.doctorId?.location || "Clinic Address"}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">Location</p>
                        </div>
                      </div>

                      <div className="bg-primary/5 rounded-2xl p-5 mt-2 border border-primary/10">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium text-sm">Consultation Fee</span>
                          <span className="text-2xl font-serif font-bold text-primary">
                            ₹ {appointment.fees}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary/10">
                           <span className="text-slate-500 text-xs">Payment Method</span>
                           <span className="text-slate-700 text-sm font-semibold capitalize">
                             {appointment.paymentMethod === "cash" ? "🏥 Pay At Clinic" : "💳 Online"}
                           </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - patient Details */}
                    <div className="space-y-5">
                      <h4 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4">
                        {user?.role === 'doctor' ? 'Patient Information' : 'Your Information'}
                      </h4>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                           <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user?.role === 'doctor' ? appointment.patientName : user.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">Name</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                           <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <a
                            href={`tel:${user?.role === 'doctor' ? appointment.patientPhone : user.phone}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {user?.role === 'doctor' ? appointment.patientPhone : user.phone}
                          </a>
                          <p className="text-xs text-slate-500 mt-0.5">Phone Contact</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                           <Mail className="w-4 h-4" />
                        </div>
                        <div className="break-all">
                          <a
                            href={`mailto:${user?.role === 'doctor' ? appointment.patientEmail : user.email}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {user?.role === 'doctor' ? appointment.patientEmail : user.email}
                          </a>
                          <p className="text-xs text-slate-500 mt-0.5">Email Contact</p>
                        </div>
                      </div>

                      {appointment.symptoms && (
                        <div className="bg-slate-50 rounded-2xl p-4 mt-2 border border-slate-100">
                          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                            Symptoms / Reason
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
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