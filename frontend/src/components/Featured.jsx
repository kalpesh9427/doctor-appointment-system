import { featuresData } from "../assets/assets.js";
import { ArrowRight } from "lucide-react";
import Icon from "./Icon";

const Featured = () => {
  return (
    <section className="section-container">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--purple)] mb-4">
          <div className="w-8 h-[2px] bg-[var(--purple)] rounded-full" />
          Our Commitment
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[var(--ink)] mb-6 leading-tight">
          Committed to Your <span className="italic text-[var(--purple)]">Health</span> <br /> and Happiness
        </h2>
        <p className="max-w-2xl text-[var(--ink-3)] text-lg font-light leading-relaxed">
          Your well-being is our top priority, with care designed to keep you
          healthy and fulfilled every day. We’re here to support both your body
          and peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="hover-card group p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300"
          >
            <div className="w-20 h-20 rounded-full bg-[var(--warm)] flex items-center justify-center mb-6 transition-colors group-hover:bg-[var(--purple-pl)]">
              <Icon 
                name={feature.heading === "Home MD" ? "home_health" : 
                      feature.heading === "Book Appointment" ? "calendar_today" :
                      feature.heading === "Tele-Health" ? "video_chat" : "call"} 
                size={34} 
                className="text-[var(--purple)] transition-transform group-hover:scale-110" 
                weight={300}
              />
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-4">{feature.heading}</h3>
            <p className="text-sm text-[var(--ink-3)] font-light leading-relaxed mb-6">{feature.description}</p>
            <button className="mt-auto inline-flex items-center gap-2 text-[var(--purple)] text-sm font-bold group/btn hover:gap-3 transition-all duration-200">
              Learn More
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Featured;

