import { ArrowRight, CircleCheck } from "lucide-react";
import { howItWorks } from "../assets/assets.js";

const HowItWorks = () => {
  return (
    <section className="relative py-24 bg-[var(--ink)] overflow-hidden">

      {/* ── Background texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative z-10 section-container !py-0">
        {/* ── Header ── */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--purple)] mb-4">
            <div className="w-8 h-[2px] bg-[var(--purple)] rounded-full" />
            Process
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Streamlined <span className="italic text-[var(--purple)]">Healthcare</span>
          </h2>

          <p className="mt-5 text-white/50 max-w-xl mx-auto text-lg font-light leading-relaxed">
            Our streamlined approach makes healthcare simple, efficient, and
            stress-free. We focus on delivering the right care at the right
            time for your well-being.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col gap-6 hover:bg-white/[0.06] hover:border-[var(--purple)]/40 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Step badge */}
              <span className="absolute top-6 right-6 text-xs font-bold text-white/10 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/10 border border-[var(--purple)]/20 flex items-center justify-center group-hover:bg-[var(--purple)]/20 transition-colors duration-300">
                <CircleCheck className="w-7 h-7 text-[var(--purple)]" />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-white font-bold text-xl leading-snug">
                  {item.heading}
                </h3>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <button className="mt-auto self-start inline-flex items-center gap-2 text-[var(--purple)] text-sm font-bold group/btn hover:gap-3 transition-all duration-200">
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;