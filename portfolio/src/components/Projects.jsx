import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import { useInView } from "../hooks/useInView";
import TiltCard from "./TiltCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TokenizationDemo, FarmLinkDemo, AmmasPicklesDemo, AbhayDentalDemo } from "./ProjectDemos";

export default function Projects() {
  const { projectsData } = usePortfolio();
  const [ref, inView] = useInView(0.05);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [openDemo, setOpenDemo] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxSlide = isMobile ? projectsData.length - 1 : projectsData.length - 2;

  const nextSlide = () => {
    if (currentSlide < maxSlide) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setCurrentSlide(0); // loop back
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    } else {
      setCurrentSlide(maxSlide);
    }
  };

  const toggleDemo = (num) => {
    setOpenDemo((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <section id="projects">
      <div className="section-inner" ref={ref}>
        <motion.p className="section-label"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >What I've built</motion.p>
        <motion.h2 className="section-title"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >Projects</motion.h2>

        <div className="projects-slider-container">
          <div className="projects-slider-window">
            <motion.div 
              className="projects-slider-track"
              animate={{ x: isMobile ? `calc(-${currentSlide} * (100vw - 1.5rem))` : `calc(-${currentSlide} * (50vw - 3rem))` }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              {projectsData.map((p, i) => (
                <div className="projects-slider-card-wrapper" key={p.number}>
                  <div className="flip-card-container">
                    <div className={`flip-card-inner ${openDemo[p.number] ? "flipped" : ""}`}>
                      
                      {/* FRONT FACE: Project Info */}
                      <div className="flip-card-front">
                        <TiltCard className="project-card" style={{ position: "relative", overflow: "hidden", padding: "0", height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                          {/* Project Image Container */}
                          <div className="project-image-container" style={{ overflow: "hidden", position: "relative", height: "150px" }}>
                            <img 
                              src={p.image} 
                              alt={p.title} 
                              className="project-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                              }}
                            />
                            <div className="project-image-overlay" />
                          </div>
                          <div className="project-card-body" style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                            <div className="project-number">{p.number} / Project</div>
                            <h3 className="project-title" style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>{p.title}</h3>
                            <div className="project-stack">
                              {p.stack.map((s) => <span className="stack-tag" key={s}>{s}</span>)}
                            </div>
                            <ul className="project-bullets" style={{ marginBottom: "1rem" }}>
                              {p.bullets.slice(0, 2).map((b, j) => (
                                <li key={j} style={{ fontSize: "0.78rem", lineHeight: "1.3", marginBottom: "0.25rem" }}>
                                  {b}
                                </li>
                              ))}
                            </ul>

                            {/* Try Simulator Button */}
                            <button
                              onClick={() => toggleDemo(p.number)}
                              className="btn btn-outline"
                              style={{
                                width: "100%",
                                marginTop: "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                borderStyle: "dashed",
                                borderColor: "var(--accent)",
                                color: "var(--accent)",
                                padding: "0.6rem 1rem",
                                fontSize: "0.7rem",
                              }}
                            >
                              Try Interactive Simulator
                            </button>
                          </div>
                        </TiltCard>
                      </div>

                      {/* BACK FACE: Interactive Simulator */}
                      <div className="flip-card-back">
                        <div className="project-card" style={{ position: "relative", overflow: "hidden", padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <div>
                              <div className="project-number" style={{ marginBottom: "0.2rem" }}>{p.number} / Interactive Simulator</div>
                              <h3 className="project-title" style={{ fontSize: "1.1rem", margin: 0 }}>{p.title}</h3>
                            </div>
                          </div>
                          
                          <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.25rem", marginBottom: "1rem" }}>
                            {p.number === "01" && <TokenizationDemo />}
                            {p.number === "02" && <FarmLinkDemo />}
                            {p.number === "03" && <AmmasPicklesDemo />}
                            {p.number === "04" && <AbhayDentalDemo />}
                          </div>

                          <button
                            onClick={() => toggleDemo(p.number)}
                            className="btn btn-outline"
                            style={{
                              width: "100%",
                              marginTop: "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                              borderStyle: "dashed",
                              borderColor: "var(--accent2)",
                              color: "var(--accent2)",
                              padding: "0.6rem 1rem",
                              fontSize: "0.7rem",
                            }}
                          >
                            Hide Simulator
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Button at Right Corner */}
          {currentSlide < maxSlide && (
            <button 
              className="slider-nav-btn btn-next" 
              onClick={nextSlide}
              title="Next Project"
            >
              <FiChevronRight size={24} />
            </button>
          )}
          {currentSlide > 0 && (
            <button 
              className="slider-nav-btn btn-prev" 
              onClick={prevSlide}
              title="Previous Project"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
