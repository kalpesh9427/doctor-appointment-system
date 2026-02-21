import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets.js";
const Hero = () => {
  const { navigate } = useContext(AppContext);
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${assets.hero_img})` }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#756FEF] to-transparent"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl text-center md:text-7xl font-bold text-white mt-20 md:mt-72 leading-24">
          Top-notch Medical Care <br /> When You Need It
        </h1>
        <p className="text-white max-w-lg text-center text-lg mt-4">
          {" "}
          Our experienced doctors and modern facilities ensure you receive the
          best treatment, anytime you need it. We’re here to provide
          compassionate, reliable care for you and your loved ones.
        </p>

        <div className="flex flex-col md:flex-row gap-2 items-center md:gap-5">
          <button
            onClick={() => navigate("/doctors")}
            className="bg-secondary text-white rounded-md py-3 px-10 cursor-pointer mt-8 hover:bg-primary duration-300 transition-all hover:scale-105"
          >
            {" "}
            Get Consultation
          </button>
          <button
            onClick={() => navigate("/doctors")}
            className="bg-primary text-white rounded-md py-3 px-10 cursor-pointer mt-8 hover:bg-secondary duration-300 transition-all hover:scale-105"
          >
            {" "}
            Get Appointment
          </button>
        </div>
      </div>
    </div>
  );
};
export default Hero;
