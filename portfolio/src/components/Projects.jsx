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
  const [openDemo, setOpenDemo] = useState({});
  const [timelineProgress, setTimelineProgress] = useState(0);

  const nextSlide = () => {
    setTimelineProgress(0);
    setCurrentSlide((prev) => (prev + 1) % projectsData.length);
  };

  const prevSlide = () => {
    setTimelineProgress(0);
    setCurrentSlide((prev) => (prev - 1 + projectsData.length) % projectsData.length);
  };

  useEffect(() => {
    // If any interactive simulator is open/flipped, pause autoplay
    const isAnyDemoOpen = Object.values(openDemo).some(Boolean);
    if (isAnyDemoOpen) {
      setTimelineProgress(0);
      return;
    }

    const interval = 100; // update progress every 100ms
    const totalDuration = 10000; // 10 seconds
    const increment = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setTimelineProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % projectsData.length);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentSlide, openDemo, projectsData.length]);

  const toggleDemo = (num) => {
    setOpenDemo((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <section id="projects">
      <div className="section-inner" ref={ref}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <motion.p className="section-label"
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >What I've built</motion.p>
            <motion.h2 className="section-title" style={{ margin: 0 }}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >Projects</motion.h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="deck-nav-btn" onClick={prevSlide} title="Previous Project">
              <FiChevronLeft size={20} />
            </button>
            <button className="deck-nav-btn" onClick={nextSlide} title="Next Project">
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Timeline Indicator */}
        <div className="project-timeline-container">
          <div className="project-timeline-track">
            <motion.div 
              className="project-timeline-bar" 
              style={{ width: `${timelineProgress}%` }}
            />
          </div>
          <div className="project-timeline-text">
            <span>{projectsData[currentSlide]?.title}</span>
            <span>
              {Object.values(openDemo).some(Boolean) 
                ? "Autoplay Paused (Testing Simulator)" 
                : `${Math.ceil((10000 - (timelineProgress / 100) * 10000) / 1000)}s remaining`
              }
            </span>
          </div>
        </div>

        <div className="projects-stack-container">
          {projectsData.map((p, i) => {
            const total = projectsData.length;
            const pos = (i - currentSlide + total) % total;
            const isActive = pos === 0;

            return (
              <motion.div
                key={p.number}
                className="projects-stack-card-wrapper"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  originX: 0.5,
                  originY: 0.5,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                animate={{
                  zIndex: total - pos,
                  opacity: pos === 3 ? 0 : 1 - pos * 0.22,
                  scale: 1 - pos * 0.04,
                  y: pos * 22,
                  rotate: pos === 0 ? 0 : pos % 2 === 0 ? pos * 1.5 : pos * -1.5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 22,
                }}
              >
                <div className="flip-card-container">
                  <div className={`flip-card-inner ${openDemo[p.number] ? "flipped" : ""}`}>
                    
                    {/* FRONT FACE: Project Info */}
                    <div className="flip-card-front">
                      <TiltCard className="project-card" style={{ position: "relative", overflow: "hidden", padding: "0", height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
