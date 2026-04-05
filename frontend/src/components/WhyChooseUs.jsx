import { assets, benefitsData } from "../assets/assets.js";
import Icon from "./Icon";

const WhyChooseUs = () => {
  return (
    <section className="section-container">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* left section  */}
        <div className="lg:w-1/2 relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-[var(--purple)] opacity-20 rounded-full" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-[var(--purple)] opacity-10 rounded-full" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img src={assets.why_choose_us} alt="Why Choose Us" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Right section  */}
        <div className="lg:w-1/2">
          <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--purple)] mb-4">
            <div className="w-8 h-[2px] bg-[var(--purple)] rounded-full" />
            Cutting Edge
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--ink)] mb-6 leading-tight">
            State <span className="italic text-[var(--purple)]">-of-the-Art</span> <br /> Technology
          </h2>
          <p className="text-[var(--ink-3)] text-lg font-light leading-relaxed mb-10">
            Equipped with the latest advancements, we use cutting-edge
            technology to ensure accuracy, efficiency, and top-quality outcomes.
          </p>
          
          <div className="space-y-6">
            {benefitsData.map((item, index) => (
              <div
                key={index}
                className="hover-card flex items-start gap-6 p-6 rounded-2xl group transition-all duration-300"
              >
                <div className="w-14 h-14 flex-shrink-0 bg-[var(--warm)] rounded-xl flex items-center justify-center transition-colors group-hover:bg-[var(--purple-pl)]">
                  <Icon 
                    name={item.heading === "Fast And Reliable" ? "speed" : 
                          item.heading === "Healthcare Anywhere Any Time" ? "schedule" :
                          item.heading === "Experienced Professionals" ? "person" : "calendar_today"} 
                    size={28} 
                    className="text-[var(--purple)] transition-transform group-hover:scale-110" 
                    weight={300}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-1">
                    {item.heading}
                  </h3>
                  <p className="text-[var(--ink-3)] text-sm font-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default WhyChooseUs;

