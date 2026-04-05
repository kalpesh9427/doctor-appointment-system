import { useContext, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const Hero = () => {
  let navigate;
  try {
    const { AppContext } = require("../context/AppContext");
    const ctx = useContext(AppContext);
    navigate = ctx?.navigate;
  } catch {
    navigate = (path) => (window.location.href = path);
  }

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => { clearTimeout(t); window.removeEventListener("mousemove", handleMouse); };
  }, []);

  const stats = [
    { value: "12K+", label: "Patients Served", icon: "group" },
    { value: "98%", label: "Satisfaction", icon: "stars" },
    { value: "340+", label: "Specialists", icon: "stethoscope" },
  ];

  const services = ["General Medicine", "Cardiology", "Neurology"];
  const tickerItems = ["24/7 Emergency Care", "Online Appointments", "Lab Reports", "Specialist Referrals", "Prescription Management", "Follow-up Reminders"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --ink: #0F172A;
          --ink-2: #334155;
          --ink-3: #64748B;
          --teal: #6C63FF;
          --teal-dark: #5A52D5;
          --teal-pale: #F0EFFF;
          --cream: #F8FAFC;
          --warm: #F1F5F9;
          --line: #E2E8F0;
          --red-accent: #EF4444;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-root {
          font-family: 'Inter', sans-serif;
          background: var(--cream);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Grid overlay ── */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(107,101,229,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(107,101,229,0.06) 1px, transparent 1px);
          background-size: 72px 72px;
          pointer-events: none;
        }

        /* ── Teal accent block ── */
        .hero-accent-block {
          position: absolute;
          top: 0; right: 0;
          width: 38%;
          height: 100%;
          background: linear-gradient(160deg, #6C63FF 0%, #5A52D5 100%);
          clip-path: polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%);
          z-index: 0;
        }

        /* noise texture on accent */
        .hero-accent-block::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
          opacity: 0.4;
          mix-blend-mode: overlay;
        }

        /* ── Mouse-tracking glow ── */
        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%);
          pointer-events: none;
          transition: transform 0.6s cubic-bezier(.22,.68,0,1.2);
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        /* ── Main content ── */
        .hero-body {
          flex: 1;
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 0;
          padding: 0 60px;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── Left column ── */
        .hero-left {
          padding: 72px 48px 72px 0;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .8s ease, transform .8s ease;
        }
        .hero-left.vis { opacity: 1; transform: translateY(0); }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 24px;
        }
        .hero-eyebrow-line {
          width: 32px; height: 2px;
          background: var(--teal);
          border-radius: 1px;
        }

        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 4.5vw, 4rem);
          font-weight: 900;
          color: var(--ink);
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .hero-h1 .italic {
          font-style: italic;
          color: var(--teal);
        }
        .hero-h1 .underline-word {
          position: relative;
          white-space: nowrap;
        }
        .hero-h1 .underline-word::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 0; right: 0;
          height: 4px;
          background: var(--teal);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1s ease .6s;
        }
        .hero-left.vis .hero-h1 .underline-word::after {
          transform: scaleX(1);
        }

        .hero-desc {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--ink-3);
          max-width: 430px;
          margin-bottom: 40px;
          font-weight: 300;
        }

        /* service tabs */
        .hero-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .hero-tab {
          padding: 7px 16px;
          border-radius: 6px;
          border: 1.5px solid var(--line);
          background: transparent;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--ink-3);
          cursor: pointer;
          transition: all .2s ease;
        }
        .hero-tab.active {
          border-color: var(--teal);
          background: var(--teal-pale);
          color: var(--teal-dark);
        }
        .hero-tab:hover:not(.active) {
          border-color: var(--ink-3);
          color: var(--ink);
        }

        /* buttons */
        .hero-btns {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .btn-primary {
          padding: 14px 32px;
          border-radius: 10px;
          border: none;
          background: var(--teal);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background .22s, transform .18s, box-shadow .22s;
          box-shadow: 0 4px 20px rgba(108,99,255,0.35);
        }
        .btn-primary:hover {
          background: var(--teal-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(108,99,255,0.45);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-outline {
          padding: 14px 32px;
          border-radius: 10px;
          border: 1.5px solid var(--ink);
          background: transparent;
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: all .22s;
        }
        .btn-outline:hover {
          background: var(--ink);
          color: #fff;
          transform: translateY(-2px);
        }
        .btn-outline:active { transform: translateY(0); }

        /* ── Stats ── */
        .hero-stats {
          display: flex;
          gap: 0;
          margin-top: 56px;
          border-top: 1px solid var(--line);
          padding-top: 32px;
        }
        .hero-stat {
          flex: 1;
          padding-right: 24px;
          border-right: 1px solid var(--line);
          transition: opacity .6s ease, transform .6s ease;
        }
        .hero-stat:first-child { padding-left: 0; }
        .hero-stat:last-child { border-right: none; padding-right: 0; padding-left: 24px; }
        .hero-stat:not(:first-child):not(:last-child) { padding-left: 24px; }
        .hero-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 4px;
        }
        .hero-stat-num span { color: var(--teal); }
        .hero-stat-lbl {
          font-size: 0.76rem;
          color: var(--ink-3);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Right column ── */
        .hero-right {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 72px 0 72px 48px;
          opacity: 0;
          transform: translateX(24px);
          transition: opacity .9s ease .2s, transform .9s ease .2s;
        }
        .hero-right.vis { opacity: 1; transform: translateX(0); }

        /* big circle illustration */
        .hero-circle {
          width: 340px; height: 340px;
          border-radius: 50%;
          background: rgba(108,99,255,0.10);
          border: 2px solid rgba(108,99,255,0.22);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .hero-circle-inner {
          width: 260px; height: 260px;
          border-radius: 50%;
          background: rgba(108,99,255,0.15);
          border: 2px solid rgba(108,99,255,0.28);
          display: flex; align-items: center; justify-content: center;
          font-size: 5rem;
        }

        /* floating cards on the right */
        .fcard {
          position: absolute;
          background: #fff;
          border-radius: 14px;
          padding: 14px 18px;
          border: 1px solid var(--line);
          box-shadow: 0 8px 32px rgba(11,15,26,0.1);
          animation: fcard-float 5s ease-in-out infinite;
          pointer-events: none;
        }
        .fcard-1 { top: 12%; right: -10%; animation-delay: 0s; min-width: 160px; }
        .fcard-2 { bottom: 22%; left: -8%; animation-delay: 2s; min-width: 140px; }
        .fcard-3 { top: 55%; right: -6%; animation-delay: 1.2s; min-width: 130px; }

        @keyframes fcard-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }

        .fcard-label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-3);
          margin-bottom: 6px;
          font-weight: 500;
        }
        .fcard-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--ink);
          line-height: 1.1;
        }
        .fcard-sub {
          font-size: 0.72rem;
          color: var(--teal);
          margin-top: 3px;
          font-weight: 500;
        }
        .fcard-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 6px;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: .6; }
        }

        /* corner decoration */
        .hero-corner-dec {
          position: absolute;
          top: 18%; left: -5%;
          width: 80px; height: 80px;
          border: 2px solid var(--teal);
          border-radius: 50%;
          opacity: 0.3;
        }
        .hero-corner-dec-2 {
          position: absolute;
          bottom: 24%; right: -3%;
          width: 50px; height: 50px;
          border: 2px solid var(--teal);
          border-radius: 50%;
          opacity: 0.2;
        }

        /* ── Ticker ── */
        .hero-ticker-wrap {
          position: relative;
          z-index: 20;
          overflow: hidden;
          padding: 13px 0;
          background: #6C63FF;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .hero-ticker {
          display: flex;
          gap: 64px;
          animation: ticker 26s linear infinite;
          width: max-content;
          white-space: nowrap;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-item {
          font-size: 0.76rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 12px;
        }
        .ticker-sep { color: rgba(255,255,255,0.5); font-size: 0.9rem; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero-body { grid-template-columns: 1fr; padding: 0 24px; }
          .hero-right { display: none; }
          .hero-left { padding: 48px 0 48px 0; }
          .hero-accent-block { display: none; }
        }
      `}</style>

      <div className="hero-root" ref={heroRef}>
        {/* grid */}
        <div className="hero-grid" />

        {/* accent block */}
        <div className="hero-accent-block" />

        {/* mouse glow */}
        <div
          className="hero-glow"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />

        {/* ── Body ── */}
        <main className="hero-body">
          {/* Left */}
          <div className={`hero-left ${isVisible ? "vis" : ""}`}>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              Trusted Patient Care Platform
            </div>

            <h1 className="hero-h1">
              Modern Care<br />
              for <span className="italic">Every</span> Patient<br />
              <span className="underline-word">When It Matters</span>
            </h1>

            <p className="hero-desc">
              Our experienced doctors and modern facilities ensure you receive
              the best treatment — compassionate, reliable care for you and your
              loved ones, available any time.
            </p>

            <div className="hero-tabs">
              {services.map((s, i) => (
                <button
                  key={s}
                  className={`hero-tab ${activeTab === i ? "active" : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="hero-btns">
              <button className="btn-primary" onClick={() => navigate?.("/doctors")}>
                Get Consultation →
              </button>
              <button className="btn-outline" onClick={() => navigate?.("/doctors")}>
                Book Appointment
              </button>
            </div>

            <div className="hero-stats">
              {stats.map(({ value, label, icon }) => {
                const num = value.replace(/[^0-9]/g, "");
                const suffix = value.replace(/[0-9]/g, "");
                return (
                  <div className="hero-stat" key={label}>
                    <div className="hero-stat-num">
                      <Icon name={icon} size={28} className="text-primary mr-2" weight={400} />
                      {num}<span>{suffix}</span>
                    </div>
                    <div className="hero-stat-lbl">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div className={`hero-right ${isVisible ? "vis" : ""}`}>
            <div className="hero-corner-dec" />
            <div className="hero-corner-dec-2" />

            <div className="hero-circle">
              <div className="hero-circle-inner text-primary">
                <Icon name="stethoscope" size={100} weight={300} />
              </div>
            </div>

            {/* Floating cards */}
            <div className="fcard fcard-1">
              <div className="fcard-label">Today's Appointments</div>
              <div className="fcard-value">24 Patients</div>
              <div className="fcard-sub">↑ 12% from yesterday</div>
            </div>

            <div className="fcard fcard-2">
              <div className="fcard-label">Status</div>
              <div className="fcard-value">
                <span className="fcard-dot" />Online
              </div>
              <div className="fcard-sub">340 doctors active</div>
            </div>

            <div className="fcard fcard-3">
              <div className="fcard-label">Avg. Wait Time</div>
              <div className="fcard-value">8 min</div>
              <div className="fcard-sub">Well below average</div>
            </div>
          </div>
        </main>

        {/* ── Ticker ── */}
        <div className="hero-ticker-wrap">
          <div className="hero-ticker">
            {[...Array(2)].flatMap((_, i) =>
              tickerItems.map((item, j) => (
                <span className="ticker-item" key={`${i}-${j}`}>
                  {item}
                  <span className="ticker-sep">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;