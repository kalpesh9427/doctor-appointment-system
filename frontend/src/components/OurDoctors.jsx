import { useContext } from "react";
import { doctorsData } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import { StarIcon, ArrowUpRight } from "lucide-react";

const OurDoctors = () => {
  const { navigate } = useContext(AppContext);
  return (
    <section className="section-container">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--purple)] mb-4">
          <div className="w-8 h-[2px] bg-[var(--purple)] rounded-full" />
          Our Specialists
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[var(--ink)] mb-6 leading-tight">
          Our <span className="italic text-[var(--purple)]">Specialist</span> Doctors
        </h2>
        <p className="max-w-2xl text-[var(--ink-3)] text-lg font-light leading-relaxed">
          Our team of highly qualified specialists is dedicated to providing
          expert care tailored to your unique health needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {doctorsData.map((doctor, index) => (
          <div
            key={index}
            className="hover-card group flex flex-col sm:flex-row items-center gap-8 p-6 rounded-2xl cursor-pointer"
            onClick={() => {
              navigate("/doctor-details/" + doctor._id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-40 h-40 flex-shrink-0 bg-[var(--warm)] rounded-xl overflow-hidden">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--ink)] mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-[var(--purple)] font-medium text-sm tracking-wide uppercase">{doctor.specialty}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--purple-pl)] px-3 py-1 rounded-full">
                  <StarIcon className="w-3.5 h-3.5 text-[var(--purple)] fill-[var(--purple)]" />
                  <span className="text-[var(--purple)] font-bold text-xs">{doctor.rating}</span>
                </div>
              </div>
              
              <div className="h-px bg-[var(--line)] my-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-3)] text-sm font-light">Available for Consultation</span>
                <button className="flex items-center gap-2 text-[var(--ink)] font-bold text-sm group-hover:text-[var(--purple)] transition-colors">
                  See Details <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default OurDoctors;

