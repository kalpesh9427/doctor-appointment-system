import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Featured from "../components/Featured";
import HealthSpecialities from "../components/HealthSpecialities";
import HowItWorks from "../components/HowItWorks";
import OurDoctors from "../components/OurDoctors";
import Testimonial from "../components/Testimonial";
import Mission from "../components/Mission";
import Gallery from "../components/Gallery";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";

const Home = () => {
  const { navigate } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[var(--cream)]">

      <Hero />
      <Featured />
      <HealthSpecialities />
      <HowItWorks />
      <OurDoctors />
      <Testimonial />
      <Mission />
      <Gallery />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Home;