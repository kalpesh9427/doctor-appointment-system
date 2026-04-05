import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";

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
    --success:   #22c55e;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ct-root {
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* grid bg */
  .ct-bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(to right, rgba(107,101,229,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(107,101,229,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
    pointer-events: none; z-index: 0;
  }

  /* ── HERO ── */
  .ct-hero {
    position: relative; z-index: 1;
    overflow: hidden;
  }
  .ct-hero-accent {
    position: absolute; top: 0; right: 0;
    width: 40%; height: 100%;
    background: linear-gradient(160deg, #6b65e5 0%, #4c47b8 100%);
    clip-path: polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%);
    z-index: 0;
  }
  .ct-hero-accent::after {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    mix-blend-mode: overlay; opacity: .5;
  }
  .ct-hero-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 100px 60px 80px;
  }
  .ct-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.74rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--purple); margin-bottom: 20px;
  }
  .ct-eyebrow::before {
    content: ''; width: 28px; height: 2px;
    background: var(--purple); border-radius: 1px;
  }
  .ct-hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    font-weight: 900; line-height: 1.1;
    letter-spacing: -0.02em; color: var(--ink);
    margin-bottom: 18px;
  }
  .ct-hero-h1 em { font-style: italic; color: var(--purple); }
  .ct-hero-sub {
    font-size: 1rem; line-height: 1.75;
    color: var(--ink-3); font-weight: 300;
    max-width: 460px;
  }

  /* ── MAIN GRID ── */
  .ct-main {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px 100px;
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 56px;
    align-items: start;
  }

  /* ── LEFT: info cards ── */
  .ct-info-col { display: flex; flex-direction: column; gap: 18px; }

  .ct-info-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 22px 24px;
    display: flex; align-items: flex-start; gap: 16px;
    box-shadow: 0 4px 18px rgba(107,101,229,0.07);
    opacity: 0; transform: translateX(-20px);
    transition: opacity .55s ease, transform .55s ease, box-shadow .2s;
  }
  .ct-info-card.vis { opacity: 1; transform: translateX(0); }
  .ct-info-card:hover { box-shadow: 0 8px 30px rgba(107,101,229,0.14); transform: translateX(4px); }
  .ct-info-card:nth-child(2) { transition-delay: .1s; }
  .ct-info-card:nth-child(3) { transition-delay: .2s; }
  .ct-info-card:nth-child(4) { transition-delay: .3s; }

  .ct-info-icon {
    width: 46px; height: 46px; flex-shrink: 0;
    border-radius: 13px; background: var(--purple-pl);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem;
  }
  .ct-info-label {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--purple); margin-bottom: 5px;
  }
  .ct-info-value {
    font-size: 0.95rem; font-weight: 600;
    color: var(--ink); margin-bottom: 3px; line-height: 1.4;
  }
  .ct-info-desc {
    font-size: 0.8rem; color: var(--ink-3);
    font-weight: 300; line-height: 1.5;
  }

  /* map placeholder */
  .ct-map {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--line);
    box-shadow: 0 4px 20px rgba(107,101,229,0.08);
    opacity: 0; transform: translateX(-20px);
    transition: opacity .6s ease .4s, transform .6s ease .4s;
    background: var(--purple-pl);
    height: 200px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; cursor: pointer;
    text-decoration: none;
  }
  .ct-map.vis { opacity: 1; transform: translateX(0); }
  .ct-map:hover { box-shadow: 0 10px 32px rgba(107,101,229,0.16); }
  .ct-map-emoji { font-size: 2.4rem; }
  .ct-map-label {
    font-size: 0.82rem; font-weight: 600;
    color: var(--purple); letter-spacing: 0.04em;
  }
  .ct-map-addr {
    font-size: 0.75rem; color: var(--ink-3);
    font-weight: 300;
  }

  /* hours */
  .ct-hours {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 20px 24px;
    box-shadow: 0 4px 18px rgba(107,101,229,0.07);
    opacity: 0; transform: translateX(-20px);
    transition: opacity .55s ease .5s, transform .55s ease .5s;
  }
  .ct-hours.vis { opacity: 1; transform: translateX(0); }
  .ct-hours-title {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--purple); margin-bottom: 14px;
    display: flex; align-items: center; gap: 7px;
  }
  .ct-hours-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--line);
    font-size: 0.85rem;
  }
  .ct-hours-row:last-child { border-bottom: none; }
  .ct-hours-day { color: var(--ink-2); font-weight: 500; }
  .ct-hours-time { color: var(--ink-3); font-weight: 300; }
  .ct-hours-badge {
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 20px;
    background: rgba(34,197,94,0.1); color: var(--success);
  }

  /* ── RIGHT: form ── */
  .ct-form-col {
    opacity: 0; transform: translateY(24px);
    transition: opacity .65s ease .15s, transform .65s ease .15s;
  }
  .ct-form-col.vis { opacity: 1; transform: translateY(0); }

  .ct-form-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 8px 36px rgba(107,101,229,0.1);
  }

  .ct-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 900;
    color: var(--ink); margin-bottom: 6px;
  }
  .ct-form-title em { font-style: italic; color: var(--purple); }
  .ct-form-sub {
    font-size: 0.875rem; color: var(--ink-3);
    font-weight: 300; margin-bottom: 30px; line-height: 1.6;
  }

  /* type selector */
  .ct-type-tabs {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 8px; margin-bottom: 26px;
  }
  .ct-type-tab {
    padding: 10px 8px; border-radius: 10px;
    border: 1.5px solid var(--line);
    background: transparent; cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem; font-weight: 500;
    color: var(--ink-3);
    display: flex; flex-direction: column;
    align-items: center; gap: 5px;
    transition: all .18s;
  }
  .ct-type-tab span:first-child { font-size: 1.3rem; }
  .ct-type-tab.active {
    border-color: var(--purple);
    background: var(--purple-pl);
    color: var(--purple-dk);
  }
  .ct-type-tab:hover:not(.active) {
    border-color: var(--ink-3);
    color: var(--ink);
  }

  /* fields */
  .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .ct-field { margin-bottom: 14px; }
  .ct-field:last-of-type { margin-bottom: 0; }
  .ct-label {
    display: block; font-size: 0.78rem; font-weight: 600;
    color: var(--ink-2); margin-bottom: 7px; letter-spacing: 0.02em;
  }
  .ct-label span { color: var(--purple); margin-left: 2px; }
  .ct-input, .ct-select, .ct-textarea {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid var(--line);
    border-radius: 10px; outline: none;
    background: var(--cream);
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; color: var(--ink);
    transition: border-color .18s, box-shadow .18s;
    appearance: none;
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color: var(--ink-3); }
  .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px rgba(107,101,229,0.12);
    background: #fff;
  }
  .ct-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
  .ct-select-wrap { position: relative; }
  .ct-select-wrap::after {
    content: '▾'; position: absolute;
    right: 14px; top: 50%; transform: translateY(-50%);
    color: var(--ink-3); pointer-events: none; font-size: 0.9rem;
  }

  /* submit */
  .ct-submit {
    width: 100%; padding: 14px;
    border-radius: 11px; border: none;
    background: var(--purple); color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem; font-weight: 700;
    cursor: pointer; margin-top: 22px;
    letter-spacing: 0.02em;
    transition: background .2s, transform .18s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(107,101,229,0.35);
    position: relative; overflow: hidden;
  }
  .ct-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
  }
  .ct-submit:hover {
    background: var(--purple-dk);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(107,101,229,0.45);
  }
  .ct-submit:active { transform: translateY(0); }
  .ct-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  /* success state */
  .ct-success {
    text-align: center; padding: 40px 20px;
    animation: ct-fade-in .4s ease;
  }
  @keyframes ct-fade-in { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
  .ct-success-icon {
    font-size: 3.5rem; margin-bottom: 16px;
    animation: ct-bounce .5s cubic-bezier(.22,.68,0,1.5);
  }
  @keyframes ct-bounce { from { transform: scale(0); } to { transform: scale(1); } }
  .ct-success-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 900; color: var(--ink); margin-bottom: 10px;
  }
  .ct-success-msg { font-size: 0.9rem; color: var(--ink-3); line-height: 1.65; font-weight: 300; }
  .ct-success-btn {
    margin-top: 22px; padding: 11px 28px;
    border-radius: 10px; border: 1.5px solid var(--purple);
    background: transparent; color: var(--purple);
    font-family: 'Outfit', sans-serif;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: all .18s;
  }
  .ct-success-btn:hover { background: var(--purple-pl); }

  /* field error */
  .ct-error-msg { font-size: 0.72rem; color: #e8453c; margin-top: 5px; font-weight: 500; }
  .ct-input.err, .ct-select.err, .ct-textarea.err { border-color: #e8453c; }

  /* ── TICKER ── */
  .ct-ticker-wrap {
    position: relative; z-index: 1;
    overflow: hidden; padding: 13px 0;
    background: var(--ink);
  }
  .ct-ticker {
    display: flex; gap: 64px;
    animation: ct-tick 26s linear infinite;
    width: max-content; white-space: nowrap;
  }
  @keyframes ct-tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .ct-tick-item {
    font-size: 0.75rem; font-weight: 500;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.1em; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
  }
  .ct-tick-sep { color: var(--purple); }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .ct-hero-inner { padding: 70px 24px 60px; }
    .ct-hero-accent { display: none; }
    .ct-main { grid-template-columns: 1fr; padding: 0 24px 80px; gap: 36px; }
  }
  @media (max-width: 560px) {
    .ct-row { grid-template-columns: 1fr; }
    .ct-form-card { padding: 28px 20px; }
    .ct-type-tabs { grid-template-columns: 1fr 1fr 1fr; }
  }

  /* reveal util */
  .ct-fade-up {
    opacity: 0; transform: translateY(20px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .ct-fade-up.vis { opacity: 1; transform: translateY(0); }
`;

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(
      ".ct-fade-up, .ct-info-card, .ct-form-col, .ct-map, .ct-hours"
    );
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

const infoCards = [
  { icon: "location_on", label: "Address", value: "MediCare Health Centre", desc: "42 Swastik Society, Navrangpura\nAhmedabad, Gujarat 380009" },
  { icon: "call", label: "Phone", value: "+91 79 2656 0000", desc: "Emergency: +91 98765 43210\nToll-free: 1800-123-4567" },
  { icon: "mail", label: "Email", value: "hello@medicare.health", desc: "Support: support@medicare.health\nMedia: press@medicare.health" },
  { icon: "language", label: "Online", value: "www.medicare.health", desc: "Patient portal available 24/7\nApp on iOS & Android" },
];

const hours = [
  { day: "Monday – Friday", time: "8:00 AM – 9:00 PM", badge: "Open" },
  { day: "Saturday", time: "9:00 AM – 6:00 PM", badge: "Open" },
  { day: "Sunday", time: "10:00 AM – 4:00 PM", badge: null },
  { day: "Emergency", time: "24 / 7", badge: "Always Open" },
];

const contactTypes = [
  { id: "appointment", icon: "calendar_today", label: "Appointment" },
  { id: "inquiry", icon: "chat_bubble", label: "General" },
  { id: "feedback", icon: "stars", label: "Feedback" },
];

const departments = [
  "General Medicine", "Cardiology", "Neurology", "Orthopedics",
  "Pediatrics", "Dermatology", "Ophthalmology", "Other",
];

const tickerItems = [
  "Fast Response", "24/7 Emergency", "Expert Specialists",
  "Online Appointments", "Secure & Private", "Trusted by 12K+ Patients",
];

const Contact = () => {
  const rootRef = useRef(null);
  const [heroVis, setHeroVis] = useState(false);
  const [activeType, setActiveType] = useState("appointment");
  const [form, setForm] = useState({ name: "", email: "", phone: "", department: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useReveal(rootRef);

  useEffect(() => {
    const t = setTimeout(() => setHeroVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Please enter a message";
    return e;
  };

  const handleChange = (field) => (ev) => {
    setForm(p => ({ ...p, [field]: ev.target.value }));
    if (errors[field]) setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ct-root" ref={rootRef}>
        <div className="ct-bg-grid" />

        {/* ── HERO ── */}
        <section className="ct-hero">
          <div className="ct-hero-accent" />
          <div className="ct-hero-inner">
            <div className={`ct-fade-up ${heroVis ? "vis" : ""}`}>
              <div className="ct-eyebrow">Get In Touch</div>
              <h1 className="ct-hero-h1">
                We're Here to <em>Help</em><br />You Feel Better
              </h1>
              <p className="ct-hero-sub">
                Whether you need to book an appointment, have a medical question, or just want
                to know more — our team is ready to assist you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* ── MAIN ── */}
        <div className="ct-main">

          {/* LEFT: info */}
          <div className="ct-info-col">
            {infoCards.map(({ icon, label, value, desc }) => (
              <div className="ct-info-card" key={label}>
                <div className="ct-info-icon">
                  <Icon name={icon} size={20} className="text-primary" weight={400} />
                </div>
                <div>
                  <div className="ct-info-label">{label}</div>
                  <div className="ct-info-value">{value}</div>
                  <div className="ct-info-desc" style={{ whiteSpace: "pre-line" }}>{desc}</div>
                </div>
              </div>
            ))}

            {/* map */}
            <a
              className="ct-map"
              href="https://maps.google.com/?q=Navrangpura,Ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ct-map-emoji text-primary">
                <Icon name="map" size={48} weight={300} />
              </div>
              <div className="ct-map-label">View on Google Maps →</div>
              <div className="ct-map-addr">42 Swastik Society, Navrangpura, Ahmedabad</div>
            </a>

            {/* hours */}
            <div className="ct-hours">
              <div className="ct-hours-title">
                <Icon name="schedule" size={18} weight={500} />
                Opening Hours
              </div>
              {hours.map(({ day, time, badge }) => (
                <div className="ct-hours-row" key={day}>
                  <span className="ct-hours-day">{day}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="ct-hours-time">{time}</span>
                    {badge && <span className="ct-hours-badge">{badge}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: form */}
          <div className="ct-form-col">
            <div className="ct-form-card">
              {sent ? (
                <div className="ct-success">
                  <div className="ct-success-icon text-success">
                    <Icon name="check_circle" size={64} weight={300} />
                  </div>
                  <div className="ct-success-title">Message Received!</div>
                  <p className="ct-success-msg">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                    For urgent matters, please call our emergency line directly.
                  </p>
                  <button className="ct-success-btn" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", department: "", subject: "", message: "" }); }}>
                    Send Another →
                  </button>
                </div>
              ) : (
                <>
                  <div className="ct-form-title">Send a <em>Message</em></div>
                  <p className="ct-form-sub">Fill in the form and we'll respond within 24 hours.</p>

                  {/* type tabs */}
                  <div className="ct-type-tabs">
                    {contactTypes.map(({ id, icon, label }) => (
                      <button
                        key={id}
                        className={`ct-type-tab${activeType === id ? " active" : ""}`}
                        onClick={() => setActiveType(id)}
                        type="button"
                      >
                        <Icon name={icon} size={24} weight={activeType === id ? 500 : 300} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="ct-row">
                      <div className="ct-field">
                        <label className="ct-label">Full Name <span>*</span></label>
                        <input
                          className={`ct-input${errors.name ? " err" : ""}`}
                          placeholder="Dr. / Mr. / Ms."
                          value={form.name}
                          onChange={handleChange("name")}
                        />
                        {errors.name && <div className="ct-error-msg">{errors.name}</div>}
                      </div>
                      <div className="ct-field">
                        <label className="ct-label">Phone Number</label>
                        <input
                          className="ct-input"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={handleChange("phone")}
                        />
                      </div>
                    </div>

                    <div className="ct-field">
                      <label className="ct-label">Email Address <span>*</span></label>
                      <input
                        className={`ct-input${errors.email ? " err" : ""}`}
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange("email")}
                      />
                      {errors.email && <div className="ct-error-msg">{errors.email}</div>}
                    </div>

                    <div className="ct-row">
                      <div className="ct-field">
                        <label className="ct-label">Department</label>
                        <div className="ct-select-wrap">
                          <select
                            className="ct-select"
                            value={form.department}
                            onChange={handleChange("department")}
                          >
                            <option value="">Select department</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="ct-field">
                        <label className="ct-label">Subject</label>
                        <input
                          className="ct-input"
                          placeholder="Brief subject"
                          value={form.subject}
                          onChange={handleChange("subject")}
                        />
                      </div>
                    </div>

                    <div className="ct-field">
                      <label className="ct-label">Your Message <span>*</span></label>
                      <textarea
                        className={`ct-textarea${errors.message ? " err" : ""}`}
                        placeholder={
                          activeType === "appointment"
                            ? "Describe your symptoms or the reason for your visit…"
                            : activeType === "feedback"
                              ? "Share your experience with us…"
                              : "How can we help you today?"
                        }
                        value={form.message}
                        onChange={handleChange("message")}
                      />
                      {errors.message && <div className="ct-error-msg">{errors.message}</div>}
                    </div>

                    <button className="ct-submit" type="submit" disabled={sending}>
                      {sending ? "Sending…" : activeType === "appointment" ? "Request Appointment →" : "Send Message →"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── TICKER ── */}
        <div className="ct-ticker-wrap">
          <div className="ct-ticker">
            {[...Array(2)].flatMap((_, i) =>
              tickerItems.map((item, j) => (
                <span className="ct-tick-item" key={`${i}-${j}`}>
                  {item}<span className="ct-tick-sep">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;