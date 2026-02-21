import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="py-16 w-full bg-[#231F53] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="flex items-center  space-x-3 mb-6">
          <img src={assets.logo} alt="" className="h-11" />
        </div>
        <p className="text-gray-400 text-center max-w-xl text-sm font-normal leading-relaxed">
          {" "}
          Your health, our priority — trusted doctors and modern care for a
          healthier tomorrow.
        </p>
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <p className="md:text-lg text-gray-400 pb-8">
            {" "}
            Subscribe to receive the latest health updates, wellness tips, and
            exclusive patient services.
          </p>
          <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
            <input
              className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
              type="text"
              placeholder="Enter your email id"
              required
            />
            <button
              type="submit"
              className="md:px-12 px-8 h-full text-white bg-secondary  transition-all cursor-pointer rounded-md rounded-l-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p>Doctor wise ©2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
