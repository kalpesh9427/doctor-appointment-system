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
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ab-root {
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* ── subtle grid bg ── */
  .ab-bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(107,101,229,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(107,101,229,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
    pointer-events: none;
    z-index: 0;
  }

  /* ─────────────────── HERO ─────────────────── */
  .ab-hero {
    position: relative;
    min-height: 72vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 1;
  }

  .ab-hero-accent {
    position: absolute;
    top: 0; right: 0;
    width: 42%;
    height: 100%;
    background: linear-gradient(160deg, #6b65e5 0%, #4c47b8 100%);
    clip-path: polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%);
    z-index: 0;
  }
  .ab-hero-accent::after {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    opacity: 0.5; mix-blend-mode: overlay;
  }

  .ab-hero-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    width: 100%;
    padding: 100px 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 60px;
  }

  .ab-hero-left { max-width: 520px; }

  .ab-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.74rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--purple); margin-bottom: 22px;
  }
  .ab-eyebrow-line { width: 30px; height: 2px; background: var(--purple); border-radius: 1px; }

  .ab-hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 4vw, 3.8rem);
    font-weight: 900; line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-bottom: 22px;
  }
  .ab-hero-h1 em { font-style: italic; color: var(--purple); }

  .ab-hero-desc {
    font-size: 1rem; line-height: 1.78;
    color: var(--ink-3); font-weight: 300;
    margin-bottom: 36px; max-width: 430px;
  }

  .ab-hero-pills { display: flex; gap: 10px; flex-wrap: wrap; }
  .ab-pill {
    padding: 8px 18px; border-radius: 20px;
    border: 1.5px solid var(--line);
    font-size: 0.8rem; font-weight: 500;
    color: var(--ink-3); background: transparent;
    transition: all .2s;
  }
  .ab-pill.active {
    border-color: var(--purple);
    background: var(--purple-pl);
    color: var(--purple-dk);
  }

  /* right side cards */
  .ab-hero-right {
    display: flex; flex-direction: column; gap: 16px;
    position: relative;
  }

  .ab-stat-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 22px 26px;
    display: flex; align-items: center; gap: 18px;
    box-shadow: 0 6px 24px rgba(107,101,229,0.08);
    opacity: 0; transform: translateX(30px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .ab-stat-card.vis { opacity: 1; transform: translateX(0); }
  .ab-stat-card:nth-child(2) { transition-delay: .12s; }
  .ab-stat-card:nth-child(3) { transition-delay: .24s; }
  .ab-stat-card:nth-child(4) { transition-delay: .36s; }

  .ab-stat-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--purple-pl);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
  }
  .ab-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem; font-weight: 700;
    color: var(--ink); line-height: 1;
  }
  .ab-stat-num span { color: var(--purple); }
  .ab-stat-lbl { font-size: 0.78rem; color: var(--ink-3); font-weight: 500; margin-top: 3px; letter-spacing: 0.04em; text-transform: uppercase; }

  /* ─────────────────── SECTION SHARED ─────────────────── */
  .ab-section {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 96px 60px;
  }

  .ab-section-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--purple); margin-bottom: 14px;
  }
  .ab-section-label::before {
    content: ''; width: 24px; height: 2px;
    background: var(--purple); border-radius: 1px;
  }

  .ab-section-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.9rem, 3vw, 2.8rem);
    font-weight: 900; line-height: 1.14;
    letter-spacing: -0.02em; color: var(--ink);
    margin-bottom: 16px;
  }
  .ab-section-h2 em { font-style: italic; color: var(--purple); }

  .ab-section-sub {
    font-size: 1rem; line-height: 1.75;
    color: var(--ink-3); font-weight: 300;
    max-width: 520px;
  }

  /* ─────────────────── MISSION ─────────────────── */
  .ab-mission-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    margin-top: 56px;
  }

  .ab-mission-text p {
    font-size: 1rem; line-height: 1.82;
    color: var(--ink-3); font-weight: 300;
    margin-bottom: 20px;
  }
  .ab-mission-text p:last-child { margin-bottom: 0; }
  .ab-mission-text strong { color: var(--ink); font-weight: 600; }

  .ab-mission-visual {
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .ab-mission-ring {
    width: 300px; height: 300px; border-radius: 50%;
    border: 2px solid rgba(107,101,229,0.2);
    display: flex; align-items: center; justify-content: center;
    animation: slow-spin 30s linear infinite;
  }
  .ab-mission-ring-inner {
    width: 220px; height: 220px; border-radius: 50%;
    background: var(--purple-pl);
    border: 2px solid rgba(107,101,229,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 4.5rem;
  }
  @keyframes slow-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  /* orbit dots */
  .ab-orbit-dot {
    position: absolute;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--purple);
    box-shadow: 0 0 12px rgba(107,101,229,0.5);
  }

  /* ─────────────────── VALUES ─────────────────── */
  .ab-divider {
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px;
    position: relative; z-index: 1;
  }
  .ab-divider-line { height: 1px; background: var(--line); }

  .ab-values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 52px;
  }

  .ab-value-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 4px 20px rgba(107,101,229,0.06);
    opacity: 0; transform: translateY(24px);
    transition: opacity .55s ease, transform .55s ease, box-shadow .2s;
  }
  .ab-value-card.vis { opacity: 1; transform: translateY(0); }
  .ab-value-card:hover { box-shadow: 0 10px 36px rgba(107,101,229,0.14); transform: translateY(-4px); }
  .ab-value-card:nth-child(2) { transition-delay: .1s; }
  .ab-value-card:nth-child(3) { transition-delay: .2s; }
  .ab-value-card:nth-child(4) { transition-delay: .3s; }
  .ab-value-card:nth-child(5) { transition-delay: .4s; }
  .ab-value-card:nth-child(6) { transition-delay: .5s; }

  .ab-value-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: var(--purple-pl);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; margin-bottom: 18px;
  }
  .ab-value-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem; font-weight: 700;
    color: var(--ink); margin-bottom: 10px;
  }
  .ab-value-desc {
    font-size: 0.875rem; line-height: 1.7;
    color: var(--ink-3); font-weight: 300;
  }

  /* ─────────────────── TEAM ─────────────────── */
  .ab-team-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
    margin-top: 52px;
  }

  .ab-team-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(107,101,229,0.07);
    opacity: 0; transform: translateY(20px);
    transition: opacity .5s ease, transform .5s ease, box-shadow .2s;
  }
  .ab-team-card.vis { opacity: 1; transform: translateY(0); }
  .ab-team-card:hover { box-shadow: 0 12px 36px rgba(107,101,229,0.16); transform: translateY(-5px); }
  .ab-team-card:nth-child(2) { transition-delay: .1s; }
  .ab-team-card:nth-child(3) { transition-delay: .2s; }
  .ab-team-card:nth-child(4) { transition-delay: .3s; }

  .ab-team-avatar {
    height: 180px;
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem;
    position: relative;
    overflow: hidden;
  }
  .ab-team-avatar-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--purple-pl) 0%, #ddd8f8 100%);
  }
  .ab-team-avatar span { position: relative; z-index: 1; }

  .ab-team-info { padding: 18px 20px 20px; }
  .ab-team-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-weight: 700;
    color: var(--ink); margin-bottom: 4px;
  }
  .ab-team-role {
    font-size: 0.76rem; color: var(--purple);
    font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; margin-bottom: 10px;
  }
  .ab-team-bio { font-size: 0.82rem; color: var(--ink-3); line-height: 1.6; font-weight: 300; }

  /* ─────────────────── TIMELINE ─────────────────── */
  .ab-timeline {
    position: relative;
    margin-top: 56px;
    padding-left: 40px;
  }
  .ab-timeline::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 2px; height: 100%;
    background: linear-gradient(to bottom, var(--purple), transparent);
    border-radius: 1px;
  }
  .ab-tl-item {
    position: relative;
    padding: 0 0 44px 32px;
    opacity: 0; transform: translateX(-16px);
    transition: opacity .55s ease, transform .55s ease;
  }
  .ab-tl-item.vis { opacity: 1; transform: translateX(0); }
  .ab-tl-item:nth-child(2) { transition-delay: .1s; }
  .ab-tl-item:nth-child(3) { transition-delay: .2s; }
  .ab-tl-item:nth-child(4) { transition-delay: .3s; }
  .ab-tl-item:nth-child(5) { transition-delay: .4s; }
  .ab-tl-item:last-child { padding-bottom: 0; }
  .ab-tl-dot {
    position: absolute;
    left: -5px; top: 4px;
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--purple);
    box-shadow: 0 0 0 3px var(--purple-pl);
  }
  .ab-tl-year {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--purple); margin-bottom: 6px;
  }
  .ab-tl-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem; font-weight: 700;
    color: var(--ink); margin-bottom: 6px;
  }
  .ab-tl-desc {
    font-size: 0.875rem; line-height: 1.7;
    color: var(--ink-3); font-weight: 300; max-width: 500px;
  }

  /* ─────────────────── CTA BAND ─────────────────── */
  .ab-cta-band {
    position: relative; z-index: 1;
    background: linear-gradient(135deg, #6b65e5 0%, #4c47b8 100%);
    overflow: hidden;
  }
  .ab-cta-band::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    mix-blend-mode: overlay; opacity: .5;
  }
  .ab-cta-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 80px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
  }
  .ab-cta-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 900; line-height: 1.15;
    color: #fff; max-width: 480px;
  }
  .ab-cta-h2 em { font-style: italic; opacity: 0.85; }
  .ab-cta-btns { display: flex; gap: 14px; flex-wrap: wrap; }
  .ab-cta-btn-primary {
    padding: 14px 34px; border-radius: 10px; border: none;
    background: #fff; color: var(--purple-dk);
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem; font-weight: 700;
    cursor: pointer; transition: transform .18s, box-shadow .18s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .ab-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
  .ab-cta-btn-ghost {
    padding: 14px 34px; border-radius: 10px;
    border: 2px solid rgba(255,255,255,0.5);
    background: transparent; color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem; font-weight: 600;
    cursor: pointer; transition: all .18s;
  }
  .ab-cta-btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

  /* ─────────────────── TICKER ─────────────────── */
  .ab-ticker-wrap {
    position: relative; z-index: 1;
    overflow: hidden; padding: 13px 0;
    background: var(--ink);
  }
  .ab-ticker {
    display: flex; gap: 64px;
    animation: ab-tick 26s linear infinite;
    width: max-content; white-space: nowrap;
  }
  @keyframes ab-tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .ab-tick-item {
    font-size: 0.75rem; font-weight: 500;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.1em; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
  }
  .ab-tick-sep { color: var(--purple); }

  /* ─────────────────── RESPONSIVE ─────────────────── */
  @media (max-width: 1024px) {
    .ab-team-grid { grid-template-columns: repeat(2, 1fr); }
    .ab-values-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .ab-hero-inner { grid-template-columns: 1fr; padding: 60px 24px; }
    .ab-hero-accent { display: none; }
    .ab-hero-right { display: none; }
    .ab-section { padding: 60px 24px; }
    .ab-divider { padding: 0 24px; }
    .ab-mission-grid { grid-template-columns: 1fr; gap: 36px; }
    .ab-mission-visual { display: none; }
    .ab-values-grid { grid-template-columns: 1fr; }
    .ab-team-grid { grid-template-columns: 1fr 1fr; }
    .ab-cta-inner { padding: 56px 24px; flex-direction: column; }
    .ab-timeline { padding-left: 24px; }
  }
  @media (max-width: 480px) {
    .ab-team-grid { grid-template-columns: 1fr; }
  }

  /* ─────────────────── ENTRY ANIM ─────────────────── */
  .ab-fade-up {
    opacity: 0; transform: translateY(24px);
    transition: opacity .7s ease, transform .7s ease;
  }
  .ab-fade-up.vis { opacity: 1; transform: translateY(0); }
  .ab-fade-up.d1 { transition-delay: .1s; }
  .ab-fade-up.d2 { transition-delay: .2s; }
  .ab-fade-up.d3 { transition-delay: .3s; }
`;

/* ── tiny hook: IntersectionObserver for reveal ── */
function useReveal(ref, threshold = 0.15) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".ab-fade-up, .ab-value-card, .ab-team-card, .ab-stat-card, .ab-tl-item");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
    }, { threshold });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref, threshold]);
}

const stats = [
  { icon: "group", num: "12K", suf: "+", lbl: "Patients Served" },
  { icon: "stars", num: "98", suf: "%", lbl: "Satisfaction Rate" },
  { icon: "health_and_safety", num: "340", suf: "+", lbl: "Specialists" },
  { icon: "public", num: "18", suf: "+", lbl: "Cities Covered" },
];

const values = [
  { icon: "favorite", title: "Compassionate Care", desc: "Every patient is treated with empathy and dignity. We put human connection at the heart of every interaction." },
  { icon: "science", title: "Evidence-Based", desc: "Our treatments are grounded in the latest medical research and clinical guidelines for the best outcomes." },
  { icon: "bolt", title: "Always Available", desc: "24/7 emergency care and on-demand consultations ensure help is there whenever you need it most." },
  { icon: "lock", title: "Data Privacy", desc: "Your health data is encrypted and protected. We comply with all healthcare privacy regulations globally." },
  { icon: "handshake", title: "Collaborative", desc: "Our specialists work together across disciplines to provide comprehensive, holistic healthcare solutions." },
  { icon: "trending_up", title: "Continuous Growth", desc: "We invest in ongoing training, technology, and infrastructure to keep improving our standard of care." },
];

const team = [
  { icon: "person", name: "Dr. Arjun Mehta", role: "Chief Medical Officer", bio: "20+ years in internal medicine. Pioneer in telemedicine and digital health adoption." },
  { icon: "person", name: "Dr. Priya Sharma", role: "Head of Cardiology", bio: "Internationally trained cardiologist. Published researcher in preventive cardiac care." },
  { icon: "person", name: "person", role: "CTO", bio: "Former Google engineer building the AI infrastructure powering our diagnostic platform." },
  { icon: "person", name: "Dr. Nisha Patel", role: "Head of Research", bio: "Leads our clinical trials division and oversees integration of new treatment protocols." },
];

const timeline = [
  { year: "2016", title: "Founded in Ahmedabad", desc: "MediCare launched with a single clinic and a vision to make quality healthcare accessible to everyone." },
  { year: "2018", title: "Digital Platform Launch", desc: "Introduced our online appointment system, serving over 5,000 patients in the first year." },
  { year: "2020", title: "Telemedicine Expansion", desc: "Pivoted rapidly during the pandemic to deliver 100,000+ virtual consultations across India." },
  { year: "2022", title: "AI Diagnostics Integration", desc: "Launched our AI-assisted diagnostic tools, reducing average diagnosis time by 40%." },
  { year: "2024", title: "18 Cities, 340+ Specialists", desc: "Expanded our network nationally, making MediCare one of India's fastest-growing health platforms." },
];

const tickerItems = ["Compassionate Care", "340+ Specialists", "24/7 Emergency", "AI-Assisted Diagnostics", "18 Cities", "98% Satisfaction"];

const About = () => {
  const rootRef = useRef(null);
  const [heroVis, setHeroVis] = useState(false);
  useReveal(rootRef);

  useEffect(() => {
    const t = setTimeout(() => setHeroVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="ab-root" ref={rootRef}>
        <div className="ab-bg-grid" />

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div className="ab-hero-accent" />
          <div className="ab-hero-inner">
            <div className="ab-hero-left">
              <div className={`ab-fade-up ${heroVis ? "vis" : ""}`}>
                <div className="ab-eyebrow"><div className="ab-eyebrow-line" />Our Story</div>
                <h1 className="ab-hero-h1">
                  Healthcare Built<br />
                  on <em>Trust</em> &<br />
                  Compassion
                </h1>
                <p className="ab-hero-desc">
                  Founded in 2016, MediCare has grown from a single clinic into one of India's most
                  trusted digital health platforms — serving thousands of patients with cutting-edge
                  care and genuine human connection.
                </p>
                <div className="ab-hero-pills">
                  {["Our Mission", "Our Team", "Our Values", "Our Journey"].map((p, i) => (
                    <span key={p} className={`ab-pill${i === 0 ? " active" : ""}`}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="ab-hero-right">
              {stats.map(({ icon, num, suf, lbl }, i) => (
                <div key={lbl} className={`ab-stat-card ${heroVis ? "vis" : ""}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                  <div className="ab-stat-icon">
                    <Icon name={icon} size={24} className="text-primary" weight={400} />
                  </div>
                  <div>
                    <div className="ab-stat-num">{num}<span>{suf}</span></div>
                    <div className="ab-stat-lbl">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="ab-section">
          <div className="ab-fade-up">
            <div className="ab-section-label">Our Mission</div>
            <h2 className="ab-section-h2">Why We <em>Exist</em></h2>
          </div>
          <div className="ab-mission-grid">
            <div className="ab-mission-text ab-fade-up d1">
              <p>
                We believe <strong>quality healthcare is a fundamental right</strong>, not a privilege.
                MediCare was founded on the principle that every person — regardless of where they live
                or their economic background — deserves access to experienced doctors and modern medical care.
              </p>
              <p>
                Our platform bridges the gap between patients and specialists using technology, reducing
                wait times and geographic barriers that have historically limited access to good healthcare.
              </p>
              <p>
                We combine the <strong>warmth of a family doctor</strong> with the capabilities of a
                major hospital network — all accessible from your phone, your home, or our clinics.
              </p>
            </div>
            <div className="ab-mission-visual ab-fade-up d2">
              <div style={{ position: "relative", width: 300, height: 300 }}>
                <div className="ab-mission-ring">
                  <div className="ab-mission-ring-inner text-primary">
                    <Icon name="medical_services" size={60} weight={300} />
                  </div>
                </div>
                {[
                  { top: "8%", left: "50%", delay: "0s" },
                  { top: "50%", left: "95%", delay: "1s" },
                  { top: "88%", left: "50%", delay: "2s" },
                  { top: "50%", left: "2%", delay: "1.5s" },
                ].map((pos, i) => (
                  <div key={i} className="ab-orbit-dot" style={{
                    top: pos.top, left: pos.left,
                    animation: `pulse-dot 2s ease-in-out ${pos.delay} infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="ab-divider"><div className="ab-divider-line" /></div>

        {/* ── VALUES ── */}
        <section className="ab-section">
          <div className="ab-fade-up">
            <div className="ab-section-label">What We Stand For</div>
            <h2 className="ab-section-h2">Our Core <em>Values</em></h2>
            <p className="ab-section-sub">These principles guide every decision we make — from product design to patient interactions.</p>
          </div>
          <div className="ab-values-grid">
            {values.map(({ icon, title, desc }) => (
              <div className="ab-value-card" key={title}>
                <div className="ab-value-icon">
                  <Icon name={icon} size={24} className="text-primary" weight={400} />
                </div>
                <div className="ab-value-title">{title}</div>
                <div className="ab-value-desc">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="ab-divider"><div className="ab-divider-line" /></div>

        {/* ── TEAM ── */}
        <section className="ab-section">
          <div className="ab-fade-up">
            <div className="ab-section-label">The People</div>
            <h2 className="ab-section-h2">Meet Our <em>Leadership</em></h2>
            <p className="ab-section-sub">Passionate experts united by a single goal — better health for everyone.</p>
          </div>
          <div className="ab-team-grid">
            {team.map(({ icon, name, role, bio }) => (
              <div className="ab-team-card" key={name}>
                <div className="ab-team-avatar text-primary">
                  <div className="ab-team-avatar-bg" />
                  <Icon name={icon} size={64} weight={200} />
                </div>
                <div className="ab-team-info">
                  <div className="ab-team-name">{name}</div>
                  <div className="ab-team-role">{role}</div>
                  <div className="ab-team-bio">{bio}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="ab-divider"><div className="ab-divider-line" /></div>

        {/* ── TIMELINE ── */}
        <section className="ab-section">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div className="ab-fade-up">
              <div className="ab-section-label">Our Journey</div>
              <h2 className="ab-section-h2">How We <em>Grew</em></h2>
              <p className="ab-section-sub" style={{ marginBottom: 0 }}>
                Eight years of growth, innovation, and relentless focus on the patient experience.
              </p>
            </div>
            <div className="ab-timeline">
              {timeline.map(({ year, title, desc }) => (
                <div className="ab-tl-item" key={year}>
                  <div className="ab-tl-dot" />
                  <div className="ab-tl-year">{year}</div>
                  <div className="ab-tl-title">{title}</div>
                  <div className="ab-tl-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <div className="ab-cta-band">
          <div className="ab-cta-inner">
            <h2 className="ab-cta-h2">
              Ready to Experience<br /><em>Better Healthcare?</em>
            </h2>
            <div className="ab-cta-btns">
              <button className="ab-cta-btn-primary">Book a Consultation →</button>
              <button className="ab-cta-btn-ghost">Meet Our Doctors</button>
            </div>
          </div>
        </div>

        {/* ── TICKER ── */}
        <div className="ab-ticker-wrap">
          <div className="ab-ticker">
            {[...Array(2)].flatMap((_, i) =>
              tickerItems.map((item, j) => (
                <span className="ab-tick-item" key={`${i}-${j}`}>
                  {item}<span className="ab-tick-sep">✦</span>
                </span>
              ))
            )}
          </div>
        </div>

        <style>{`
          @keyframes pulse-dot {
            0%,100% { transform: scale(1); opacity: 1; }
            50%      { transform: scale(1.6); opacity: .5; }
          }
        `}</style>
      </div>
    </>
  );
};

export default About;