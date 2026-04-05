import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Icon from "./Icon";

const HealthSpecialities = () => {
  const { healthSpecialties, navigate } = useContext(AppContext);
  return (
    <section className="section-container">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--purple)] mb-4">
          <div className="w-8 h-[2px] bg-[var(--purple)] rounded-full" />
          Medical Excellence
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[var(--ink)] mb-6 leading-tight">
          Our Healthcare <span className="italic text-[var(--purple)]">Specialties</span>
        </h2>
        <p className="max-w-2xl text-[var(--ink-3)] text-lg font-light leading-relaxed">
          Our healthcare specialties cover a wide range of medical services
          designed to meet every patient’s unique needs. From routine checkups to
          advanced treatments, we ensure expert care at every step.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthSpecialties.map((specialty, index) => (
          <div
            key={index}
            onClick={() => {
              navigate("/services");
              window.scrollTo(0, 0);
            }}
            className="hover-card group p-8 rounded-2xl cursor-pointer flex flex-col items-center text-center transition-all duration-300"
          >
            <div className="w-20 h-20 rounded-2xl bg-[var(--purple-pl)] flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
              <Icon 
                name={specialty.name === "Hematology" ? "bloodtype" : 
                      specialty.name === "Neurology" ? "psychology" : 
                      specialty.name === "Oncology" ? "oncology" : 
                      specialty.name === "Paediatrician" ? "child_care" : 
                      specialty.name === "Pulmonology" ? "pulmonology" : 
                      specialty.name === "Infection" ? "coronavirus" : 
                      specialty.name === "Cardiology" ? "ecg_heart" : "thermometer"} 
                size={38} 
                className="text-[var(--purple)]" 
                weight={300}
              />
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-3">{specialty.name}</h3>
            <p className="text-sm text-[var(--ink-3)] leading-relaxed">{specialty.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default HealthSpecialities;

