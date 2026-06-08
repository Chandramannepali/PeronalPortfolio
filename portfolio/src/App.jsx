import "./index.css";
import CustomCursor from "./components/CustomCursor";
import Particles from "./components/Particles";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Publication from "./components/Publication";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Particles />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Skills />
      <Projects />
      <Experience />
      <Publication />
      <Education />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}
