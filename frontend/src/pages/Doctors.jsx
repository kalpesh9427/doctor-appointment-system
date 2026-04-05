import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Star, MapPin, Stethoscope, X, Search, Calendar } from "lucide-react";
import { doctorAPI } from "../services/api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --ink:        #0F172A;
    --ink-2:      #334155;
    --ink-3:      #64748B;
    --purple:     #6C63FF;
    --purple-dk:  #5A52D5;
    --purple-pl:  #F0EFFF;
    --cream:      #F8FAFC;
    --line:       #E2E8F0;
    --success:    #22c55e;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dr-root {
    font-family: 'Inter', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .dr-bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(to right, rgba(107,101,229,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(107,101,229,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
    pointer-events: none; z-index: 0;
  }

  /* ── HERO ── */
  .dr-hero {
    position: relative; z-index: 1; overflow: hidden;
  }
  .dr-hero-accent {
    position: absolute; top: 0; right: 0;
    width: 40%; height: 100%;
    background: linear-gradient(160deg, #6C63FF 0%, #5A52D5 100%);
    clip-path: polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%);
    z-index: 0;
  }
  .dr-hero-accent::after {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    mix-blend-mode: overlay; opacity: .5;
  }
  .dr-hero-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 80px 60px 64px;
  }
  .dr-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.74rem; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--purple); margin-bottom: 18px;
  }
  .dr-eyebrow::before { content: ''; width: 28px; height: 2px; background: var(--purple); border-radius: 1px; }
  .dr-hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 3.8vw, 3.2rem); font-weight: 900;
    line-height: 1.1; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 14px;
  }
  .dr-hero-h1 em { font-style: italic; color: var(--purple); }
  .dr-hero-sub {
    font-size: 1rem; line-height: 1.7; color: var(--ink-3);
    font-weight: 300; max-width: 480px;
  }

  /* ── TOOLBAR ── */
  .dr-toolbar {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 32px 60px 24px;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }

  .dr-search-wrap { position: relative; flex: 1; min-width: 220px; }
  .dr-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--ink-3); pointer-events: none; }
  .dr-search {
    width: 100%; padding: 11px 14px 11px 40px;
    border: 1.5px solid var(--line); border-radius: 10px;
    background: #fff; font-family: 'Inter', sans-serif;
    font-size: 0.875rem; color: var(--ink); outline: none;
    transition: border-color .16s, box-shadow .16s;
  }
  .dr-search::placeholder { color: var(--ink-3); }
  .dr-search:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(107,101,229,0.1); }

  .dr-select-wrap { position: relative; }
  .dr-select-wrap::after {
    content: '▾'; position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%); color: var(--ink-3); pointer-events: none; font-size: 0.85rem;
  }
  .dr-select {
    padding: 11px 36px 11px 14px; border: 1.5px solid var(--line);
    border-radius: 10px; background: #fff; font-family: 'Inter', sans-serif;
    font-size: 0.875rem; color: var(--ink); outline: none; cursor: pointer;
    appearance: none; min-width: 180px;
    transition: border-color .16s;
  }
  .dr-select:focus { border-color: var(--purple); }

  .dr-clear-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 11px 16px; border-radius: 10px;
    border: 1.5px solid var(--line); background: transparent;
    font-family: 'Inter', sans-serif; font-size: 0.845rem;
    font-weight: 500; color: var(--ink-3); cursor: pointer;
    transition: all .16s;
  }
  .dr-clear-btn:hover { border-color: var(--danger, #e8453c); color: var(--danger, #e8453c); background: rgba(232,69,60,0.05); }

  .dr-count-bar {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px 24px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .dr-count { font-size: 0.82rem; color: var(--ink-3); font-weight: 500; }
  .dr-count strong { color: var(--purple); }

  /* filter chips */
  .dr-filter-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .dr-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px;
    background: var(--purple-pl); border: 1px solid rgba(107,101,229,0.25);
    font-size: 0.75rem; font-weight: 500; color: var(--purple-dk);
  }
  .dr-chip-x {
    background: none; border: none; cursor: pointer;
    color: var(--purple-dk); display: flex; align-items: center;
    padding: 0; opacity: .7; transition: opacity .13s;
  }
  .dr-chip-x:hover { opacity: 1; }

  /* ── GRID ── */
  .dr-grid-wrap {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px 80px;
  }
  .dr-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }

  /* ── CARD ── */
  .dr-card {
    background: #fff; border: 1px solid var(--line);
    border-radius: 22px; overflow: hidden;
    box-shadow: 0 4px 18px rgba(107,101,229,0.07);
    cursor: pointer;
    opacity: 0; transform: translateY(18px);
    transition: opacity .5s ease, transform .5s ease, box-shadow .22s, border-color .22s;
  }
  .dr-card.vis { opacity: 1; transform: translateY(0); }
  .dr-card:hover { box-shadow: 0 12px 38px rgba(107,101,229,0.16); border-color: rgba(107,101,229,0.28); }

  /* image band */
  .dr-card-img {
    height: 200px; position: relative; overflow: hidden;
    background: var(--purple-pl);
  }
  .dr-card-img img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .4s ease;
  }
  .dr-card:hover .dr-card-img img { transform: scale(1.05); }
  .dr-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(11,15,26,0.3), transparent 60%);
  }

  /* available badge */
  .dr-badge {
    position: absolute; top: 12px; right: 12px;
    display: flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 20px;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.04em;
    backdrop-filter: blur(8px);
  }
  .dr-badge.available { background: rgba(34,197,94,0.9); color: #fff; }
  .dr-badge.unavailable { background: rgba(100,100,120,0.8); color: #fff; }
  .dr-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #fff;
    animation: dr-pulse 2s ease-in-out infinite;
  }
  .dr-badge.unavailable .dr-badge-dot { animation: none; }
  @keyframes dr-pulse { 0%,100% { transform:scale(1);opacity:1; } 50% { transform:scale(1.5);opacity:.6; } }

  /* specialty tag on image */
  .dr-spec-tag {
    position: absolute; bottom: 12px; left: 12px;
    padding: 4px 11px; border-radius: 20px;
    background: rgba(107,101,229,0.9); color: #fff;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.04em;
    backdrop-filter: blur(8px);
  }

  /* card body */
  .dr-card-body { padding: 18px 20px 20px; }
  .dr-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem; font-weight: 700;
    color: var(--ink); margin-bottom: 4px; line-height: 1.2;
  }
  .dr-card-edu {
    font-size: 0.78rem; color: var(--ink-3); font-weight: 300;
    margin-bottom: 14px; line-height: 1.4;
  }

  .dr-card-meta { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
  .dr-card-meta-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.82rem; color: var(--ink-3); font-weight: 400;
  }
  .dr-card-meta-row svg { color: var(--purple); flex-shrink: 0; }

  .dr-card-footer {
    padding-top: 14px; border-top: 1px solid var(--line);
    display: flex; align-items: center; gap: 10px;
  }
  .dr-book-btn {
    flex: 1; padding: 11px; border-radius: 10px; border: none;
    background: var(--purple); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    box-shadow: 0 3px 14px rgba(107,101,229,0.3);
    transition: background .18s, transform .16s, box-shadow .18s;
  }
  .dr-book-btn:hover { background: var(--purple-dk); transform: translateY(-1px); box-shadow: 0 5px 20px rgba(107,101,229,0.4); }
  .dr-view-btn {
    width: 40px; height: 40px; border-radius: 10px;
    border: 1.5px solid var(--line); background: transparent;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3); cursor: pointer; flex-shrink: 0;
    transition: border-color .16s, color .16s, background .16s;
  }
  .dr-view-btn:hover { border-color: var(--purple); color: var(--purple); background: var(--purple-pl); }

  /* ── LOADING ── */
  .dr-loading {
    position: relative; z-index: 1;
    min-height: 60vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 18px;
  }
  .dr-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid var(--purple-pl);
    border-top-color: var(--purple);
    animation: dr-spin .8s linear infinite;
  }
  @keyframes dr-spin { to { transform: rotate(360deg); } }
  .dr-loading-text { font-size: 0.95rem; color: var(--ink-3); font-weight: 300; }

  /* skeleton cards */
  .dr-skel {
    background: #fff; border: 1px solid var(--line);
    border-radius: 22px; overflow: hidden;
    box-shadow: 0 4px 18px rgba(107,101,229,0.05);
  }
  .dr-skel-img { height: 200px; background: var(--purple-pl); position: relative; overflow: hidden; }
  .dr-skel-body { padding: 18px 20px 20px; }
  .dr-skel-line {
    height: 14px; border-radius: 6px; background: var(--purple-pl);
    margin-bottom: 10px; position: relative; overflow: hidden;
  }
  .dr-skel-line::after, .dr-skel-img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    animation: dr-shimmer 1.4s ease-in-out infinite;
  }
  @keyframes dr-shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

  /* ── EMPTY / ERROR ── */
  .dr-empty {
    position: relative; z-index: 1;
    text-align: center; padding: 80px 24px;
  }
  .dr-empty-icon { font-size: 3.5rem; margin-bottom: 16px; }
  .dr-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; color: var(--ink); margin-bottom: 10px;
  }
  .dr-empty-sub { font-size: 0.9rem; color: var(--ink-3); font-weight: 300; max-width: 400px; margin: 0 auto 24px; line-height: 1.65; }
  .dr-empty-btn {
    padding: 12px 28px; border-radius: 10px; border: none;
    background: var(--purple); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; box-shadow: 0 4px 18px rgba(107,101,229,0.3);
    transition: background .18s;
  }
  .dr-empty-btn:hover { background: var(--purple-dk); }

  /* ── TICKER ── */
  .dr-ticker-wrap {
    position: relative; z-index: 1;
    overflow: hidden; padding: 13px 0; background: var(--ink);
  }
  .dr-ticker {
    display: flex; gap: 64px;
    animation: dr-tick 26s linear infinite;
    width: max-content; white-space: nowrap;
  }
  @keyframes dr-tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .dr-tick-item {
    font-size: 0.75rem; font-weight: 500; color: rgba(255,255,255,.55);
    letter-spacing: .1em; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
  }
  .dr-tick-sep { color: var(--purple); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) { .dr-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .dr-hero-inner, .dr-toolbar, .dr-count-bar, .dr-grid-wrap { padding-left: 24px; padding-right: 24px; }
    .dr-hero-accent { display: none; }
    .dr-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 500px) {
    .dr-toolbar { flex-direction: column; }
    .dr-select { width: 100%; }
    .dr-search-wrap { width: 100%; }
  }

  .dr-fade-up { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
  .dr-fade-up.vis { opacity: 1; transform: translateY(0); }
`;

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".dr-card, .dr-fade-up");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

const tickerItems = ["Expert Specialists", "Verified Doctors", "Instant Booking", "340+ Doctors", "24/7 Available", "Trusted by 12K+ Patients"];

const SkeletonGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, padding: "0 60px 80px", maxWidth: 1280, margin: "0 auto" }}>
    {[...Array(6)].map((_, i) => (
      <div className="dr-skel" key={i}>
        <div className="dr-skel-img" />
        <div className="dr-skel-body">
          <div className="dr-skel-line" style={{ width: "70%" }} />
          <div className="dr-skel-line" style={{ width: "45%", height: 10 }} />
          <div className="dr-skel-line" style={{ width: "55%", height: 10, marginTop: 16 }} />
          <div className="dr-skel-line" style={{ width: "60%", height: 10 }} />
          <div className="dr-skel-line" style={{ width: "100%", height: 40, borderRadius: 10, marginTop: 18 }} />
        </div>
      </div>
    ))}
  </div>
);

const Doctors = () => {
  const { navigate } = useContext(AppContext);
  const rootRef = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState(null);
  const [heroVis, setHeroVis] = useState(false);

  useReveal(rootRef);

  useEffect(() => { const t = setTimeout(() => setHeroVis(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true); setError(null);
      try {
        const response = await doctorAPI.getAll({ search: searchTerm });
        let data = response.data?.data || response.data || [];
        if (!Array.isArray(data)) throw new Error("Invalid data format");
        const visible = data.filter(d => d.isActive !== false);
        setDoctors(visible); setFilteredDoctors(visible);
        setSpecialties([...new Set(visible.map(d => d.specialty).filter(Boolean))]);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch doctors");
      } finally { setLoading(false); }
    };
    fetchDoctors();
  }, [searchTerm]);

  useEffect(() => {
    let result = doctors;
    if (selectedSpecialty) result = result.filter(d => d.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.name?.toLowerCase().includes(t) || d.specialty?.toLowerCase().includes(t) ||
        d.clinicName?.toLowerCase().includes(t) || d.city?.toLowerCase().includes(t) ||
        d.education?.toLowerCase().includes(t)
      );
    }
    setFilteredDoctors(result);
  }, [selectedSpecialty, doctors]);

  const clearAll = () => { setSearchTerm(""); setSelectedSpecialty(""); };

  return (
    <>
      <style>{STYLES}</style>
      <div className="dr-root" ref={rootRef}>
        <div className="dr-bg-grid" />

        {/* ── HERO ── */}
        <section className="dr-hero">
          <div className="dr-hero-accent" />
          <div className="dr-hero-inner">
            <div className={`dr-fade-up ${heroVis ? "vis" : ""}`}>
              <div className="dr-eyebrow">Our Medical Team</div>
              <h1 className="dr-hero-h1">
                Meet Our <em>Expert</em><br />Doctors
              </h1>
              <p className="dr-hero-sub">
                Highly qualified, verified specialists dedicated to your health and wellbeing — available for in-person or online consultations.
              </p>
            </div>
          </div>
        </section>

        {/* ── TOOLBAR ── */}
        <div className="dr-toolbar">
          <div className="dr-search-wrap">
            <Search size={16} className="dr-search-icon" />
            <input
              className="dr-search"
              type="text"
              placeholder="Search by name, specialty, clinic, or city…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="dr-select-wrap">
            <select className="dr-select" value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}>
              <option value="">All Specialties</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {(searchTerm || selectedSpecialty) && (
            <button className="dr-clear-btn" onClick={clearAll} type="button">
              <X size={15} />Clear
            </button>
          )}
        </div>

        {/* count + chips */}
        <div className="dr-count-bar">
          <div className="dr-count">
            Showing <strong>{filteredDoctors.length}</strong> verified doctor{filteredDoctors.length !== 1 ? "s" : ""}
            {doctors.length !== filteredDoctors.length && <> of {doctors.length}</>}
          </div>
          <div className="dr-filter-chips">
            {searchTerm && (
              <span className="dr-chip">
                "{searchTerm}"
                <button className="dr-chip-x" onClick={() => setSearchTerm("")} type="button"><X size={11} /></button>
              </span>
            )}
            {selectedSpecialty && (
              <span className="dr-chip">
                {selectedSpecialty}
                <button className="dr-chip-x" onClick={() => setSelectedSpecialty("")} type="button"><X size={11} /></button>
              </span>
            )}
          </div>
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="dr-empty">
            <div className="dr-empty-icon">⚠️</div>
            <div className="dr-empty-title">Couldn't Load Doctors</div>
            <p className="dr-empty-sub">{error}</p>
            <button className="dr-empty-btn" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="dr-empty">
            <div className="dr-empty-icon">🔎</div>
            <div className="dr-empty-title">No Doctors Found</div>
            <p className="dr-empty-sub">
              {searchTerm || selectedSpecialty
                ? "Try adjusting your search or clearing the filters."
                : "No doctors are currently listed. Please check back soon."}
            </p>
            {(searchTerm || selectedSpecialty) && (
              <button className="dr-empty-btn" onClick={clearAll}>Clear All Filters</button>
            )}
          </div>
        ) : (
          <div className="dr-grid-wrap">
            <div className="dr-grid">
              {filteredDoctors.map((doctor, i) => (
                <div
                  key={doctor._id}
                  className="dr-card"
                  style={{ transitionDelay: `${(i % 6) * 0.07}s` }}
                  onClick={() => navigate(`/doctor/${doctor._id}`)}
                >
                  {/* image */}
                  <div className="dr-card-img">
                    <img
                      src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=6C63FF&color=ffffff&size=256`}
                      alt={doctor.name}
                    />
                    <div className="dr-card-img-overlay" />
                    <div className={`dr-badge ${doctor.isActive !== false ? "available" : "unavailable"}`}>
                      <div className="dr-badge-dot" />
                      {doctor.isActive !== false ? "Available" : "Unavailable"}
                    </div>
                    {doctor.specialty && <div className="dr-spec-tag">{doctor.specialty}</div>}
                  </div>

                  {/* body */}
                  <div className="dr-card-body">
                    <div className="dr-card-name">{doctor.name}</div>
                    <div className="dr-card-edu">{doctor.education || "Medical Professional"}</div>
                    <div className="dr-card-meta">
                      {doctor.city && (
                        <div className="dr-card-meta-row">
                          <MapPin size={13} />{doctor.city}
                        </div>
                      )}
                      {doctor.clinicName && (
                        <div className="dr-card-meta-row">
                          <Stethoscope size={13} />{doctor.clinicName}
                        </div>
                      )}
                      {doctor.licenseNumber && (
                        <div className="dr-card-meta-row">
                          <Star size={13} />Lic: {doctor.licenseNumber}
                        </div>
                      )}
                    </div>
                    <div className="dr-card-footer">
                      <button
                        className="dr-book-btn"
                        onClick={e => { e.stopPropagation(); navigate(`/doctor/${doctor._id}`); }}
                        type="button"
                      >
                        <Calendar size={15} />Book Appointment
                      </button>
                      <button
                        className="dr-view-btn"
                        onClick={e => { e.stopPropagation(); navigate(`/doctor/${doctor._id}`); }}
                        type="button"
                        title="View profile"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TICKER ── */}
        <div className="dr-ticker-wrap">
          <div className="dr-ticker">
            {[...Array(2)].flatMap((_, i) =>
              tickerItems.map((item, j) => (
                <span className="dr-tick-item" key={`${i}-${j}`}>
                  {item}<span className="dr-tick-sep">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Doctors;