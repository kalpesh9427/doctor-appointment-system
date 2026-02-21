import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const HealthSpecialities = () => {
  const { healthSpecialties, navigate } = useContext(AppContext);
  return (
    <div className="py-16 bg-[#EBEBFE]">
      <h1 className="text-3xl md:text-5xl text-center font-bold my-6">
        Our Healthcare <span className="text-primary">Specialties</span>
      </h1>
      <p className="max-w-xl text-lg font-medium mx-auto">
        {" "}
        Our healthcare specialties cover a wide range of medical services
        designed to meet every patient’s unique needs. From routine checkups to
        advanced treatments, we ensure expert care at every step.
      </p>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-center">
        {healthSpecialties.map((specialty, index) => (
          <div
            key={index}
            onClick={() => {
              navigate("/services");
              window.scrollTo(0, 0);
            }}
            className="flex flex-col items-center justify-center bg-white hover:bg-[#9DDFF9] duration-300 transition-all max-w-[300px]  mx-auto border border-gray-200 my-4 p-2 rounded-2xl cursor-pointer"
          >
            <img src={specialty.image} alt="" className="w-18" />
            <p className="text-lg font-semibold">{specialty.name}</p>
            <p className="max-w-xs text-sm">{specialty.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HealthSpecialities;
