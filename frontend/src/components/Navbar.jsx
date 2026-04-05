import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, User, X, Search, Calendar, Stethoscope,
  Home, Info, Phone, Bot, Zap, Lock, Send, LogOut
} from "lucide-react";
import toast from "react-hot-toast";
import aiService from "../services/aiService";
import Icon from "./Icon";

const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

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
    --danger-bg:  rgba(239,68,68,0.1);
  }

  * { box-sizing: border-box; }

  .nav-root {
    font-family: 'Inter', sans-serif;
    position: sticky; top: 0; z-index: 100;
    background: rgba(253,252,255,0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line);
  }

  .nav-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 60px; height: 66px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 24px;
  }

  /* ── logo ── */
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; flex-shrink: 0;
  }
  .nav-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--purple);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1rem;
    transition: background .18s;
  }
  .nav-logo:hover .nav-logo-icon { background: var(--purple-dk); }
  .nav-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem; font-weight: 700;
    color: var(--ink); letter-spacing: -0.02em;
  }

  /* ── links ── */
  .nav-links {
    display: flex; align-items: center; gap: 2px;
    list-style: none; margin: 0; padding: 0;
  }
  .nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 8px;
    font-size: 0.875rem; font-weight: 500;
    color: var(--ink-3); text-decoration: none;
    transition: color .16s, background .16s;
    white-space: nowrap;
  }
  .nav-link svg { opacity: 0.6; transition: opacity .16s; }
  .nav-link:hover { color: var(--ink); background: rgba(107,101,229,0.06); }
  .nav-link:hover svg { opacity: 1; }
  .nav-link.active { color: var(--purple); background: var(--purple-pl); font-weight: 600; }
  .nav-link.active svg { opacity: 1; }

  /* ── action buttons ── */
  .nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .nav-icon-btn {
    width: 36px; height: 36px;
    border: 1.5px solid var(--line); border-radius: 9px;
    background: transparent; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3);
    transition: color .16s, border-color .16s, background .16s;
  }
  .nav-icon-btn:hover {
    color: var(--purple); border-color: rgba(107,101,229,0.35);
    background: var(--purple-pl);
  }

  .nav-ai-btn {
    width: 36px; height: 36px; border-radius: 9px; border: none;
    background: var(--purple); color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 14px rgba(107,101,229,0.32);
    transition: background .18s, transform .16s, box-shadow .18s;
  }
  .nav-ai-btn:hover {
    background: var(--purple-dk); transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(107,101,229,0.42);
  }

  .nav-signin {
    padding: 8px 20px; border-radius: 8px;
    border: 1.5px solid var(--ink); background: transparent;
    color: var(--ink); font-family: 'Inter', sans-serif;
    font-size: 0.875rem; font-weight: 600; cursor: pointer;
    transition: background .16s, color .16s; white-space: nowrap;
  }
  .nav-signin:hover { background: var(--ink); color: #fff; }

  /* ── user dropdown ── */
  .nav-user-wrap { position: relative; }
  .nav-user-btn {
    width: 36px; height: 36px; border-radius: 9px;
    border: 1.5px solid var(--purple); background: var(--purple-pl);
    color: var(--purple); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .16s;
  }
  .nav-user-btn:hover { background: rgba(107,101,229,0.18); }

  .nav-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    width: 215px; background: var(--cream);
    border: 1px solid var(--line); border-radius: 14px;
    box-shadow: 0 12px 40px rgba(11,15,26,0.11);
    opacity: 0; transform: scale(0.95) translateY(-6px);
    pointer-events: none; transform-origin: top right;
    transition: opacity .16s ease, transform .16s ease;
    overflow: hidden;
  }
  .nav-user-wrap:hover .nav-dropdown, .nav-dropdown.open {
    opacity: 1; transform: scale(1) translateY(0); pointer-events: all;
  }
  .nav-dropdown-header { padding: 13px 15px 10px; border-bottom: 1px solid var(--line); }
  .nav-dropdown-name { font-weight: 600; color: var(--ink); font-size: 0.875rem; margin: 0 0 2px; }
  .nav-dropdown-role { font-size: 0.72rem; color: var(--ink-3); text-transform: capitalize; margin: 0; }
  .nav-dropdown-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 15px; font-size: 0.845rem; color: var(--ink-2);
    text-decoration: none; cursor: pointer;
    background: none; border: none; width: 100%; text-align: left;
    font-family: 'Inter', sans-serif;
    transition: background .13s, color .13s;
  }
  .nav-dropdown-item:hover { background: rgba(107,101,229,0.06); color: var(--ink); }
  .nav-dropdown-item.accent { color: var(--purple); font-weight: 500; }
  .nav-dropdown-item.accent:hover { background: var(--purple-pl); }
  .nav-dropdown-item.danger { color: var(--danger); }
  .nav-dropdown-item.danger:hover { background: var(--danger-bg); }
  .nav-dropdown-divider { height: 1px; background: var(--line); margin: 4px 0; }

  /* ── SEARCH OVERLAY ── */
  .nav-overlay {
    position: fixed; inset: 0;
    background: rgba(11,15,26,0.38);
    backdrop-filter: blur(6px); z-index: 200;
    display: flex; align-items: flex-start; justify-content: center;
    padding-top: 110px; animation: nav-fade .16s ease;
  }
  @keyframes nav-fade { from { opacity: 0; } to { opacity: 1; } }
  .nav-search-card {
    width: 100%; max-width: 540px; margin: 0 20px;
    background: var(--cream); border: 1px solid var(--line);
    border-radius: 18px; padding: 24px;
    box-shadow: 0 20px 60px rgba(11,15,26,0.16);
    animation: nav-slide .2s cubic-bezier(.22,.68,0,1.2);
  }
  @keyframes nav-slide {
    from { transform: translateY(-14px) scale(.97); opacity: 0; }
    to   { transform: translateY(0) scale(1); opacity: 1; }
  }
  .nav-search-top {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .nav-search-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--ink); margin: 0; }
  .nav-search-row {
    display: flex; align-items: center; gap: 10px;
    border: 1.5px solid var(--line); border-radius: 10px;
    padding: 4px 4px 4px 13px; background: #fff;
    transition: border-color .16s;
  }
  .nav-search-row:focus-within { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(107,101,229,0.1); }
  .nav-search-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'Inter', sans-serif; font-size: 0.95rem; color: var(--ink); padding: 9px 0;
  }
  .nav-search-input::placeholder { color: var(--ink-3); }
  .nav-search-submit {
    padding: 9px 20px; border-radius: 8px; border: none;
    background: var(--purple); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: background .16s; white-space: nowrap;
  }
  .nav-search-submit:hover { background: var(--purple-dk); }

  /* ── AI PANEL ── */
  .nav-ai-wrap {
    position: fixed; inset: 0;
    background: rgba(11,15,26,0.38);
    backdrop-filter: blur(6px); z-index: 200;
    display: flex; align-items: flex-end; justify-content: flex-end;
    padding: 20px; animation: nav-fade .16s ease;
  }
  @media (min-width: 640px) { .nav-ai-wrap { align-items: center; } }
  .nav-ai-panel {
    width: 100%; max-width: 375px; height: 555px;
    background: var(--cream); border: 1px solid var(--line);
    border-radius: 20px; display: flex; flex-direction: column;
    box-shadow: 0 24px 70px rgba(11,15,26,0.18);
    animation: nav-slide .2s cubic-bezier(.22,.68,0,1.2);
    overflow: hidden;
  }
  .nav-ai-header {
    padding: 15px 17px; background: var(--ink);
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .nav-ai-header-left { display: flex; align-items: center; gap: 10px; }
  .nav-ai-avatar {
    width: 33px; height: 33px; border-radius: 9px; background: var(--purple);
    display: flex; align-items: center; justify-content: center;
  }
  .nav-ai-name { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: #fff; margin: 0 0 1px; }
  .nav-ai-status { font-size: 0.68rem; color: rgba(255,255,255,0.5); letter-spacing: 0.04em; }
  .nav-ai-status-dot {
    display: inline-block; width: 6px; height: 6px; border-radius: 50%;
    background: #22c55e; margin-right: 5px;
    animation: ai-pulse 2s ease-in-out infinite;
  }
  @keyframes ai-pulse { 0%,100% { transform:scale(1);opacity:1; } 50% { transform:scale(1.5);opacity:.55; } }
  .nav-ai-x {
    width: 28px; height: 28px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.14); background: transparent;
    color: rgba(255,255,255,0.65); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .14s, color .14s;
  }
  .nav-ai-x:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .nav-ai-messages {
    flex: 1; overflow-y: auto; padding: 15px;
    display: flex; flex-direction: column; gap: 10px;
    scrollbar-width: thin; scrollbar-color: var(--line) transparent;
  }
  .nav-msg-row { display: flex; }
  .nav-msg-row.user { justify-content: flex-end; }
  .nav-msg-bubble {
    max-width: 84%; padding: 10px 13px;
    border-radius: 14px; font-size: 0.845rem; line-height: 1.55;
  }
  .nav-msg-row.user .nav-msg-bubble {
    background: var(--purple); color: #fff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 3px 12px rgba(107,101,229,0.3);
  }
  .nav-msg-row.assistant .nav-msg-bubble {
    background: #fff; color: var(--ink-2);
    border: 1px solid var(--line); border-bottom-left-radius: 4px;
  }
  .nav-msg-time { font-size: 0.65rem; margin-top: 5px; opacity: 0.48; }

  .nav-ai-footer { padding: 11px 13px 14px; flex-shrink: 0; border-top: 1px solid var(--line); }
  .nav-ai-input-row {
    display: flex; gap: 8px;
    border: 1.5px solid var(--line); border-radius: 10px;
    padding: 4px 4px 4px 12px; background: #fff;
    transition: border-color .16s;
  }
  .nav-ai-input-row:focus-within { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(107,101,229,0.1); }
  .nav-ai-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'Inter', sans-serif; font-size: 0.845rem; color: var(--ink); padding: 7px 0;
  }
  .nav-ai-input::placeholder { color: var(--ink-3); }
  .nav-ai-send {
    width: 31px; height: 31px; border-radius: 8px; border: none;
    background: var(--purple); color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; align-self: center; transition: background .16s;
  }
  .nav-ai-send:hover { background: var(--purple-dk); }
  .nav-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .nav-chip {
    padding: 5px 12px; border-radius: 20px;
    border: 1.5px solid var(--line); background: transparent;
    font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 500;
    color: var(--purple); cursor: pointer;
    transition: background .14s, border-color .14s;
  }
  .nav-chip:hover { background: var(--purple-pl); border-color: var(--purple); }

  /* ── MOBILE ── */
  .nav-mobile-only { display: none; }
  .nav-desktop-only { display: flex; }
  @media (max-width: 860px) {
    .nav-inner { padding: 0 20px; }
    .nav-desktop-only { display: none; }
    .nav-mobile-only { display: flex; }
  }
  .nav-mobile-drawer {
    border-top: 1px solid var(--line); background: var(--cream);
    padding: 10px 20px 18px; animation: nav-slide-down .18s ease;
  }
  @keyframes nav-slide-down {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nav-mobile-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 9px;
    font-size: 0.9rem; font-weight: 500; color: var(--ink-3);
    text-decoration: none; cursor: pointer;
    background: none; border: none; width: 100%; text-align: left;
    font-family: 'Inter', sans-serif;
    transition: color .14s, background .14s;
  }
  .nav-mobile-link:hover { background: rgba(107,101,229,0.06); color: var(--ink); }
  .nav-mobile-link.active { color: var(--purple); background: var(--purple-pl); font-weight: 600; }
  .nav-mobile-link.danger { color: var(--danger); }
  .nav-mobile-link.danger:hover { background: var(--danger-bg); }
  .nav-mobile-divider { height: 1px; background: var(--line); margin: 8px 0; }
  .nav-mobile-user { padding: 8px 12px 4px; }
  .nav-mobile-user-name { font-weight: 600; color: var(--ink); font-size: 0.875rem; }
  .nav-mobile-user-role { font-size: 0.72rem; color: var(--ink-3); text-transform: capitalize; margin-top: 1px; }
  .nav-mobile-signin {
    width: 100%; padding: 11px; border-radius: 9px;
    border: 1.5px solid var(--ink); background: transparent;
    color: var(--ink); font-family: 'Inter', sans-serif;
    font-size: 0.9rem; font-weight: 600; cursor: pointer; margin-top: 8px;
    transition: background .16s, color .16s;
  }
  .nav-mobile-signin:hover { background: var(--ink); color: #fff; }
`;

const Navbar = () => {
  let navigate, user, setUser, doctor;
  try {
    const ctx = useContext(AppContext);
    ({ navigate, user, setUser, doctor } = ctx);
  } catch {
    navigate = (p) => (window.location.href = p);
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "Hello! I'm your medical assistant. How can I help you today?", timestamp: new Date() }
  ]);
  const [aiInput, setAiInput] = useState("");
  const aiMsgEnd = useRef(null);
  const location = useLocation?.() ?? { pathname: "/" };

  const menus = [
    { name: "Home", link: "/", icon: Home },
    { name: "Doctors", link: "/doctors", icon: Stethoscope },
    { name: "Services", link: "/services", icon: Zap },
    { name: "About", link: "/about", icon: Info },
    { name: "Contact", link: "/contact", icon: Phone },
  ];

  const isActive = (p) => location.pathname === p;

  useEffect(() => { aiMsgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages]);
  useEffect(() => {
    const fn = () => setAiOpen(true);
    window.addEventListener("openAIAssistantFromApp", fn);
    return () => window.removeEventListener("openAIAssistantFromApp", fn);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser?.(null);
    toast?.success("Logout successful.");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    const msg = { role: "user", content: aiInput, timestamp: new Date() };
    setAiMessages(p => [...p, msg]);
    const q = aiInput; setAiInput("");
    try {
      const res = await aiService.processQuery(q, { user });
      setAiMessages(p => [...p, { role: "assistant", content: res.response, timestamp: new Date() }]);
    } catch {
      setAiMessages(p => [...p, { role: "assistant", content: "Sorry, I'm having trouble. Please try again.", timestamp: new Date() }]);
    }
  };

  const quickActions = aiService?.getSuggestedQuickActions?.() ?? [
    { text: "Find specialist", query: "Find a specialist" },
    { text: "Book today", query: "Book an appointment today" },
    { text: "Emergency", query: "Emergency care" },
  ];

  return (
    <>
      <style>{NAV_STYLES}</style>

      <header className="nav-root">
        <div className="nav-inner">

          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <Icon name="medical_services" size={18} fill={true} weight={400} />
            </div>
            <span className="nav-logo-text">MediCare</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop-only" style={{ flex: 1, justifyContent: "center" }}>
            <ul className="nav-links">
              {menus.map(({ name, link, icon: Icon }) => (
                <li key={name}>
                  <Link to={link} className={`nav-link${isActive(link) ? " active" : ""}`}>
                    <Icon size={14} />{name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop actions */}
          <div className="nav-actions nav-desktop-only">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} title="Search" type="button">
              <Search size={16} />
            </button>
            <button className="nav-ai-btn" onClick={() => setAiOpen(true)} title="AI Assistant" type="button">
              <Bot size={16} />
            </button>
            {user ? (
              <div className="nav-user-wrap">
                <button className="nav-user-btn" type="button" title={user.name}><User size={15} /></button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <p className="nav-dropdown-name">{user?.name}</p>
                    <p className="nav-dropdown-role">{user?.role}</p>
                  </div>
                  <Link to="/profile" className="nav-dropdown-item"><User size={14} />My Profile</Link>
                  <Link to="/my-appointments" className="nav-dropdown-item"><Calendar size={14} />My Appointments</Link>
                  {doctor && <Link to="/doctor-dashboard" className="nav-dropdown-item accent"><Stethoscope size={14} />Doctor Dashboard</Link>}
                  <div className="nav-dropdown-divider" />
                  <Link to="/admin/login" className="nav-dropdown-item accent"><Lock size={14} />Admin Panel</Link>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item danger" onClick={handleLogout} type="button"><LogOut size={14} />Logout</button>
                </div>
              </div>
            ) : (
              <button className="nav-signin" onClick={() => navigate("/login")} type="button">Sign In</button>
            )}
          </div>

          {/* Mobile actions */}
          <div className="nav-actions nav-mobile-only">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} type="button"><Search size={16} /></button>
            <button className="nav-ai-btn" onClick={() => setAiOpen(true)} type="button"><Bot size={16} /></button>
            <button className="nav-icon-btn" onClick={() => setMenuOpen(!menuOpen)} type="button">
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="nav-mobile-drawer">
            {menus.map(({ name, link, icon: Icon }) => (
              <Link key={name} to={link}
                className={`nav-mobile-link${isActive(link) ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}>
                <Icon size={15} />{name}
              </Link>
            ))}
            {user ? (
              <>
                <div className="nav-mobile-divider" />
                <div className="nav-mobile-user">
                  <div className="nav-mobile-user-name">{user.name}</div>
                  <div className="nav-mobile-user-role">{user.role}</div>
                </div>
                <Link to="/profile" className="nav-mobile-link" onClick={() => setMenuOpen(false)}><User size={15} />Profile</Link>
                <Link to="/my-appointments" className="nav-mobile-link" onClick={() => setMenuOpen(false)}><Calendar size={15} />My Appointments</Link>
                {doctor && <Link to="/doctor-dashboard" className="nav-mobile-link active" onClick={() => setMenuOpen(false)}><Stethoscope size={15} />Doctor Dashboard</Link>}
                <Link to="/admin/login" className="nav-mobile-link active" onClick={() => setMenuOpen(false)}><Lock size={15} />Admin Panel</Link>
                <div className="nav-mobile-divider" />
                <button className="nav-mobile-link danger" onClick={handleLogout} type="button"><LogOut size={15} />Logout</button>
              </>
            ) : (
              <button className="nav-mobile-signin" onClick={() => { navigate("/login"); setMenuOpen(false); }} type="button">
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div className="nav-overlay" onClick={() => setSearchOpen(false)}>
          <div className="nav-search-card" onClick={e => e.stopPropagation()}>
            <div className="nav-search-top">
              <h3 className="nav-search-title">Find a Doctor</h3>
              <button className="nav-icon-btn" onClick={() => setSearchOpen(false)} type="button"><X size={15} /></button>
            </div>
            <form onSubmit={handleSearch}>
              <div className="nav-search-row">
                <Search size={16} color="var(--ink-3)" style={{ flexShrink: 0 }} />
                <input
                  className="nav-search-input" type="text"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Name, specialty, or symptoms…" autoFocus
                />
                <button className="nav-search-submit" type="submit">Search</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── AI PANEL ── */}
      {aiOpen && (
        <div className="nav-ai-wrap" onClick={() => setAiOpen(false)}>
          <div className="nav-ai-panel" onClick={e => e.stopPropagation()}>
            <div className="nav-ai-header">
              <div className="nav-ai-header-left">
                <div className="nav-ai-avatar"><Bot size={16} color="#fff" /></div>
                <div>
                  <div className="nav-ai-name">Medical Assistant</div>
                  <div className="nav-ai-status"><span className="nav-ai-status-dot" />Online · Ready to help</div>
                </div>
              </div>
              <button className="nav-ai-x" onClick={() => setAiOpen(false)} type="button"><X size={14} /></button>
            </div>

            <div className="nav-ai-messages">
              {aiMessages.map((m, i) => (
                <div key={i} className={`nav-msg-row ${m.role}`}>
                  <div className="nav-msg-bubble">
                    {m.content}
                    <div className="nav-msg-time">
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={aiMsgEnd} />
            </div>

            <div className="nav-ai-footer">
              <form onSubmit={e => { e.preventDefault(); handleAI(); }}>
                <div className="nav-ai-input-row">
                  <input
                    className="nav-ai-input" value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    placeholder="Ask about doctors, appointments…"
                  />
                  <button className="nav-ai-send" type="submit"><Send size={14} /></button>
                </div>
              </form>
              <div className="nav-chips">
                {quickActions.map((a, i) => (
                  <button key={i} className="nav-chip" type="button" onClick={() => setAiInput(a.query)}>
                    {a.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;