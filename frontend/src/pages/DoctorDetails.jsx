import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { doctorsData } from "../assets/assets";
import { doctorAPI, appointmentAPI, adminAPI, paymentAPI } from "../services/api";
import toast from "react-hot-toast";
import Icon from "../components/Icon";
import {
  ArrowLeft, Calendar, Clock, DollarSign, GraduationCap,
  Mail, MapPin, Phone, Star, User, Edit, Save, X, Camera, CheckCircle
} from "lucide-react";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap");

  :root {
    --ink:        #0F172A;
    --ink-2:      #334155;
    --ink-3:      #64748B;
    --purple:     #6C63FF;
    --purple-dk:  #5A52D5;
    --purple-pl:  #F0EFFF;
    --cream:      #F8FAFC;
    --line:       #E2E8F0;
    --success:    #22c55e;
    --danger:     #EF4444;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }

  .dd-root {
    font-family: 'Inter', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .dd-bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(to right, rgba(107,101,229,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(107,101,229,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
    pointer-events: none; z-index: 0;
  }

  /* ── TOP BAR ── */
  .dd-topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(253,252,255,0.94);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line);
  }
  .dd-topbar-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px; height: 60px;
    display: flex; align-items: center; gap: 14px;
  }
  .dd-back-btn {
    width: 36px; height: 36px; border-radius: 9px;
    border: 1.5px solid var(--line); background: transparent;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3); cursor: pointer;
    transition: color .16s, border-color .16s, background .16s;
    flex-shrink: 0;
  }
  .dd-back-btn:hover { color: var(--purple); border-color: rgba(107,101,229,0.35); background: var(--purple-pl); }
  .dd-topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; font-weight: 700; color: var(--ink);
  }

  /* ── MAIN ── */
  .dd-main {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 40px 60px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px; align-items: start;
  }

  /* ── DOCTOR CARD (New Layout) ── */
  .dd-doc-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(107,101,229,0.08);
  }

  .dd-header-band {
    height: 160px;
    background: linear-gradient(135deg, #6C63FF 0%, #5A52D5 100%);
    position: relative;
  }
  .dd-header-band::after {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .dd-profile-section {
    padding: 0 30px 30px;
    margin-top: -65px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .dd-avatar-wrap {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: #fff;
    padding: 6px;
    box-shadow: 0 8px 30px rgba(107,101,229,0.15);
    margin-bottom: 20px;
    position: relative;
  }
  .dd-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: var(--purple-pl);
  }

  .dd-doc-name {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; font-weight: 700;
    color: var(--ink); line-height: 1.1;
    margin-bottom: 6px;
  }
  .dd-doc-spec {
    font-size: 0.9rem; font-weight: 600;
    color: var(--purple); letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 16px;
  }
  .dd-avail-badge {
    display: flex; align-items: center; gap: 5px; flex-shrink: 0;
    padding: 5px 12px; border-radius: 20px;
    font-size: 0.7rem; font-weight: 600;
    background: rgba(34,197,94,0.9); color: #fff;
    backdrop-filter: blur(6px);
  }
  .dd-avail-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; animation: dd-pulse 2s ease-in-out infinite; }
  @keyframes dd-pulse { 0%,100% { transform:scale(1);opacity:1; } 50% { transform:scale(1.5);opacity:.6; } }

  /* camera upload overlay */
  .dd-img-upload {
    position: absolute; bottom: 4px; right: 4px;
    background: var(--purple); color: #fff;
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: background .16s, transform .16s;
    border: 3px solid #fff;
  }
  .dd-img-upload:hover { background: var(--purple-dk); transform: scale(1.1); }

  /* rating row */
  .dd-rating-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--line);
  }
  .dd-stars { display: flex; gap: 2px; }
  .dd-star { color: #e2ddf0; }
  .dd-star.filled { color: #f59e0b; }
  .dd-rating-text { font-size: 0.82rem; color: var(--ink-3); margin-left: 8px; }
  .dd-edit-btns { display: flex; gap: 8px; }
  .dd-edit-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px; border: 1.5px solid var(--line);
    font-size: 0.82rem; font-weight: 600;
    transition: all .16s; background: transparent;
  }
  .dd-edit-btn.primary { border-color: var(--purple); color: var(--purple); }
  .dd-edit-btn.primary:hover { background: var(--purple-pl); }
  .dd-edit-btn.success { border-color: var(--success); color: var(--success); }
  .dd-edit-btn.success:hover { background: rgba(34,197,94,0.08); }
  .dd-edit-btn.ghost { color: var(--ink-3); }
  .dd-edit-btn.ghost:hover { background: rgba(11,15,26,0.04); color: var(--ink); }

  /* detail rows */
  .dd-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0; padding: 0;
  }
  .dd-detail-item {
    padding: 18px 20px;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .dd-detail-item:nth-child(even) { border-right: none; }
  .dd-detail-item:nth-last-child(-n+2) { border-bottom: none; }
  .dd-detail-icon-wrap {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--purple-pl);
    display: flex; align-items: center; justify-content: center;
    color: var(--purple); margin-bottom: 10px; flex-shrink: 0;
  }
  .dd-detail-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px;
  }
  .dd-detail-value {
    font-size: 0.9rem; font-weight: 500; color: var(--ink); line-height: 1.4;
  }
  .dd-detail-value a { color: var(--purple); text-decoration: none; }
  .dd-detail-value a:hover { text-decoration: underline; }

  /* edit input inside detail */
  .dd-edit-input {
    width: 100%; padding: 8px 12px; border: 1.5px solid var(--line);
    border-radius: 10px; outline: none;
    font-size: 0.875rem; color: var(--ink); background: var(--cream);
    transition: border-color .16s;
  }
  .dd-edit-input:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(107,101,229,0.1); }

  /* description */
  .dd-description { padding: 20px; border-top: 1px solid var(--line); }
  .dd-description-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--ink-3); margin-bottom: 8px;
  }
  .dd-description-text { font-size: 0.875rem; color: var(--ink-3); line-height: 1.7; font-weight: 300; }
  .dd-edit-textarea {
    width: 100%; padding: 12px; border: 1.5px solid var(--line);
    border-radius: 10px; outline: none;
    font-size: 0.875rem; color: var(--ink); background: var(--cream);
    resize: vertical; min-height: 100px; line-height: 1.6;
    transition: border-color .16s;
  }
  .dd-edit-textarea:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(107,101,229,0.1); }

  /* ── BOOKING FORM ── */
  .dd-booking-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 6px 28px rgba(107,101,229,0.08);
    position: sticky; top: 76px;
  }
  .dd-booking-header {
    padding: 24px 26px 20px;
    border-bottom: 1px solid var(--line);
  }
  .dd-booking-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px;
  }
  .dd-booking-title em { font-style: italic; color: var(--purple); }
  .dd-booking-sub { font-size: 0.845rem; color: var(--ink-3); font-weight: 300; }

  .dd-booking-body { padding: 22px 26px 26px; }

  /* form fields */
  .dd-field { margin-bottom: 16px; }
  .dd-field:last-of-type { margin-bottom: 0; }
  .dd-label {
    display: block; font-size: 0.76rem; font-weight: 600;
    color: var(--ink-2); margin-bottom: 7px; letter-spacing: 0.02em;
  }
  .dd-label span { color: var(--purple); margin-left: 2px; }
  .dd-input-wrap {
    display: flex; align-items: center; gap: 10px;
    border: 1.5px solid var(--line); border-radius: 10px;
    padding: 0 13px; background: var(--cream);
    transition: border-color .16s, box-shadow .16s;
  }
  .dd-input-wrap:focus-within { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(107,101,229,0.1); }
  .dd-input-wrap svg { color: var(--ink-3); flex-shrink: 0; }
  .dd-input, .dd-select {
    flex: 1; padding: 12px 0; border: none; outline: none;
    background: transparent;
    font-size: 0.875rem; color: var(--ink); appearance: none;
  }
  .dd-input::placeholder { color: var(--ink-3); }
  .dd-textarea {
    width: 100%; padding: 12px 14px; border: 1.5px solid var(--line);
    border-radius: 12px; outline: none;
    font-size: 0.875rem; color: var(--ink); background: var(--cream);
    resize: vertical; min-height: 100px; line-height: 1.6;
    transition: border-color .16s;
  }
  .dd-textarea::placeholder { color: var(--ink-3); }
  .dd-textarea:focus { border-color: var(--purple); box-shadow: 0 0 0 4px rgba(107,101,229,0.1); }

  .dd-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* fee box */
  .dd-fee-box {
    background: var(--purple-pl); border: 1px solid rgba(107,101,229,0.2);
    border-radius: 12px; padding: 14px 16px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .dd-fee-label { font-size: 0.82rem; font-weight: 500; color: var(--ink-2); }
  .dd-fee-value {
    font-family: 'Playfair Display', serif;
    font-size: 2.22rem; font-weight: 700; color: var(--purple);
  }

  /* payment chips */
  .dd-pay-chips { display: flex; gap: 10px; margin-bottom: 20px; }
  .dd-pay-chip {
    flex: 1; padding: 10px; border-radius: 10px;
    border: 1.5px solid var(--line); background: transparent;
    font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500;
    color: var(--ink-3); cursor: pointer; text-align: center;
    transition: all .16s;
  }
  .dd-pay-chip.active { border-color: var(--purple); background: var(--purple-pl); color: var(--purple-dk); font-weight: 600; }
  .dd-pay-chip:hover:not(.active) { border-color: rgba(107,101,229,0.3); color: var(--ink); }

  /* submit */
  .dd-submit {
    width: 100%; padding: 13px; border-radius: 10px; border: none;
    background: var(--purple); color: #fff;
    font-size: 1rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em;
    box-shadow: 0 8px 25px rgba(107,101,229,0.3);
    transition: background .18s, transform .16s, box-shadow .18s;
    position: relative; overflow: hidden;
  }
  .dd-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  }
  .dd-submit:hover { background: var(--purple-dk); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(107,101,229,0.42); }
  .dd-submit:active { transform: translateY(0); }
  .dd-submit-note { text-align: center; font-size: 0.76rem; color: var(--ink-3); margin-top: 10px; font-weight: 300; }

  /* ── LOADING / ERROR ── */
  .dd-state {
    position: relative; z-index: 1;
    min-height: 60vh; display: flex;
    flex-direction: column; align-items: center; justify-content: center; gap: 16px;
  }
  .dd-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid var(--purple-pl); border-top-color: var(--purple);
    animation: dd-spin .8s linear infinite;
  }
  @keyframes dd-spin { to { transform: rotate(360deg); } }
  .dd-state-text { font-size: 0.95rem; color: var(--ink-3); font-weight: 300; }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .dd-main { grid-template-columns: 1fr; padding: 24px; }
    .dd-booking-card { position: static; }
    .dd-topbar-inner { padding: 0 24px; }
  }
  @media (max-width: 520px) {
    .dd-row { grid-template-columns: 1fr; }
    .dd-detail-grid { grid-template-columns: 1fr; }
    .dd-detail-item { border-right: none; }
  }
`;

const DoctorDetails = () => {
  const { id } = useParams();
  const { navigate } = useContext(AppContext);
  const routerNavigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [bookedSlots, setBookedSlots] = useState([]);

  const [bookingData, setBookingData] = useState({
    patientName: "", phone: "", email: "",
    appointmentDate: "", appointmentTime: "", symptoms: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.role === "admin");
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await doctorAPI.getById(id);
        const d = response.data.data;
        setDoctor(d);
        setEditFormData({ name: d.name, specialty: d.specialty, education: d.education, experience: d.experience, fees: d.fees, location: d.location, phone: d.phone, email: d.email, description: d.description || "" });
      } catch {
        const s = doctorsData.find(d => d._id === parseInt(id));
        setDoctor(s);
        if (s) setEditFormData({ name: s.name || "", specialty: s.specialty || "", education: s.education || "", experience: s.experience || "", fees: s.fees || 0, location: s.location || "", phone: s.phone || "", email: s.email || "", description: s.description || "" });
      } finally { setLoading(false); }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = e => setBookingData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleEditChange = e => setEditFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!doctor || !bookingData.appointmentDate) return;
      try {
        const response = await appointmentAPI.getSlots(doctor._id || doctor.id, {
          appointmentDate: bookingData.appointmentDate
        });
        const appointments = response.data.data;
        // Collect times of non-cancelled appointments (backend already filters non-cancelled for slots)
        const booked = appointments.map(a => a.appointmentTime);
        setBookedSlots(booked);

        // Reset selected time if it's now booked
        if (booked.includes(bookingData.appointmentTime)) {
          setBookingData(prev => ({ ...prev, appointmentTime: "" }));
          toast.error("The previously selected time slot is now booked. Please choose another.");
        }
      } catch (error) {
        console.error("Failed to fetch booked slots:", error);
      }
    };
    fetchBookedSlots();
  }, [doctor, bookingData.appointmentDate]);

  const handleBookingSubmit = async () => {
    const { patientName, phone, email, appointmentDate, appointmentTime } = bookingData;
    if (!patientName || !phone || !email || !appointmentDate || !appointmentTime) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser?.id) { 
        toast.error("Please login to book an appointment"); 
        routerNavigate("/login"); 
        return; 
      }

      // 1. Create Appointment (Status will be 'pending')
      const appointmentResponse = await appointmentAPI.create({
        patientId: currentUser.id, 
        doctorId: doctor._id || doctor.id,
        patientName, 
        patientPhone: phone, 
        patientEmail: email,
        appointmentDate, 
        appointmentTime, 
        symptoms: bookingData.symptoms,
        paymentMethod, 
        consultationType: "in-person",
        fees: doctor.fees || doctor.doctorProfile?.fees || 100,
      });

      const appointment = appointmentResponse.data.data;

      // 2. Handle Online Payment if selected
      if (paymentMethod === "online") {
        await initiateRazorpayPayment(appointment, currentUser);
      } else {
        toast.success(`Appointment booked with Dr. ${doctor.name}!`);
        setBookingData({ patientName: "", phone: "", email: "", appointmentDate: "", appointmentTime: "", symptoms: "" });
        routerNavigate("/my-appointments");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment");
    }
  };

  const initiateRazorpayPayment = async (appointment, user) => {
    try {
      // Create Razorpay Order on server
      const orderResponse = await paymentAPI.createOrder(appointment._id);
      const order = orderResponse.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyId',
        amount: order.amount,
        currency: order.currency,
        name: "MediCare AI",
        description: `Appointment with Dr. ${doctor.name}`,
        image: "/logo.png",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // Verify payment on server
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId: appointment._id
            });
            
            toast.success("Payment successful! Appointment confirmed.");
            setBookingData({ patientName: "", phone: "", email: "", appointmentDate: "", appointmentTime: "", symptoms: "" });
            routerNavigate("/my-appointments");
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          // Ensure phone number starts with 91 or is a 10-digit number for Razorpay test mode
          contact: (user.phone || '9999999999').replace(/[^0-9]/g, '').slice(-10)
        },
        theme: {
          color: "#6b65e5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Could not initiate payment. Please try again.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await adminAPI.updateDoctor(doctor._id || doctor.id, editFormData);
      setDoctor(p => ({ ...p, ...editFormData }));
      setIsEditing(false); setImagePreview(null); setImageFile(null);
      toast.success("Doctor updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); setImagePreview(null); setImageFile(null);
    setEditFormData({ name: doctor.name, specialty: doctor.specialty, education: doctor.education, experience: doctor.experience, fees: doctor.fees, location: doctor.location, phone: doctor.phone, email: doctor.email, description: doctor.description || "" });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setImageFile(file);
    const r = new FileReader();
    r.onloadend = () => setImagePreview(r.result);
    r.readAsDataURL(file);
  };

  const renderStars = rating => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={15} className={`dd-star${i < rating ? " filled" : ""}`} fill={i < rating ? "#f59e0b" : "none"} />
  ));

  const detailItems = doctor ? [
    { mIcon: "school",          label: "Education",         field: "education", value: doctor.education || doctor.doctorProfile?.education, type: "text" },
    { mIcon: "schedule",        label: "Experience",        field: "experience", value: doctor.experience || doctor.doctorProfile?.experience, type: "text" },
    { mIcon: "payments",        label: "Consultation Fee",  field: "fees", value: `₹ ${doctor.fees || doctor.doctorProfile?.fees || 100}`, type: "number" },
    { mIcon: "location_on",     label: "Location",          field: "location", value: doctor.location || doctor.doctorProfile?.city || "City", type: "text" },
    { mIcon: "call",            label: "Phone",             field: "phone", value: doctor.phone || doctor.doctorProfile?.phone, href: `tel:${doctor.phone}`, type: "tel" },
    { mIcon: "mail",            label: "Email",             field: "email", value: doctor.email || doctor.doctorProfile?.email, href: `mailto:${doctor.email}`, type: "email" },
  ] : [];

  const timeSlots = [
    { value: "09:00", label: "09:00 AM" }, { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" }, { value: "12:00", label: "12:00 PM" },
    { value: "14:00", label: "02:00 PM" }, { value: "15:00", label: "03:00 PM" },
    { value: "16:00", label: "04:00 PM" }, { value: "17:00", label: "05:00 PM" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="dd-root">
        <div className="dd-bg-grid" />

        {/* ── TOPBAR ── */}
        <div className="dd-topbar">
          <div className="dd-topbar-inner">
            <button className="dd-back-btn" onClick={() => window.history.back()} type="button">
              <ArrowLeft size={16} />
            </button>
            <span className="dd-topbar-title">
              {loading ? "Doctor Details" : doctor ? `Dr. ${doctor.name}` : "Doctor Details"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="dd-state">
            <div className="dd-spinner" />
            <div className="dd-state-text">Loading doctor details…</div>
          </div>
        ) : !doctor ? (
          <div className="dd-state">
            <div style={{ fontSize: "3rem" }}>🔎</div>
            <div className="dd-state-text">Doctor not found.</div>
          </div>
        ) : (
          <div className="dd-main">

            {/* ── DOCTOR CARD ── */}
            <div className="dd-doc-card">
              {/* header band */}
              <div className="dd-header-band" />

              {/* profile area */}
              <div className="dd-profile-section">
                <div className="dd-avatar-wrap">
                  <img
                    className="dd-avatar-img"
                    src={imagePreview || doctor.image || doctor.doctorProfile?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=6C63FF&color=ffffff&size=256`}
                    alt={doctor.name}
                  />
                  {isAdmin && isEditing && (
                    <label className="dd-img-upload">
                      <Camera size={18} />
                      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    </label>
                  )}
                </div>

                {isEditing ? (
                  <div style={{ width: '100%', maxWidth: '400px' }}>
                    <input 
                      className="dd-edit-input" 
                      name="name" 
                      value={editFormData.name} 
                      onChange={handleEditChange} 
                      placeholder="Doctor Name"
                      style={{ fontSize: "1.4rem", fontWeight: 700, textAlign: 'center', marginBottom: 8 }} 
                    />
                    <input 
                      className="dd-edit-input" 
                      name="specialty" 
                      value={editFormData.specialty} 
                      onChange={handleEditChange} 
                      placeholder="Specialty"
                      style={{ fontSize: "0.85rem", textAlign: 'center' }} 
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="dd-doc-name">Dr. {doctor.name}</h1>
                    <div className="dd-doc-spec">{doctor.specialty || doctor.doctorProfile?.specialty}</div>
                    <div className="dd-avail-badge">
                      <div className="dd-avail-dot" />Available
                    </div>
                  </>
                )}
              </div>

              {/* rating + edit */}
              <div className="dd-rating-row">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="dd-stars">{renderStars(doctor.rating || 5)}</div>
                  <span className="dd-rating-text">{doctor.rating || 5}.0 rating</span>
                </div>
                {isAdmin && !isEditing && (
                  <button className="dd-edit-btn primary" onClick={() => setIsEditing(true)} type="button">
                    <Edit size={13} />Edit
                  </button>
                )}
                {isEditing && (
                  <div className="dd-edit-btns">
                    <button className="dd-edit-btn success" onClick={handleSaveChanges} type="button"><Save size={13} />Save</button>
                    <button className="dd-edit-btn ghost" onClick={handleCancelEdit} type="button"><X size={13} />Cancel</button>
                  </div>
                )}
              </div>

              {/* details grid */}
              <div className="dd-detail-grid">
                {detailItems.map(({ mIcon, label, field, value, href, type }) => (
                  <div className="dd-detail-item" key={field}>
                    <div className="dd-detail-icon-wrap">
                      <Icon name={mIcon} size={18} weight={300} />
                    </div>
                    <div className="dd-detail-label">{label}</div>
                    <div className="dd-detail-value">
                      {isEditing ? (
                        <input className="dd-edit-input" type={type} name={field} value={editFormData[field] || ""} onChange={handleEditChange} />
                      ) : href ? (
                        <a href={href}>{value || "—"}</a>
                      ) : (
                        value || "—"
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* description */}
              {(doctor.description || isEditing) && (
                <div className="dd-description">
                  <div className="dd-description-label">About</div>
                  {isEditing ? (
                    <textarea className="dd-edit-textarea" name="description" value={editFormData.description} onChange={handleEditChange} placeholder="Write a short bio…" />
                  ) : (
                    <div className="dd-description-text">{doctor.description}</div>
                  )}
                </div>
              )}
            </div>

            {/* ── BOOKING FORM ── */}
            <div className="dd-booking-card">
              <div className="dd-booking-header">
                <div className="dd-booking-title">Book an <em>Appointment</em></div>
                <div className="dd-booking-sub">Schedule your consultation with {doctor.name}</div>
              </div>

              <div className="dd-booking-body">
                <div className="dd-field">
                  <label className="dd-label">Patient Name <span>*</span></label>
                  <div className="dd-input-wrap">
                    <Icon name="person" size={18} weight={300} />
                    <input className="dd-input" name="patientName" value={bookingData.patientName} onChange={handleChange} placeholder="Full name" />
                  </div>
                </div>

                <div className="dd-row dd-field">
                  <div>
                    <label className="dd-label">Phone <span>*</span></label>
                    <div className="dd-input-wrap">
                      <Icon name="call" size={18} weight={300} />
                      <input className="dd-input" name="phone" value={bookingData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="dd-label">Email <span>*</span></label>
                    <div className="dd-input-wrap">
                      <Icon name="mail" size={18} weight={300} />
                      <input className="dd-input" type="email" name="email" value={bookingData.email} onChange={handleChange} placeholder="you@example.com" />
                    </div>
                  </div>
                </div>

                <div className="dd-row dd-field">
                  <div>
                    <label className="dd-label">Date <span>*</span></label>
                    <div className="dd-input-wrap">
                      <Icon name="calendar_today" size={18} weight={300} />
                      <input className="dd-input" type="date" name="appointmentDate" value={bookingData.appointmentDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} />
                    </div>
                  </div>
                  <div>
                    <label className="dd-label">Time <span>*</span></label>
                    <div className="dd-input-wrap">
                      <Icon name="schedule" size={18} weight={300} />
                      <select className="dd-select" name="appointmentTime" value={bookingData.appointmentTime} onChange={handleChange}>
                        <option value="">Select time</option>
                        {timeSlots.map(s => {
                          const isBooked = bookedSlots.includes(s.value);
                          return (
                            <option key={s.value} value={s.value} disabled={isBooked}>
                              {s.label} {isBooked ? "(Booked)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="dd-field">
                  <label className="dd-label">Symptoms / Reason</label>
                  <textarea className="dd-textarea" name="symptoms" value={bookingData.symptoms} onChange={handleChange} placeholder="Describe your symptoms or reason for visit…" />
                </div>

                {/* fee */}
                <div className="dd-fee-box">
                  <span className="dd-fee-label">Consultation Fee</span>
                  <span className="dd-fee-value">₹ {doctor.fees || doctor.doctorProfile?.fees || 100}</span>
                </div>

                {/* payment method */}
                <div className="dd-pay-chips">
                  <button className={`dd-pay-chip${paymentMethod === "cash" ? " active" : ""}`} type="button" onClick={() => setPaymentMethod("cash")}>
                    🏥 Pay at Clinic
                  </button>
                  <button className={`dd-pay-chip${paymentMethod === "online" ? " active" : ""}`} type="button" onClick={() => setPaymentMethod("online")}>
                    💳 Pay Online
                  </button>
                </div>

                <button className="dd-submit" onClick={handleBookingSubmit} type="button">
                  {paymentMethod === "cash" ? "Confirm Appointment →" : "Pay & Confirm →"}
                </button>
                <p className="dd-submit-note">✓ Confirmation call within 24 hours</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorDetails;