import { CheckIcon } from "lucide-react";
import { assets } from "../assets/assets.js";
const Mission = () => {
  const valueData = ["Integrity", "Respect", "Innovation", "Excellence"];
  return (
    <div className="bg-primary py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center md:flex-row gap-4">
        {/* left section  */}
        <div className="flex flex-col gap-5 text-white w-full md:w-1/2">
          <h1 className="text-white text-5xl mt-10 font-semibold capitalize px-1">
            {" "}
            Mission and Values
          </h1>
          <p className="px-2">
            Our mission is to provide exceptional healthcare services with
            compassion, innovation, and excellence, ensuring every patient
            receives personalized care.
          </p>
          <p className="px-2">
            {" "}
            We are guided by integrity, respect, and commitment to quality,
            working together to build healthier communities and inspire trust.
          </p>

          {valueData.map((value, index) => (
            <div key={index} className="font-semibold flex gap-4 items-center">
              <CheckIcon className="w-6 h-6 text-secondary" /> <p>{value}</p>
            </div>
          ))}
        </div>
        {/* right section  */}
        <div className="flex items-center justify-center gap-4 w-full md:w-1/2 mt-12">
          <img src={assets.mission_img1} alt="" />
          <img src={assets.mission_img2} alt="" className="hidden md:block" />
        </div>
      </div>
    </div>
  );
};
export default Mission;
