import { assets } from "../assets/assets";
import Icon from "./Icon";

const Footer = () => {
  return (
    <footer className="bg-[var(--ink)] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--purple)] opacity-[0.05] rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="section-container !py-0 flex flex-col items-center relative z-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--purple)] flex items-center justify-center text-xl font-bold">
            <Icon name="medical_services" size={20} fill={true} weight={400} />
          </div>
          <span className="text-2xl font-black font-playfair tracking-tight">MediCare</span>
        </div>
        
        <p className="text-white/40 text-center max-w-xl text-lg font-light leading-relaxed mb-12">
          Your health, our priority — trusted doctors and modern care for a
          healthier tomorrow.
        </p>

        <div className="w-full max-w-2xl bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-sm mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">Newsletter</h3>
            <p className="text-white/50 text-sm font-light">
              Subscribe to receive the latest health updates and wellness tips.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[var(--purple)]/50 transition-colors text-white placeholder:text-white/20"
              type="email"
              placeholder="Enter your email id"
              required
            />
            <button
              type="submit"
              className="px-10 py-4 bg-[var(--purple)] hover:bg-[var(--purple-dk)] text-white font-bold rounded-2xl transition-all shadow-[0_10px_20px_rgba(107,101,229,0.3)] active:scale-95"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6 text-white/30 text-xs font-bold tracking-[0.1em] uppercase">
          <p>MediCare © {new Date().getFullYear()}. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[var(--purple)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--purple)] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[var(--purple)] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
