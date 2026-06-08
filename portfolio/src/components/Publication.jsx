import { motion } from "framer-motion";
import { publicationData } from "../data/portfolioData";
import { useInView } from "../hooks/useInView";
import TiltCard from "./TiltCard";
import { FaGraduationCap, FaExternalLinkAlt } from "react-icons/fa";

export default function Publication() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="publication">
      <div className="section-inner" ref={ref}>
        <motion.p className="section-label"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >Research & Analytics</motion.p>
        <motion.h2 className="section-title"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >Publication</motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TiltCard className="pub-card" style={{ maxWidth: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "center" }}>
            {/* Scientific badge representation */}
            <div className="pub-icon-badge" style={{
              width: "70px",
              height: "70px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(200,241,53,0.1) 0%, rgba(74,240,196,0.1) 100%)",
              border: "1px solid rgba(200,241,53,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              flexShrink: 0
            }}>
              <FaGraduationCap size={32} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div className="pub-label" style={{ margin: 0, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--accent2)" }}>
                {publicationData.type}
              </div>
              <h3 className="pub-title" style={{ margin: "0.5rem 0", fontSize: "1.3rem", fontWeight: "600", color: "var(--text)" }}>
                {publicationData.title}
              </h3>
              <div className="pub-meta" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                {publicationData.meta}
              </div>
              <div className="pub-role" style={{ fontSize: "0.85rem", color: "var(--muted)", borderLeft: "2px solid var(--accent)", paddingLeft: "1rem", marginTop: "0.5rem" }}>
                {publicationData.role}
              </div>

              {/* Action Link */}
              <div style={{ marginTop: "1rem" }}>
                <motion.a 
                  href="#"
                  className="read-paper-btn" 
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--accent)",
                    textDecoration: "none",
                    border: "1px solid rgba(200,241,53,0.3)",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    background: "rgba(200,241,53,0.02)"
                  }}
                >
                  View Publication <FaExternalLinkAlt size={9} />
                </motion.a>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
