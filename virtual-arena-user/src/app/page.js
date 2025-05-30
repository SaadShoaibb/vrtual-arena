'use client'; 
import About from "./components/About";
import Connected from "./components/Connected";
import Contact from "./components/Contact";
import Calender from "./components/Events";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Offers from "./components/Offers";
import Package from "./components/Package";
import Plans from "./components/Plans";
import Testimonials from "./components/Testimonials";
import VRPackage from "./components/VrPackages";
import WhyChoose from "./components/WhyChoose";


export default function Home() {



  return (
    <>
      

      <div className="relative " >
        <Navbar 
        />

        <HeroSection />
        <About />
        <Offers />
        <Experience />
        <Plans />
        <Package />
        <Calender />
        <Gallery />
        <VRPackage />
        <WhyChoose />
        <Testimonials />
        <Contact />
        <Connected />
        <Footer />
      </div>

    </>
  );
}
