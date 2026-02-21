import { useContext } from "react";
import { doctorsData } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import { StarIcon } from "lucide-react";
const OurDoctors = () => {
  const { navigate } = useContext(AppContext);
  return (
    <div className="py-16 bg-[#EBEBFE] ">
      <h1 className="text-3xl md:text-5xl font-semibold text-gray-700 text-center capitalize">
        Our <span className="text-secondary">Specialist</span> Doctors
      </h1>
      <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto px-4">
        {" "}
        Our team of highly qualified specialists is dedicated to providing
        expert care tailored to your unique health needs.
      </p>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-5 mt-10">
        {doctorsData.map((doctor, index) => (
          <div
            key={index}
            className="bg-white flex flex-col md:flex-row items-center gap-6 p-4 w-[350px] md:w-[500px] mx-auto border border-gray-300 rounded-2xl"
          >
            <img src={doctor.image} alt="" />
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-700">
                {doctor.name}
              </h2>
              <p>{doctor.specialty}</p>
              <p className="flex items-center gap-2">
                Rating:{doctor.rating}{" "}
                <StarIcon className="w-5 h-5 text-yellow-500" />
              </p>
              <button
                onClick={() => {
                  navigate("/doctor-details/" + doctor._id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="border border-secondary text-primary hover:bg-secondary hover:text-white transition-all duration-200 py-2 px-4 rounded-full cursor-pointer mt-2"
              >
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OurDoctors;
