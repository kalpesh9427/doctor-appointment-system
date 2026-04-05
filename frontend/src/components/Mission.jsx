import { CheckIcon } from "lucide-react";
import { assets } from "../assets/assets.js";

const Mission = () => {
  const valueData = ["Integrity", "Respect", "Innovation", "Excellence"];
  return (
    <section className="bg-[var(--purple)] py-24 relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 border border-white opacity-10 rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="section-container !py-0 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        {/* left section  */}
        <div className="flex flex-col gap-8 text-white w-full lg:w-1/2">
          <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-white/70">
            <div className="w-8 h-[2px] bg-white/70 rounded-full" />
            Our Purpose
          </div>
          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Mission and <span className="italic text-white opacity-80">Values</span>
          </h2>
          <div className="space-y-4">
            <p className="text-white/80 text-lg font-light leading-relaxed">
              Our mission is to provide exceptional healthcare services with
              compassion, innovation, and excellence, ensuring every patient
              receives personalized care.
            </p>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              We are guided by integrity, respect, and commitment to quality,
              working together to build healthier communities and inspire trust.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {valueData.map((value, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 border border-white/10 px-6 py-4 rounded-xl backdrop-blur-sm transition-colors hover:bg-white/20">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <CheckIcon className="w-3.5 h-3.5 text-[var(--purple)]" />
                </div>
                <span className="font-bold tracking-wide uppercase text-xs">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right section  */}
        <div className="w-full lg:w-1/2 relative">
          <div className="flex items-center justify-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 translate-x-4 translate-y-4 rounded-3xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
              <img src={assets.mission_img1} alt="Mission" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover" />
            </div>
            <div className="relative group hidden sm:block">
              <div className="absolute inset-0 bg-white/20 -translate-x-4 translate-y-4 rounded-3xl -z-10 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform" />
              <img src={assets.mission_img2} alt="Values" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover mt-12" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Mission;

