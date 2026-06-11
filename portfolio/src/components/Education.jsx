import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import { useInView } from "../hooks/useInView";
import TiltCard from "./TiltCard";
import { FaGraduationCap, FaUniversity } from "react-icons/fa";

export default function Education() {
  const { educationData } = usePortfolio();
  const [ref, inView] = useInView(0.1);

  return (
    <section id="education" className="skills-section">
      <div className="section-inner" ref={ref}>
        <motion.p className="section-label"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >Academic Background</motion.p>
        <motion.h2 className="section-title"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >Education</motion.h2>
        
        <div className="edu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {educationData.map((ed, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 60, rotateX: 15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="edu-card" style={{ position: "relative", overflow: "hidden", padding: "2.5rem", height: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Background Image with subtle overlay */}
                <div 
                  className="edu-card-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${i === 0 ? '/assets/jnn.jpg' : '/assets/mjp.jpg'})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.08,
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    zIndex: 0,
                    pointerEvents: "none"
                  }}
                />
                
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                  <div style={{
                    color: "var(--accent2)",
                    background: "rgba(74,240,196,0.08)",
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {i === 0 ? <FaGraduationCap size={22} /> : <FaUniversity size={20} />}
                  </div>
                  <div>
                    <div className="edu-degree" style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>{ed.degree}</div>
                    <div className="edu-inst" style={{ margin: "0.25rem 0 0", color: "var(--accent2)", fontSize: "0.8rem" }}>{ed.institution}</div>
                  </div>
                </div>

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", pt: "1rem", position: "relative", zIndex: 1 }}>
                  <div className="edu-period" style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>{ed.period}</div>
                  <motion.span className="edu-cgpa"
                    whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(200,241,53,0.3)" }}
                    style={{ margin: 0 }}
                  >
                    {ed.cgpa}
                  </motion.span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
