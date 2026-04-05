import banner from "./banner.jpg";
import appointment from "./appointment.png";
import book_appointment from "./book_appointment.jpg";
import calculator from "./calculator.png";
import car from "./car.png";
import Cardiology from "./Cardiology.png";
import clock from "./clock.png";
import doctor_1 from "./doctor_1.jpg";
import doctor_2 from "./doctor_2.jpg";
import doctor_3 from "./doctor_3.jpg";
import doctor_4 from "./doctor_4.jpg";
import doctor from "./doctor.png";
import Fever from "./Fever.png";
import gallery_1 from "./gallery_1.jpg";
import gallery_2 from "./gallery_2.jpg";
import gallery_3 from "./gallery_3.jpg";
import gallery_4 from "./gallery_4.jpg";

import Hematology from "./Hematology.png";
import hero_img from "./hero_img.jpg";
import home from "./home.png";
import Infection from "./Infection.png";
import mission_img1 from "./mission_img1.jpg";
import mission_img2 from "./mission_img2.jpg";
import mobile from "./mobile.png";
import Neurology from "./Neurology.png";
import Oncology from "./Oncology.png";
import Paediatrician from "./Paediatrician.png";
import profile from "./profile.png";
import Pulmonology from "./Pulmonology.png";
import t1 from "./t1.jpg";
import t2 from "./t2.jpg";
import t3 from "./t3.jpg";
import telephone from "./telephone.png";
import why_choose_us from "./why_choose_us.jpg";
import { CheckCheckIcon } from "lucide-react";
import banner_img from "./banner_img.jpg";
import logo from "./logo.png";
export const assets = {
  mission_img1,
  mission_img2,
  profile,
  logo,
  banner_img,
  hero_img,
  why_choose_us,
  banner,
  appointment,
  book_appointment,
};
export const specialtiesData = [
  {
    name: "Hematology",
    image: Hematology,
    description: "Diagnosis and treatment of blood-related disorders.",
  },
  {
    name: "Neurology",
    image: Neurology,
    description: "Care for brain, spine, and nervous system issues.",
  },
  {
    name: "Oncology",
    image: Oncology,
    description: "Cancer prevention, diagnosis, and treatment services.",
  },
  {
    name: "Paediatrician",
    image: Paediatrician,
    description: "Specialized healthcare for infants, children, and teens.",
  },
  {
    name: "Pulmonology",
    image: Pulmonology,
    description: "Treatment for lung and respiratory system conditions.",
  },
  {
    name: "Infection",
    image: Infection,
    description: "Expert care for bacterial, viral, and fungal infections.",
  },
  {
    name: "Cardiology",
    image: Cardiology,
    description: "Heart checkups, treatments, and cardiovascular care.",
  },
  {
    name: "Fever",
    image: Fever,
    description: "Quick consultation for fever and related symptoms.",
  },
];

export const featuresData = [
  {
    image: home,
    heading: "Home MD",
    description:
      "Get medical care from the comfort of your home. Our qualified doctors visit you when you need them most.",
  },
  {
    image: calculator,
    heading: "Book Appointment",
    description:
      "Easily schedule appointments with just a few clicks. Choose your doctor, date, and time instantly.",
  },
  {
    image: mobile,
    heading: "Tele-Health",
    description:
      "Connect with doctors virtually through secure video calls. Get expert advice without leaving your home.",
  },
  {
    image: telephone,
    heading: "Get Consultation",
    description:
      "Talk to a doctor over the phone for quick medical guidance. Perfect for follow-ups and urgent concerns.",
  },
];
export const howItWorks = [
  {
    icon: CheckCheckIcon,
    heading: "Choose Medical Specialist",
    description:
      "Browse and select from our wide range of verified doctors. Find the right specialist for your health concern.",
  },
  {
    icon: CheckCheckIcon,
    heading: "Choose Consultation Service",
    description:
      "Pick how you want to consult — in-person, tele-health, or phone. We make healthcare convenient for you.",
  },
  {
    icon: CheckCheckIcon,
    heading: "Make an Appointment",
    description:
      "Schedule your appointment in just a few clicks. Get instant confirmation for your preferred date and time.",
  },
  {
    icon: CheckCheckIcon,
    heading: "Get Diagnosed",
    description:
      "Meet with the doctor and receive a proper diagnosis. Follow-up instructions and treatment plans included.",
  },
];
export const benefitsData = [
  {
    image: car,
    heading: "Fast And Reliable",
    description:
      "Get quick access to medical services with minimal waiting time. We ensure timely and trustworthy care.",
  },
  {
    image: clock,
    heading: "Healthcare Anywhere Any Time",
    description:
      "Book consultations 24/7 from any location. Your health support is available whenever you need it.",
  },
  {
    image: doctor,
    heading: "Experienced Professionals",
    description:
      "Our team consists of verified and skilled doctors. Receive quality treatment from trusted experts.",
  },
  {
    image: calculator,
    heading: "Easy Appointment",
    description:
      "Scheduling is simple and user-friendly. Choose your doctor, select a slot, and confirm instantly.",
  },
];
export const doctorsData = [
  {
    _id: 1,
    image: doctor_1,
    name: "Dr. Richmond Herrick",
    specialty: "Neurology",
    rating: 5,
    education: "MBBS, MS (Neurosurgery)",
    experience: "12 years",
    fees: 1500,
    location: "City Hospital, Karachi",
    phone: "+92-300-1234567",
    email: "richmond.herrick@example.com",
    buttonText: "Book Appointment",
    description: "Specializing in complex brain and spine surgeries with over a decade of clinical excellence."
  },
  {
    _id: 2,
    image: doctor_2,
    name: "Dr. Olivia Bennett",
    specialty: "Cardiology",
    rating: 4.9,
    education: "MBBS, MD (Cardiology)",
    experience: "10 years",
    fees: 1200,
    location: "Heart Care Clinic, Lahore",
    phone: "+92-322-9876543",
    email: "olivia.bennett@example.com",
    buttonText: "Book Appointment",
    description: "Expert in interventional cardiology and preventive heart care strategies."
  },
  {
    _id: 3,
    image: doctor_3,
    name: "Dr. Sophia Martinez",
    specialty: "Paediatrician",
    rating: 4.8,
    education: "MBBS, DCH (Pediatrics)",
    experience: "8 years",
    fees: 1000,
    location: "Children’s Hospital, Islamabad",
    phone: "+92-345-5678910",
    email: "sophia.martinez@example.com",
    buttonText: "Book Appointment",
    description: "Dedicated to providing compassionate and comprehensive care for infants and children."
  },
  {
    _id: 4,
    image: doctor_4,
    name: "Dr. Amelia Clarke",
    specialty: "Dermatologist",
    rating: 4.7,
    education: "MBBS, MD (Dermatology)",
    experience: "7 years",
    fees: 900,
    location: "Skin Care Clinic, Karachi",
    phone: "+92-312-2233445",
    email: "amelia.clarke@example.com",
    buttonText: "Book Appointment",
    description: "Expert in aesthetic dermatology and treatment of chronic skin conditions."
  },
  {
    _id: 5,
    image: "https://ui-avatars.com/api/?name=James+Wilson&background=6b65e5&color=fff&size=256",
    name: "Dr. James Wilson",
    specialty: "Hematology",
    rating: 4.9,
    education: "MBBS, MD (Hematology)",
    experience: "15 years",
    fees: 1400,
    location: "Blood Care Institute, Lahore",
    phone: "+92-333-1112223",
    email: "james.wilson@example.com",
    buttonText: "Book Appointment",
    description: "Renowned specialist in blood disorders, anemia, and leukemia treatments."
  },
  {
    _id: 6,
    image: "https://ui-avatars.com/api/?name=Sarah+Connor&background=6b65e5&color=fff&size=256",
    name: "Dr. Sarah Connor",
    specialty: "Oncology",
    rating: 5.0,
    education: "MBBS, MS, FRCS (Oncology)",
    experience: "20 years",
    fees: 2000,
    location: "National Cancer Center, Karachi",
    phone: "+92-300-5556667",
    email: "sarah.connor@example.com",
    buttonText: "Book Appointment",
    description: "Pioneer in modern chemotherapy protocols and surgical oncology."
  },
  {
    _id: 7,
    image: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=6b65e5&color=fff&size=256",
    name: "Dr. Arjun Mehta",
    specialty: "Pulmonology",
    rating: 4.6,
    education: "MBBS, MD (Chest Diseases)",
    experience: "9 years",
    fees: 1100,
    location: "Respiratory Care, Islamabad",
    phone: "+92-344-9990001",
    email: "arjun.mehta@example.com",
    buttonText: "Book Appointment",
    description: "Expert in treating asthma, COPD, and sleep-related breathing disorders."
  },
  {
    _id: 8,
    image: "https://ui-avatars.com/api/?name=Lila+Vance&background=6b65e5&color=fff&size=256",
    name: "Dr. Lila Vance",
    specialty: "Infection",
    rating: 4.8,
    education: "MBBS, MD (Internal Medicine)",
    experience: "11 years",
    fees: 950,
    location: "Infectious Disease Clinic, Karachi",
    phone: "+92-321-7778889",
    email: "lila.vance@example.com",
    buttonText: "Book Appointment",
    description: "Specialist in viral infections, tropical diseases, and immunizations."
  },
  {
    _id: 9,
    image: "https://ui-avatars.com/api/?name=Robert+Langdon&background=6b65e5&color=fff&size=256",
    name: "Dr. Robert Langdon",
    specialty: "Fever",
    rating: 4.5,
    education: "MBBS, MCPS",
    experience: "6 years",
    fees: 700,
    location: "General Health Clinic, Lahore",
    phone: "+92-302-3334445",
    email: "robert.langdon@example.com",
    buttonText: "Book Appointment",
    description: "General physician focused on primary care and acute illness management."
  },
  {
    _id: 10,
    image: "https://ui-avatars.com/api/?name=Emily+Stone&background=6b65e5&color=fff&size=256",
    name: "Dr. Emily Stone",
    specialty: "Neurology",
    rating: 4.9,
    education: "MBBS, FCPS (Neurology)",
    experience: "14 years",
    fees: 1300,
    location: "NeuroCenter, Multan",
    phone: "+92-315-6667778",
    email: "emily.stone@example.com",
    buttonText: "Book Appointment",
    description: "Handling stroke management, epilepsy, and neurodegenerative disorders."
  },
  {
    _id: 11,
    image: "https://ui-avatars.com/api/?name=David+Gandy&background=6b65e5&color=fff&size=256",
    name: "Dr. David Gandy",
    specialty: "Cardiology",
    rating: 4.7,
    education: "MBBS, MD, FACC",
    experience: "18 years",
    fees: 1800,
    location: "Premium Heart Care, Karachi",
    phone: "+92-300-0001112",
    email: "david.gandy@example.com",
    buttonText: "Book Appointment",
    description: "Senior consultant with extensive experience in open heart surgery follow-ups."
  },
  {
    _id: 12,
    image: "https://ui-avatars.com/api/?name=Rachel+Green&background=6b65e5&color=fff&size=256",
    name: "Dr. Rachel Green",
    specialty: "Hematology",
    rating: 4.8,
    education: "MBBS, MD (Internal Medicine)",
    experience: "10 years",
    fees: 1100,
    location: "City Labs & Clinic, Islamabad",
    phone: "+92-333-5554443",
    email: "rachel.green@example.com",
    buttonText: "Book Appointment",
    description: "Specialized in pediatric blood disorders and genetic blood screening."
  }
];

export const testimonialsData = [
  {
    image: t1,
    name: "Johnathan Miller",
    designation: "Software Engineer",
    description:
      "I had a wonderful experience booking my appointment through this platform. \
The process was smooth and hassle-free. The doctor was professional and caring. \
I was able to get a proper diagnosis quickly. Highly recommended for anyone seeking reliable healthcare services.",
  },
  {
    image: t2,
    name: "Emily Johnson",
    designation: "Marketing Specialist",
    description:
      "Booking a consultation was super easy and convenient. \
I loved how quickly I could find a doctor in my area. \
The tele-health option saved me a lot of time. \
Great service, I will definitely use it again in the future.",
  },
  {
    image: t3,
    name: "Michael Brown",
    designation: "Business Analyst",
    description:
      "The platform is very user-friendly and well-designed. \
I was able to compare doctors and choose the best one for my needs. \
The appointment reminder system is a great touch. \
I felt supported throughout the whole process.",
  },
];
export const galleryData = [
  {
    image: gallery_1,
    heading: "Surgeons in ICU",
    description:
      "Our experienced surgeons performing critical procedures with precision.",
  },
  {
    image: gallery_2,
    heading: "Modern Operation Theatre",
    description:
      "Fully equipped OT with advanced surgical technology and safety standards.",
  },
  {
    image: gallery_3,
    heading: "Emergency Ward",
    description:
      "Round-the-clock emergency care available for all patients in need.",
  },
  {
    image: gallery_4,
    heading: "Patient Recovery Room",
    description:
      "Comfortable and clean recovery space for post-surgery patient care.",
  },
];
