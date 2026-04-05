import { galleryData } from "../assets/assets.js";

const Gallery = () => {
  return (
    <section className="section-container !pb-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--purple)] mb-4">
          <div className="w-8 h-[2px] bg-[var(--purple)] rounded-full" />
          Our Facilities
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[var(--ink)] mb-6 leading-tight">
          Explore our <span className="italic text-[var(--purple)]">Gallery</span>
        </h2>
        <p className="max-w-2xl text-[var(--ink-3)] text-lg font-light leading-relaxed">
          A visual collection of our most recent works - each piece crafted with
          intention, emotion, and style.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 h-auto md:h-[500px] w-full mt-10">
        {galleryData.map((item, index) => (
          <div key={index} className="relative group flex-grow transition-all w-full h-[300px] md:h-full duration-700 hover:flex-[3] cursor-pointer overflow-hidden rounded-2xl border border-[var(--line)]">
            <img
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              src={item.image}
              alt={item.heading}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-[var(--ink)]/90 via-[var(--ink)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-2xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.heading}</h3>
              <p className="text-sm font-light text-white/70 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.description}</p>
            </div>
            
            {/* Step indicator on small view */}
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold md:opacity-100 group-hover:opacity-0 transition-opacity">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Gallery;
