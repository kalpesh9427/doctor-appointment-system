import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --ink:        #0F172A;
    --ink-2:      #334155;
    --ink-3:      #64748B;
    --purple:     #6C63FF;
    --purple-dk:  #5A52D5;
    --purple-pl:  #F0EFFF;
    --cream:      #F8FAFC;
    --line:       #E2E8F0;
    --danger:     #EF4444;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: var(--cream);
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  /* ── grid bg ── */
  .lg-bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(to right, rgba(107,101,229,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(107,101,229,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
    pointer-events: none; z-index: 0;
  }

  /* ── left panel ── */
  .lg-left {
    position: relative; z-index: 1;
    background: linear-gradient(160deg, #6C63FF 0%, #5A52D5 100%);
    display: flex; flex-direction: column;
    justify-content: center; padding: 60px;
    overflow: hidden;
  }
  .lg-left::after {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    mix-blend-mode: overlay; opacity: .5;
    pointer-events: none;
  }

  /* decorative circles */
  .lg-dec-circle {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.15);
    pointer-events: none;
  }
  .lg-dec-1 { width: 340px; height: 340px; top: -80px; right: -80px; }
  .lg-dec-2 { width: 200px; height: 200px; bottom: 60px; left: -40px; opacity: .6; }
  .lg-dec-3 { width: 120px; height: 120px; bottom: 200px; right: 40px; opacity: .4; }

  .lg-left-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 60px; position: relative; z-index: 1;
  }
  .lg-left-logo-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }
  .lg-left-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 700;
    color: #fff; letter-spacing: -0.02em;
  }

  .lg-left-content { position: relative; z-index: 1; }
  .lg-left-tag {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.7);
    margin-bottom: 20px;
  }
  .lg-left-tag::before {
    content: ''; width: 24px; height: 1.5px;
    background: rgba(255,255,255,0.5); border-radius: 1px;
  }
  .lg-left-h {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 3vw, 2.8rem);
    font-weight: 700; line-height: 1.15;
    color: #fff; margin-bottom: 18px; letter-spacing: -0.02em;
  }
  .lg-left-h em { font-style: italic; opacity: .85; }
  .lg-left-sub {
    font-size: 0.95rem; line-height: 1.75;
    color: rgba(255,255,255,0.65); font-weight: 300;
    max-width: 360px; margin-bottom: 44px;
  }

  .lg-trust-row {
    display: flex; gap: 24px; flex-wrap: wrap;
  }
  .lg-trust-item {
    display: flex; flex-direction: column; gap: 3px;
  }
  .lg-trust-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1;
  }
  .lg-trust-lbl {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(255,255,255,0.55);
  }
  .lg-trust-divider {
    width: 1px; background: rgba(255,255,255,0.2);
    align-self: stretch; margin: 0 4px;
  }

  /* ── right panel ── */
  .lg-right {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 60px 48px;
  }

  .lg-card {
    width: 100%; max-width: 420px;
  }

  .lg-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700;
    color: var(--ink); margin-bottom: 6px; letter-spacing: -0.02em;
  }
  .lg-card-title em { font-style: italic; color: var(--purple); }
  .lg-card-sub {
    font-size: 0.9rem; color: var(--ink-3);
    font-weight: 300; margin-bottom: 32px; line-height: 1.6;
  }

  /* role tabs */
  .lg-role-tabs {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-bottom: 28px;
  }
  .lg-role-tab {
    padding: 12px; border-radius: 11px;
    border: 1.5px solid var(--line); background: transparent;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 0.85rem; font-weight: 500; color: var(--ink-3);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    transition: all .18s;
  }
  .lg-role-tab span:first-child { font-size: 1.4rem; }
  .lg-role-tab.active {
    border-color: var(--purple); background: var(--purple-pl);
    color: var(--purple-dk); font-weight: 600;
  }
  .lg-role-tab:hover:not(.active) { border-color: rgba(107,101,229,0.3); color: var(--ink); }

  /* fields */
  .lg-field { margin-bottom: 14px; }
  .lg-label {
    display: block; font-size: 0.78rem; font-weight: 600;
    color: var(--ink-2); margin-bottom: 7px; letter-spacing: 0.02em;
  }
  .lg-input-wrap {
    display: flex; align-items: center; gap: 10px;
    border: 1.5px solid var(--line); border-radius: 10px;
    padding: 0 14px; background: #fff;
    transition: border-color .16s, box-shadow .16s;
  }
  .lg-input-wrap:focus-within {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px rgba(107,101,229,0.1);
  }
  .lg-input-wrap svg { color: var(--ink-3); flex-shrink: 0; }
  .lg-input {
    flex: 1; padding: 12px 0; border: none; outline: none;
    background: transparent; font-family: 'Inter', sans-serif;
    font-size: 0.9rem; color: var(--ink);
  }
  .lg-input::placeholder { color: var(--ink-3); }
  .lg-eye {
    background: none; border: none; cursor: pointer;
    color: var(--ink-3); display: flex; align-items: center;
    padding: 0; transition: color .14s;
    flex-shrink: 0;
  }
  .lg-eye:hover { color: var(--purple); }

  /* forgot */
  .lg-forgot {
    display: block; text-align: right; font-size: 0.78rem;
    font-weight: 500; color: var(--purple);
    text-decoration: none; margin-top: 6px;
    transition: opacity .14s;
  }
  .lg-forgot:hover { opacity: .75; }

  /* submit */
  .lg-submit {
    width: 100%; padding: 13px; border-radius: 10px; border: none;
    background: var(--purple); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 700;
    cursor: pointer; margin-top: 22px; letter-spacing: 0.02em;
    box-shadow: 0 4px 20px rgba(107,101,229,0.35);
    transition: background .18s, transform .16s, box-shadow .18s;
    position: relative; overflow: hidden;
  }
  .lg-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  }
  .lg-submit:hover {
    background: var(--purple-dk); transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(107,101,229,0.42);
  }
  .lg-submit:active { transform: translateY(0); }
  .lg-submit:disabled { opacity: .68; cursor: not-allowed; transform: none; }

  /* loading shimmer */
  .lg-submit.loading::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: lg-shimmer 1.2s ease-in-out infinite;
  }
  @keyframes lg-shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  .lg-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0; color: var(--ink-3); font-size: 0.78rem;
  }
  .lg-divider::before, .lg-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--line);
  }

  .lg-signup-row {
    text-align: center; font-size: 0.875rem; color: var(--ink-3); margin-top: 18px;
  }
  .lg-signup-link {
    color: var(--purple); font-weight: 600; text-decoration: none;
    margin-left: 4px; transition: opacity .14s;
  }
  .lg-signup-link:hover { opacity: .75; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .lg-root { grid-template-columns: 1fr; }
    .lg-left { display: none; }
    .lg-right { padding: 40px 24px; align-items: flex-start; padding-top: 60px; }
  }
`;

const Login = () => {
  const { setUser, setLoading, loading, setDoctor, setToken } = useContext(AppContext);
  const routerNavigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login({ email: formData.email, password: formData.password, role });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); setDoctor(user.role === "doctor"); setToken(token);
      if (user.role === "doctor") {
        try { await authAPI.getDoctorProfile(); } catch {}
      }
      toast.success(`Welcome back!`);
      routerNavigate(user.role === "doctor" ? "/doctor-dashboard" : "/");
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="lg-root">
        <div className="lg-bg-grid" />

        {/* ── LEFT PANEL ── */}
        <div className="lg-left">
          <div className="lg-dec-circle lg-dec-1" />
          <div className="lg-dec-circle lg-dec-2" />
          <div className="lg-dec-circle lg-dec-3" />

          <div className="lg-left-logo">
            <div className="lg-left-logo-icon">⚕</div>
            <span className="lg-left-logo-text">MediCare</span>
          </div>

          <div className="lg-left-content">
            <div className="lg-left-tag">Trusted Healthcare</div>
            <h2 className="lg-left-h">
              Your Health,<br />Our <em>Priority</em>
            </h2>
            <p className="lg-left-sub">
              Access world-class doctors, book appointments instantly, and manage
              your health records — all in one place.
            </p>
            <div className="lg-trust-row">
              <div className="lg-trust-item">
                <div className="lg-trust-num">12K+</div>
                <div className="lg-trust-lbl">Patients</div>
              </div>
              <div className="lg-trust-divider" />
              <div className="lg-trust-item">
                <div className="lg-trust-num">340+</div>
                <div className="lg-trust-lbl">Doctors</div>
              </div>
              <div className="lg-trust-divider" />
              <div className="lg-trust-item">
                <div className="lg-trust-num">98%</div>
                <div className="lg-trust-lbl">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lg-right">
          <div className="lg-card">
            <h1 className="lg-card-title">Welcome <em>Back</em></h1>
            <p className="lg-card-sub">Sign in to your MediCare account to continue.</p>

            {/* Role selector */}
            <div className="lg-role-tabs">
              <button
                type="button"
                className={`lg-role-tab${role === "patient" ? " active" : ""}`}
                onClick={() => setRole("patient")}
              >
                <span>🧑‍💼</span><span>Patient</span>
              </button>
              <button
                type="button"
                className={`lg-role-tab${role === "doctor" ? " active" : ""}`}
                onClick={() => setRole("doctor")}
              >
                <span>👨‍⚕️</span><span>Doctor</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="lg-field">
                <label className="lg-label">Email Address</label>
                <div className="lg-input-wrap">
                  <Mail size={16} />
                  <input
                    className="lg-input" type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" required
                  />
                </div>
              </div>

              <div className="lg-field">
                <label className="lg-label">Password</label>
                <div className="lg-input-wrap">
                  <Lock size={16} />
                  <input
                    className="lg-input" type={showPwd ? "text" : "password"}
                    name="password" value={formData.password} onChange={handleChange}
                    placeholder="Enter your password" required
                  />
                  <button type="button" className="lg-eye" onClick={() => setShowPwd(p => !p)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <a href="#" className="lg-forgot">Forgot password?</a>
              </div>

              <button
                type="submit"
                className={`lg-submit${loading ? " loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing in…" : `Sign In as ${role === "doctor" ? "Doctor" : "Patient"}`}
              </button>
            </form>

            <div className="lg-divider">or</div>

            <div className="lg-signup-row">
              Don't have an account?
              <Link to="/signup" className="lg-signup-link">Create one →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;