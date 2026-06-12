import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import { useInView } from "../hooks/useInView";
import TiltCard from "./TiltCard";
import { FaBriefcase } from "react-icons/fa";

export default function Experience() {
  const { experienceData } = usePortfolio();
  const [ref, inView] = useInView(0.1);

  return (
    <section className="exp-section" style={{ position: "relative", overflow: "hidden" }}>
      <div className="section-inner" ref={ref}>
        <motion.p className="section-label"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >Where I've worked</motion.p>
        <motion.h2 className="section-title"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >Experience</motion.h2>

        {/* Timeline Container */}
        <div className="timeline-container" style={{ position: "relative", paddingLeft: "3rem", margin: "2rem 0" }}>
          {/* Vertical Glowing Line */}
          <motion.div 
            className="timeline-line" 
            initial={{ height: 0 }}
            animate={inView ? { height: "100%" } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "15px",
              top: 0,
              width: "2px",
              background: "linear-gradient(to bottom, var(--accent), var(--accent2), transparent)",
              transformOrigin: "top"
            }}
          />

          {experienceData.map((exp, i) => (
            <div key={i} className="timeline-item" style={{ position: "relative", marginBottom: "4rem" }}>
              {/* Glowing Indicator Dot */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                style={{
                  position: "absolute",
                  left: "-3.5rem",
                  top: "10px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--surface)",
                  border: "2px solid var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 15px rgba(200,241,53,0.4)",
                  color: "var(--accent)",
                  zIndex: 2
                }}
              >
                <FaBriefcase size={12} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="exp-card" style={{ display: "block" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    <div>
                      <h3 className="exp-role" style={{ margin: 0 }}>{exp.role}</h3>
                      <div className="exp-company" style={{ margin: "0.25rem 0 0" }}>{exp.company}</div>
                    </div>
                    <div className="exp-period" style={{ alignSelf: "flex-start" }}>{exp.period}</div>
                  </div>
                  <ul className="exp-bullets">
                    {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </TiltCard>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
