import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import { useInView } from "../hooks/useInView";
import { FaAward } from "react-icons/fa";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -50, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Certifications() {
  const { certificationsData } = usePortfolio();
  const [ref, inView] = useInView(0.1);

  return (
    <section id="certifications">
      <div className="section-inner" ref={ref}>
        <motion.p className="section-label"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >Credentials</motion.p>
        <motion.h2 className="section-title"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >Certifications</motion.h2>

        <motion.div 
          className="cert-list"
          variants={listVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", maxWidth: "100%" }}
        >
          {certificationsData.map((cert, i) => (
            <motion.div
              className="cert-item"
              key={i}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                borderColor: "var(--accent)",
                boxShadow: "0 10px 25px rgba(200,241,53,0.08)",
                backgroundColor: "rgba(200,241,53,0.02)"
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "1.25rem 1.75rem",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                transition: "border-color 0.3s, background-color 0.3s, box-shadow 0.3s",
                cursor: "pointer"
              }}
            >
              <div className="cert-badge" style={{
                color: "var(--accent)",
                background: "rgba(200,241,53,0.08)",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <FaAward size={16} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", width: "100%" }}>
                <span className="cert-name" style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text)" }}>{cert.name}</span>
                <span className="cert-issuer" style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cert.issuer}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
