import { motion } from "framer-motion";
import { projectsData } from "../data/portfolioData";
import { useInView } from "../hooks/useInView";
import TiltCard from "./TiltCard";

export default function Projects() {
  const [ref, inView] = useInView(0.05);

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
        <div className="projects-grid">
          {projectsData.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="project-card" style={{ position: "relative", overflow: "hidden", padding: "0" }}>
                {/* Project Image Container */}
                <div className="project-image-container" style={{ overflow: "hidden", position: "relative", height: "200px" }}>
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="project-image"
                    onError={(e) => {
                      // fallback to standard gradient if file is missing
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
                <div className="project-card-body" style={{ padding: "2rem" }}>
                  <div className="project-number">{p.number} / Project</div>
                  <h3 className="project-title">{p.title}</h3>
                  <div className="project-stack">
                    {p.stack.map((s) => <span className="stack-tag" key={s}>{s}</span>)}
                  </div>
                  <ul className="project-bullets">
                    {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
