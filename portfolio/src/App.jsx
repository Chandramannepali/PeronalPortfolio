import { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Publication from "./components/Publication";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import { PortfolioDataProvider } from "./context/PortfolioDataContext";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <PortfolioDataProvider>
      <Navbar />
      
      <div className="snap-container">
        <div id="hero" className="snap-section">
          <Hero />
        </div>

        <div id="skills" className="snap-section">
          <Skills />
        </div>

        <div id="projects" className="snap-section">
          <Projects />
        </div>

        <div id="experience" className="snap-section">
          <Experience />
        </div>

        <div id="publication" className="snap-section">
          <Publication />
        </div>

        <div id="education" className="snap-section">
          <Education />
        </div>

        <div id="certifications" className="snap-section">
          <Certifications />
        </div>

        <div id="contact" className="snap-section">
          <Contact />
          <Footer onAdminClick={() => setShowAdmin(true)} />
        </div>
      </div>

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </PortfolioDataProvider>
  );
}
