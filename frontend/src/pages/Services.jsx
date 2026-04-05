import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --ink:       #0b0f1a;
    --ink-2:     #2d3550;
    --ink-3:     #6b7490;
    --purple:    #6b65e5;
    --purple-dk: #5650cc;
    --purple-pl: #eeecfb;
    --cream:     #fdfcff;
    --line:      #e0ddf0;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sv-root {
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* ── grid bg ── */
  .sv-bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(to right, rgba(107,101,229,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(107,101,229,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
    pointer-events: none; z-index: 0;
  }

  /* ── HERO ── */
  .sv-hero {
    position: relative; z-index: 1;
    overflow: hidden;
  }
  .sv-hero-accent {
    position: absolute; top: 0; right: 0;
    width: 40%; height: 100%;
    background: linear-gradient(160deg, #6b65e5 0%, #4c47b8 100%);
    clip-path: polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%);
    z-index: 0;
  }
  .sv-hero-accent::after {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    mix-blend-mode: overlay; opacity: .5;
  }
  .sv-hero-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 96px 60px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 48px;
  }
  .sv-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.74rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--purple); margin-bottom: 20px;
  }
  .sv-eyebrow::before {
    content: ''; width: 28px; height: 2px;
    background: var(--purple); border-radius: 1px;
  }
  .sv-hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    font-weight: 900; line-height: 1.1;
    letter-spacing: -0.02em; color: var(--ink);
    margin-bottom: 18px;
  }
  .sv-hero-h1 em { font-style: italic; color: var(--purple); }
  .sv-hero-sub {
    font-size: 1rem; line-height: 1.75;
    color: var(--ink-3); font-weight: 300;
    max-width: 460px; margin-bottom: 32px;
  }
  .sv-hero-btn {
    padding: 13px 30px; border-radius: 10px; border: none;
    background: var(--purple); color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem; font-weight: 600;
    cursor: pointer; letter-spacing: 0.02em;
    box-shadow: 0 4px 20px rgba(107,101,229,0.35);
    transition: background .2s, transform .18s, box-shadow .2s;
  }
  .sv-hero-btn:hover {
    background: var(--purple-dk);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(107,101,229,0.45);
  }

  /* hero right — stat pills */
  .sv-hero-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .sv-hero-stat {
    background: #fff; border: 1px solid var(--line);
    border-radius: 18px; padding: 20px 22px;
    box-shadow: 0 4px 18px rgba(107,101,229,0.08);
    opacity: 0; transform: translateX(24px);
    transition: opacity .55s ease, transform .55s ease;
  }
  .sv-hero-stat.vis { opacity: 1; transform: translateX(0); }
  .sv-hero-stat:nth-child(2) { transition-delay: .1s; }
  .sv-hero-stat:nth-child(3) { transition-delay: .2s; }
  .sv-hero-stat:nth-child(4) { transition-delay: .3s; }
  .sv-hs-icon { font-size: 1.6rem; margin-bottom: 10px; }
  .sv-hs-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem; font-weight: 700;
    color: var(--ink); line-height: 1;
  }
  .sv-hs-num span { color: var(--purple); }
  .sv-hs-lbl {
    font-size: 0.72rem; font-weight: 500;
    color: var(--ink-3); text-transform: uppercase;
    letter-spacing: 0.06em; margin-top: 4px;
  }

  /* ── FILTER BAR ── */
  .sv-filter-wrap {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px 40px;
  }
  .sv-filter-bar {
    display: flex; align-items: center;
    gap: 10px; flex-wrap: wrap;
  }
  .sv-filter-label {
    font-size: 0.76rem; font-weight: 600;
    color: var(--ink-3); letter-spacing: 0.08em;
    text-transform: uppercase; margin-right: 4px;
    flex-shrink: 0;
  }
  .sv-filter-btn {
    padding: 8px 18px; border-radius: 20px;
    border: 1.5px solid var(--line);
    background: transparent; cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem; font-weight: 500;
    color: var(--ink-3);
    transition: all .18s;
    white-space: nowrap;
  }
  .sv-filter-btn.active {
    border-color: var(--purple);
    background: var(--purple-pl);
    color: var(--purple-dk);
    font-weight: 600;
  }
  .sv-filter-btn:hover:not(.active) {
    border-color: var(--ink-3);
    color: var(--ink);
  }

  /* search */
  .sv-search-wrap {
    margin-left: auto; position: relative; flex-shrink: 0;
  }
  .sv-search {
    padding: 9px 14px 9px 36px;
    border: 1.5px solid var(--line);
    border-radius: 10px; outline: none;
    background: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem; color: var(--ink);
    width: 200px;
    transition: border-color .18s, box-shadow .18s;
  }
  .sv-search::placeholder { color: var(--ink-3); }
  .sv-search:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(107,101,229,0.12); }
  .sv-search-icon {
    position: absolute; left: 11px; top: 50%;
    transform: translateY(-50%); font-size: 0.9rem;
    pointer-events: none;
  }

  /* ── GRID ── */
  .sv-grid-wrap {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px 80px;
  }
  .sv-count {
    font-size: 0.78rem; font-weight: 500;
    color: var(--ink-3); margin-bottom: 24px;
    letter-spacing: 0.04em;
  }
  .sv-count strong { color: var(--purple); }

  .sv-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .sv-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(107,101,229,0.07);
    opacity: 0; transform: translateY(20px);
    transition: opacity .5s ease, transform .5s ease, box-shadow .22s, border-color .22s;
    position: relative;
  }
  .sv-card.vis { opacity: 1; transform: translateY(0); }
  .sv-card:hover {
    box-shadow: 0 12px 36px rgba(107,101,229,0.18);
    border-color: rgba(107,101,229,0.3);
    transform: translateY(-5px);
  }
  .sv-card:active { transform: translateY(-2px); }

  /* top image band */
  .sv-card-img-wrap {
    height: 120px;
    background: var(--purple-pl);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    transition: background .22s;
  }
  .sv-card:hover .sv-card-img-wrap { background: #e2dff8; }
  .sv-card-img-wrap img {
    width: 68px; height: 68px; object-fit: contain;
    transition: transform .3s cubic-bezier(.22,.68,0,1.4);
    position: relative; z-index: 1;
  }
  .sv-card:hover .sv-card-img-wrap img { transform: scale(1.12) translateY(-3px); }

  /* decorative circles behind image */
  .sv-card-img-wrap::before {
    content: ''; position: absolute;
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(107,101,229,0.08);
    top: -20px; right: -20px;
  }
  .sv-card-img-wrap::after {
    content: ''; position: absolute;
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(107,101,229,0.06);
    bottom: -20px; left: -10px;
  }

  /* arrow chip */
  .sv-card-arrow {
    position: absolute; top: 10px; right: 10px;
    width: 28px; height: 28px; border-radius: 8px;
    background: #fff; border: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; color: var(--purple);
    opacity: 0; transform: scale(.8);
    transition: opacity .18s, transform .18s;
    z-index: 2;
  }
  .sv-card:hover .sv-card-arrow { opacity: 1; transform: scale(1); }

  .sv-card-body { padding: 16px 18px 20px; }
  .sv-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; font-weight: 700;
    color: var(--ink); margin-bottom: 7px;
    line-height: 1.25;
  }
  .sv-card-desc {
    font-size: 0.78rem; line-height: 1.65;
    color: var(--ink-3); font-weight: 300;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .sv-card-footer {
    margin-top: 14px; padding-top: 12px;
    border-top: 1px solid var(--line);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sv-card-tag {
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--purple); background: var(--purple-pl);
    padding: 3px 9px; border-radius: 20px;
  }
  .sv-card-cta {
    font-size: 0.75rem; font-weight: 600;
    color: var(--ink-3);
    transition: color .18s;
  }
  .sv-card:hover .sv-card-cta { color: var(--purple); }

  /* empty state */
  .sv-empty {
    grid-column: 1 / -1;
    text-align: center; padding: 60px 20px;
  }
  .sv-empty-emoji { font-size: 3rem; margin-bottom: 14px; }
  .sv-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; color: var(--ink); margin-bottom: 8px;
  }
  .sv-empty-sub { font-size: 0.875rem; color: var(--ink-3); font-weight: 300; }

  /* ── CTA BAND ── */
  .sv-cta {
    position: relative; z-index: 1;
    background: linear-gradient(135deg, #6b65e5 0%, #4c47b8 100%);
    overflow: hidden;
  }
  .sv-cta::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    mix-blend-mode: overlay; opacity: .5;
  }
  .sv-cta-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 72px 60px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 40px; flex-wrap: wrap;
  }
  .sv-cta-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.7rem, 3vw, 2.4rem);
    font-weight: 900; line-height: 1.15;
    color: #fff; max-width: 460px;
  }
  .sv-cta-h2 em { font-style: italic; opacity: .85; }
  .sv-cta-btns { display: flex; gap: 14px; flex-wrap: wrap; }
  .sv-cta-btn-w {
    padding: 13px 30px; border-radius: 10px; border: none;
    background: #fff; color: var(--purple-dk);
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 700; cursor: pointer;
    transition: transform .18s, box-shadow .18s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .sv-cta-btn-w:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
  .sv-cta-btn-g {
    padding: 13px 30px; border-radius: 10px;
    border: 2px solid rgba(255,255,255,.5);
    background: transparent; color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 600; cursor: pointer;
    transition: all .18s;
  }
  .sv-cta-btn-g:hover { border-color: #fff; background: rgba(255,255,255,.1); }

  /* ── TICKER ── */
  .sv-ticker-wrap {
    position: relative; z-index: 1;
    overflow: hidden; padding: 13px 0; background: var(--ink);
  }
  .sv-ticker {
    display: flex; gap: 64px;
    animation: sv-tick 26s linear infinite;
    width: max-content; white-space: nowrap;
  }
  @keyframes sv-tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .sv-tick-item {
    font-size: 0.75rem; font-weight: 500;
    color: rgba(255,255,255,.55);
    letter-spacing: .1em; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
  }
  .sv-tick-sep { color: var(--purple); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) { .sv-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 820px)  { .sv-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .sv-hero-inner { grid-template-columns: 1fr; padding: 64px 24px 60px; }
    .sv-hero-accent { display: none; }
    .sv-filter-wrap, .sv-grid-wrap { padding: 0 24px 60px; }
    .sv-cta-inner { padding: 56px 24px; flex-direction: column; }
    .sv-search-wrap { margin-left: 0; width: 100%; }
    .sv-search { width: 100%; }
  }
  @media (max-width: 480px) { .sv-grid { grid-template-columns: 1fr; } }

  .sv-fade-up {
    opacity: 0; transform: translateY(20px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .sv-fade-up.vis { opacity: 1; transform: translateY(0); }
`;

const heroStats = [
  { icon: "🏥", num: "24", suf: "+", lbl: "Specialties" },
  { icon: "👨‍⚕️", num: "340", suf: "+", lbl: "Specialists" },
  { icon: "⭐", num: "98",  suf: "%", lbl: "Satisfaction" },
  { icon: "⚡", num: "24",  suf: "/7", lbl: "Available" },
];

const categories = ["All", "Primary Care", "Specialist", "Diagnostics", "Mental Health", "Emergency"];

const tickerItems = [
  "Expert Specialists", "Modern Facilities", "24/7 Emergency",
  "AI-Assisted Diagnosis", "340+ Doctors", "12K+ Patients Served",
];

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".sv-fade-up, .sv-card, .sv-hero-stat");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

const Services = () => {
  const { navigate, healthSpecialties = [] } = useContext(AppContext);
  const rootRef = useRef(null);
  const [heroVis, setHeroVis] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useReveal(rootRef);
  useEffect(() => { const t = setTimeout(() => setHeroVis(true), 80); return () => clearTimeout(t); }, []);

  // filter
  const filtered = healthSpecialties.filter(s => {
    const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleCardClick = () => { navigate("/doctors"); window.scrollTo(0, 0); };

  return (
    <>
      <style>{STYLES}</style>
      <div className="sv-root" ref={rootRef}>
        <div className="sv-bg-grid" />

        {/* ── HERO ── */}
        <section className="sv-hero">
          <div className="sv-hero-accent" />
          <div className="sv-hero-inner">
            <div className={`sv-fade-up ${heroVis ? "vis" : ""}`}>
              <div className="sv-eyebrow">What We Offer</div>
              <h1 className="sv-hero-h1">
                Expert Care for<br /><em>Every</em> Condition
              </h1>
              <p className="sv-hero-sub">
                From routine check-ups to complex specialist treatments — our
                comprehensive range of services is designed to keep you and your
                family healthy at every stage of life.
              </p>
              <button className="sv-hero-btn" onClick={() => { navigate("/doctors"); window.scrollTo(0, 0); }}>
                Browse All Doctors →
              </button>
            </div>

            <div className="sv-hero-stats">
              {heroStats.map(({ icon, num, suf, lbl }, i) => (
                <div key={lbl} className={`sv-hero-stat ${heroVis ? "vis" : ""}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                  <div className="sv-hs-icon">{icon}</div>
                  <div className="sv-hs-num">{num}<span>{suf}</span></div>
                  <div className="sv-hs-lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <div className="sv-filter-wrap">
          <div className="sv-filter-bar">
            <span className="sv-filter-label">Filter:</span>
            {categories.map(cat => (
              <button
                key={cat}
                className={`sv-filter-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
            <div className="sv-search-wrap">
              <span className="sv-search-icon">🔍</span>
              <input
                className="sv-search"
                placeholder="Search services…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="sv-grid-wrap">
          <div className="sv-count">
            Showing <strong>{filtered.length}</strong> service{filtered.length !== 1 ? "s" : ""}
            {search && <> for "<strong>{search}</strong>"</>}
          </div>
          <div className="sv-grid">
            {filtered.length === 0 ? (
              <div className="sv-empty">
                <div className="sv-empty-emoji">🔎</div>
                <div className="sv-empty-title">No services found</div>
                <div className="sv-empty-sub">Try adjusting your search or filter.</div>
              </div>
            ) : (
              filtered.map((specialty, index) => (
                <div
                  key={index}
                  className="sv-card"
                  onClick={handleCardClick}
                  style={{ transitionDelay: `${(index % 8) * 0.06}s` }}
                >
                  <div className="sv-card-img-wrap">
                    <img src={specialty.image} alt={specialty.name} />
                    <div className="sv-card-arrow">→</div>
                  </div>
                  <div className="sv-card-body">
                    <div className="sv-card-name">{specialty.name}</div>
                    <div className="sv-card-desc">{specialty.description}</div>
                    <div className="sv-card-footer">
                      <span className="sv-card-tag">Specialty</span>
                      <span className="sv-card-cta">View Doctors →</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="sv-cta">
          <div className="sv-cta-inner">
            <h2 className="sv-cta-h2">
              Can't Find What<br />You're <em>Looking For?</em>
            </h2>
            <div className="sv-cta-btns">
              <button className="sv-cta-btn-w" onClick={() => { navigate("/doctors"); window.scrollTo(0, 0); }}>
                Talk to a Doctor →
              </button>
              <button className="sv-cta-btn-g" onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* ── TICKER ── */}
        <div className="sv-ticker-wrap">
          <div className="sv-ticker">
            {[...Array(2)].flatMap((_, i) =>
              tickerItems.map((item, j) => (
                <span className="sv-tick-item" key={`${i}-${j}`}>
                  {item}<span className="sv-tick-sep">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;