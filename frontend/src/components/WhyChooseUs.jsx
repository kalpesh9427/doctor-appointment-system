import { assets, benefitsData } from "../assets/assets.js";
const WhyChooseUs = () => {
  return (
    <div className="py-16 bg-[#F7F7FF]">
      <div className=" max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* left section  */}
        <div className="md:w-1/2 space-y-6">
          <img src={assets.why_choose_us} alt="" />
        </div>

        {/* Right section  */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-700 capitalize">
            State <span className="text-secondary">-of</span>{" "}
            <span className="text-secondary">-the</span>
            <span className="text-secondary">-Art</span> <br />
            Technology
          </h1>
          <p className=" text-gray-600 mt-4 max-w-2xl mx-auto px-4">
            {" "}
            Equipped with the latest advancements, we use cutting-edge
            technology to ensure accuracy, efficiency, and top-quality outcomes.
          </p>
          <div>
            {benefitsData.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 mb-4 border border-black p-4 shadow-lg rounded-xl"
              >
                <img src={item.image} alt="" className="w-10" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    {item.heading}
                  </h2>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhyChooseUs;
