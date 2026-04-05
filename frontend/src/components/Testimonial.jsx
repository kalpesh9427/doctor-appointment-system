const Testimonial = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "Content Marketing",
      text: "“Radiant made undercutting all of our competitors an absolute breeze.”",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600"
    },
    {
      name: "Sarah Smith",
      role: "Product Designer",
      text: "“The care and attention I received was exceptional. Highly recommend their services.”",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600"
    },
    {
      name: "Emily Brown",
      role: "Health Consultant",
      text: "“A truly modern approach to healthcare. Efficiency meets compassion.”",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop"
    }
  ];

  return (
    <section className="section-container">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--purple)] mb-4">
          <div className="w-8 h-[2px] bg-[var(--purple)] rounded-full" />
          Success Stories
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[var(--ink)] mb-6 leading-tight">
          Patient <span className="italic text-[var(--purple)]">Testimonials</span>
        </h2>
        <p className="max-w-2xl text-[var(--ink-3)] text-lg font-light leading-relaxed">
          Hear from our patients about their experiences with our specialist
          doctors and modern facilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="hover-card group rounded-3xl overflow-hidden flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-transparent to-transparent opacity-60" />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="text-3xl text-[var(--purple)] mb-4 opacity-40 italic font-playfair">“</div>
              <p className="text-[var(--ink-2)] text-lg font-light leading-relaxed mb-8 flex-1">
                {t.text}
              </p>
              <div className="mt-auto pt-6 border-t border-[var(--line)] flex items-center gap-4">
                <div>
                  <h4 className="font-bold text-[var(--ink)]">{t.name}</h4>
                  <p className="text-xs text-[var(--purple)] font-bold tracking-widest uppercase mt-1">{t.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
